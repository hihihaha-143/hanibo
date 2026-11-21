<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\CourseItem;
use App\Models\UserCourseProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseProgressController extends Controller
{
    private const PASS_PERCENT = 70;
    private const REWARDS = [1 => 3, 2 => 2, 3 => 1];

    public function index(Request $request): JsonResponse
    {
        $rows = UserCourseProgress::where('user_id', $request->user()->id)
            ->orderBy('course_item_id')
            ->get()
            ->map(fn (UserCourseProgress $progress) => [
                'course_item_id' => $progress->course_item_id,
                'words_percent' => $progress->words_percent,
                'grammar_percent' => $progress->grammar_percent,
                'final_percent' => $progress->final_percent,
                'test_percent' => $progress->test_percent,
            ]);

        return response()->json(['data' => $rows]);
    }

    public function update(Request $request, CourseItem $courseItem): JsonResponse
    {
        $data = $request->validate([
            'part' => ['required', 'in:words,grammar,final,test'],
            'percent' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $part = $data['part'];
        $percent = $data['percent'];
        $type = $courseItem->type;

        $valid = match ($type) {
            'lesson' => in_array($part, ['words', 'grammar', 'final'], true),
            'test' => $part === 'test',
            default => false,
        };

        if (!$valid) {
            return response()->json([
                'message' => 'Этот тип прогресса не подходит для материала.',
            ], 422);
        }

        $column = match ($part) {
            'words' => 'words_percent',
            'grammar' => 'grammar_percent',
            'final' => 'final_percent',
            'test' => 'test_percent',
        };

        /** @var User $user */
        $user = $request->user();
        $rewardAmount = 0;
        $rewardCurrency = null;

        $progress = DB::transaction(function () use (
            $user,
            $courseItem,
            $column,
            $percent,
            $part,
            $type,
            &$rewardAmount,
            &$rewardCurrency,
        ) {
            $progress = UserCourseProgress::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'course_item_id' => $courseItem->id,
                ],
            );

            $progress->{$column} = max($progress->{$column}, $percent);

            if (
                $percent >= self::PASS_PERCENT
                && ($part === 'final' || $part === 'test')
            ) {
                $tierColumn = $part === 'final'
                    ? 'lesson_reward_tier'
                    : 'test_reward_tier';
                $tier = (int) $progress->{$tierColumn};

                if ($tier < 3) {
                    $tier++;
                    $progress->{$tierColumn} = $tier;
                    $rewardAmount = self::REWARDS[$tier];
                    $rewardCurrency = $part === 'final' ? 'blueberry' : 'strawberry';
                    $user->increment($rewardCurrency, $rewardAmount);
                }
            }

            $progress->save();

            return $progress;
        });

        if ($rewardAmount > 0) {
            $user->refresh();
        }

        return response()->json([
            'progress' => [
                'course_item_id' => $progress->course_item_id,
                'words_percent' => $progress->words_percent,
                'grammar_percent' => $progress->grammar_percent,
                'final_percent' => $progress->final_percent,
                'test_percent' => $progress->test_percent,
            ],
            'reward' => [
                'amount' => $rewardAmount,
                'currency' => $rewardCurrency,
            ],
            'user' => $rewardAmount > 0 ? new UserResource($user) : null,
        ]);
    }
}
