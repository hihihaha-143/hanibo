<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserWord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserWordController extends Controller
{
    private const SRS_STEPS = [0, 1, 3, 7, 30];

    public function start(Request $request): JsonResponse
    {
        $data = $request->validate([
            'word_id' => ['required', 'integer', 'exists:words,id'],
        ]);

        $user = $request->user();

        $progress = UserWord::firstOrCreate(
            ['user_id' => $user->id, 'word_id' => $data['word_id']],
            [
                'mistakes_count' => 0,
                'correct_streak' => 0,
                'interval_days' => 0,
                'next_review_at' => null,
            ],
        );

        return response()->json($this->payload($progress), 201);
    }

    public function progress(Request $request): JsonResponse
    {
        $data = $request->validate([
            'word_id' => ['required', 'integer', 'exists:words,id'],
            'is_correct' => ['required', 'boolean'],
        ]);

        $user = $request->user();

        $progress = UserWord::firstOrCreate(
            ['user_id' => $user->id, 'word_id' => $data['word_id']],
            [
                'mistakes_count' => 0,
                'correct_streak' => 0,
                'interval_days' => 0,
                'next_review_at' => null,
            ],
        );

        if ($data['is_correct']) {
            $progress->correct_streak++;

            if ($progress->correct_streak >= 3) {
                $currentIndex = array_search(
                    $progress->interval_days,
                    self::SRS_STEPS,
                    true,
                );
                $nextIndex = min($currentIndex + 1, count(self::SRS_STEPS) - 1);
                $progress->interval_days = self::SRS_STEPS[$nextIndex];
                $progress->correct_streak = 0;

                if ($progress->interval_days >= 30) {
                    $progress->next_review_at = null;
                } else {
                    $progress->next_review_at = now()->addDays(
                        $progress->interval_days,
                    );
                }
            }
        } else {
            $progress->mistakes_count++;
            $progress->correct_streak = 0;
            $progress->interval_days = 0;
            $progress->next_review_at = now();
        }

        $progress->save();

        return response()->json($this->payload($progress));
    }

    public function destroy(Request $request, int $wordId): JsonResponse
    {
        $user = $request->user();

        UserWord::query()
            ->where('user_id', $user->id)
            ->where('word_id', $wordId)
            ->delete();

        return response()->json(['deleted' => true]);
    }

    private function payload(UserWord $progress): array
    {
        return [
            'word_id' => $progress->word_id,
            'mistakes_count' => $progress->mistakes_count,
            'correct_streak' => $progress->correct_streak,
            'interval_days' => $progress->interval_days,
            'next_review_at' => $progress->next_review_at?->toIso8601String(),
        ];
    }
}