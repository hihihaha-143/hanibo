<?php

namespace App\Http\Controllers;

use App\Models\AlphabetLetter;
use App\Models\AlphabetProgress;
use App\Services\Achievement\AlphabetAchievementService;
use App\Services\Streak\StreakService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AlphabetGroupProgressController extends Controller
{
    private const MAX_SCORE = 10;

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category' => ['required', 'string', 'in:vowel,consonant,diphthong,assimilation,all'],
            'letters' => ['required', 'array', 'min:1'],
            'letters.*.letter_id' => ['required', 'integer', 'exists:alphabet_letters,id'],
            'letters.*.correct' => ['required', 'integer', 'min:0'],
            'letters.*.total' => ['required', 'integer', 'min:1'],
        ]);

        $user = $request->user();

        $totalQuestions = 0;
        $totalCorrect = 0;
        foreach ($data['letters'] as $item) {
            $totalQuestions += $item['total'];
            $totalCorrect += min($item['correct'], $item['total']);
        }

        $percent = $totalQuestions > 0
            ? (int) round(($totalCorrect / $totalQuestions) * 100)
            : 0;

        $expEarned = 0;
        if ($percent === 100) {
            $expEarned = 50;
        } elseif ($percent > 50) {
            $expEarned = 20;
        }

        $blueberriesEarned = 0;
        if ($percent >= 100) {
            $blueberriesEarned = 3;
        } elseif ($percent >= 80) {
            $blueberriesEarned = 2;
        } elseif ($percent >= 50) {
            $blueberriesEarned = 1;
        }

        $actualBlueberries = 0;
        $lettersResult = [];

        DB::transaction(function () use (
            $data,
            $user,
            $blueberriesEarned,
            &$actualBlueberries,
            &$lettersResult
        ) {
            if ($blueberriesEarned > 0) {
                $actualBlueberries = $blueberriesEarned;
                $user->increment('blueberry', $actualBlueberries);
            }

            foreach ($data['letters'] as $item) {
                $letter = AlphabetLetter::find($item['letter_id']);
                if (!$letter) {
                    continue;
                }

                $correct = min($item['correct'], $item['total']);
                $total = $item['total'];

                if ($total === 1) {
                    $scoreAdded = $correct === 1 ? 1 : 0;
                } else {
                    $scoreAdded = $correct === $total ? 2 : ($correct > 0 ? 1 : 0);
                }

                $progress = AlphabetProgress::firstOrNew([
                    'user_id' => $user->id,
                    'letter_id' => $letter->id,
                ]);

                $scoreBefore = $progress->score ?? 0;
                $mistakesBefore = $progress->mistakes ?? 0;

                $progress->attempts = ($progress->attempts ?? 0) + 1;
                $progress->score = min(
                    self::MAX_SCORE,
                    $scoreBefore + $scoreAdded,
                );

                if ($correct === $total) {
                    $progress->mistakes = max(0, $mistakesBefore - 1);
                } else {
                    $progress->mistakes = $mistakesBefore + ($total - $correct);
                }

                $progress->save();

                $reachedMax = $scoreBefore < self::MAX_SCORE
                    && $progress->score >= self::MAX_SCORE;

                if ($reachedMax) {
                    $progress->mistakes = 0;
                    $progress->save();
                }

                $lettersResult[] = [
                    'letter_id' => $letter->id,
                    'score_added' => $scoreAdded,
                    'score' => $progress->score,
                    'attempts' => $progress->attempts,
                    'mistakes' => $progress->mistakes,
                    'max_score' => self::MAX_SCORE,
                    'reached_max' => $reachedMax,
                ];
            }
        });

        $streak = app(StreakService::class)->addExp($user, $expEarned);

        $anyReachedMax = collect($lettersResult)->contains('reached_max', true);

        $unlocked = app(AlphabetAchievementService::class)->checkAfterGroup(
            $user,
            $data['category'],
            $lettersResult,
            [
                'percent' => $percent,
                'passed' => $percent >= 50,
            ],
        );

        return response()->json([
            'data' => [
                'passed' => $percent >= 50,
                'percent' => $percent,
                'blueberries_earned' => $actualBlueberries,
                'total_blueberries' => $user->blueberry,
                'exp_earned' => $expEarned,
                'total_exp' => $user->exp,
                'letters' => $lettersResult,
                'any_reached_max' => $anyReachedMax,
                'unlocked_achievements' => $unlocked,
                'streak' => $streak,
            ],
        ]);
    }
}