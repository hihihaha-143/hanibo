<?php

namespace App\Http\Controllers;

use App\Models\AlphabetLetter;
use App\Models\AlphabetProgress;
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

        // --- Логика начисления опыта (exp) ---
        $expEarned = 0;
        if ($percent === 100) {
            $expEarned = 20; // 100% тест буквы
        } elseif ($percent > 0) {
            $expEarned = 10; // просто прошел тест буквы (не 100%)
        }

        // --- Логика начисления черники ---
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

        // Начисляем награды
        $actualBlueberries = 0;
        if ($blueberriesEarned > 0 && (!$isMaxed || $isFirstTime)) {
            $actualBlueberries = $blueberriesEarned;
            $user->increment('blueberry', $actualBlueberries);
        }

        // Начисляем exp за прохождение (каждый раз)
        if ($expEarned > 0) {
            $user->increment('exp', $expEarned);
        }

        // Обновляем объект пользователя, чтобы отдать актуальные данные
        $user->refresh();

        $progress->attempts = ($progress->attempts ?? 0) + 1;
        $progress->score = min(
            self::MAX_SCORE,
            ($progress->score ?? 0) + $scoreAdded,
        );
        $progress->save();

        // достигли ли максимума впервые в этом запросе
        $reachedMax = $scoreBefore < self::MAX_SCORE
            && $progress->score >= self::MAX_SCORE;

        return response()->json([
            'data' => [
                'passed' => $passed,
                'percent' => $percent,
                'score_added' => $scoreAdded,
                'score' => $progress->score,
                'attempts' => $progress->attempts,
                'max_score' => self::MAX_SCORE,
                'blueberries_earned' => $actualBlueberries,
                'total_blueberries' => $user->blueberry,
                'exp_earned' => $expEarned,
                'total_exp' => $user->exp,
                'reached_max' => $reachedMax,
            ],
        ]);
    }
}