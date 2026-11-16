<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserPhrase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserPhraseController extends Controller
{
    private const SRS_STEPS = [0, 1, 3, 7, 30];

    public function start(Request $request): JsonResponse
    {
        $data = $request->validate([
            'phrase_id' => ['required', 'integer', 'exists:phrases,id'],
        ]);

        $user = $request->user();

        $progress = UserPhrase::firstOrCreate(
            ['user_id' => $user->id, 'phrase_id' => $data['phrase_id']],
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
            'phrase_id' => ['required', 'integer', 'exists:phrases,id'],
            'is_correct' => ['required', 'boolean'],
        ]);

        $user = $request->user();

        $progress = UserPhrase::firstOrCreate(
            ['user_id' => $user->id, 'phrase_id' => $data['phrase_id']],
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
                $currentIndex = $currentIndex === false ? 0 : $currentIndex;

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

    public function destroy(Request $request, int $phraseId): JsonResponse
    {
        $user = $request->user();

        UserPhrase::query()
            ->where('user_id', $user->id)
            ->where('phrase_id', $phraseId)
            ->delete();

        return response()->json(['deleted' => true]);
    }

    private function payload(UserPhrase $progress): array
    {
        return [
            'phrase_id' => $progress->phrase_id,
            'mistakes_count' => $progress->mistakes_count,
            'correct_streak' => $progress->correct_streak,
            'interval_days' => $progress->interval_days,
            'next_review_at' => $progress->next_review_at?->toIso8601String(),
        ];
    }
}