<?php

namespace App\Http\Controllers;

use App\Models\AlphabetLetter;
use App\Models\AlphabetProgress;
use App\Services\Achievement\AlphabetAchievementService;
use App\Services\Streak\StreakService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AlphabetProgressController extends Controller
{
    private const MAX_SCORE = 10;

    public function store(Request $request, AlphabetLetter $letter): JsonResponse
    {
        $data = $request->validate([
            'correct' => ['required', 'integer', 'min:0'],
            'total' => ['required', 'integer', 'min:1'],
        ]);

        $correct = min($data['correct'], $data['total']);
        $percent = (int) round(($correct / $data['total']) * 100);

        $scoreAdded = 0;
        if ($percent >= 100) {
            $scoreAdded = 2;
        } elseif ($percent >= 70) {
            $scoreAdded = 1;
        }

        $passed = $scoreAdded > 0;

        $expEarned = 0;
        if ($percent === 100) {
            $expEarned = 20;
        } elseif ($percent > 0) {
            $expEarned = 10;
        }

        $blueberriesEarned = 0;
        if ($passed) {
            if ($percent >= 100) {
                $blueberriesEarned = 3;
            } elseif ($percent >= 80) {
                $blueberriesEarned = 2;
            } elseif ($percent >= 50) {
                $blueberriesEarned = 1;
            }
        }

        $user = $request->user();

        $progress = AlphabetProgress::firstOrNew([
            'user_id' => $user->id,
            'letter_id' => $letter->id,
        ]);

        $isFirstTime = !$progress->exists;
        $scoreBefore = $progress->score ?? 0;
        $isMaxed = $scoreBefore >= self::MAX_SCORE;

        $actualBlueberries = 0;
        if ($blueberriesEarned > 0 && (!$isMaxed || $isFirstTime)) {
            $actualBlueberries = $blueberriesEarned;
            $user->increment('blueberry', $actualBlueberries);
        }

        $streak = app(StreakService::class)->addExp($user, $expEarned);

        $progress->attempts = ($progress->attempts ?? 0) + 1;
        $progress->score = min(
            self::MAX_SCORE,
            ($progress->score ?? 0) + $scoreAdded,
        );

        $mistakesBefore = $progress->mistakes ?? 0;

        if ($correct === $data['total']) {
            $progress->mistakes = max(0, $mistakesBefore - 1);
        } else {
            $progress->mistakes = $mistakesBefore + ($data['total'] - $correct);
        }

        $progress->save();

        $reachedMax = $scoreBefore < self::MAX_SCORE
            && $progress->score >= self::MAX_SCORE;

        if ($reachedMax) {
            $progress->mistakes = 0;
            $progress->save();
        }

        $unlocked = app(AlphabetAchievementService::class)->checkAfterSingle(
            $user,
            $letter,
            [
                'correct' => $correct,
                'total' => $data['total'],
                'percent' => $percent,
                'score' => $progress->score,
                'attempts' => $progress->attempts,
                'mistakes' => $progress->mistakes,
                'reached_max' => $reachedMax,
            ],
        );

        return response()->json([
            'data' => [
                'passed' => $passed,
                'percent' => $percent,
                'score_added' => $scoreAdded,
                'score' => $progress->score,
                'attempts' => $progress->attempts,
                'mistakes' => $progress->mistakes,
                'max_score' => self::MAX_SCORE,
                'blueberries_earned' => $actualBlueberries,
                'total_blueberries' => $user->blueberry,
                'exp_earned' => $expEarned,
                'total_exp' => $user->exp,
                'reached_max' => $reachedMax,
                'unlocked_achievements' => $unlocked,
                'streak' => $streak,
            ],
        ]);
    }
}