<?php

namespace App\Http\Controllers;

use App\Models\AlphabetLetter;
use App\Models\AlphabetProgress;
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

        // --- Суммарный процент по всему тесту группы ---
        $totalQuestions = 0;
        $totalCorrect = 0;
        foreach ($data['letters'] as $item) {
            $totalQuestions += $item['total'];
            $totalCorrect += min($item['correct'], $item['total']);
        }

        $percent = $totalQuestions > 0
            ? (int) round(($totalCorrect / $totalQuestions) * 100)
            : 0;

        // --- EXP за группу (один раз) ---
        $expEarned = 0;
        if ($percent === 100) {
            $expEarned = 50;
        } elseif ($percent > 50) {
            $expEarned = 20;
        }

        // --- Черника за группу (один раз, 0–3) ---
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
            $expEarned,
            $blueberriesEarned,
            &$actualBlueberries,
            &$lettersResult
        ) {
            // --- Начисление EXP (один раз за тест) ---
            if ($expEarned > 0) {
                $user->increment('exp', $expEarned);
            }

            // --- Начисление черники (один раз за тест) ---
            if ($blueberriesEarned > 0) {
                $actualBlueberries = $blueberriesEarned;
                $user->increment('blueberry', $actualBlueberries);
            }

            // --- Прогресс по каждой букве ---
            foreach ($data['letters'] as $item) {
                $letter = AlphabetLetter::find($item['letter_id']);
                if (!$letter) {
                    continue;
                }

                $correct = min($item['correct'], $item['total']);
                $total = $item['total'];

                // +1 если 1 правильный; +2 если 2–3 вопроса и все правильные; иначе +1
                if ($total === 1) {
                    $scoreAdded = $correct === 1 ? 1 : 0;
                } else {
                    // total = 2 или 3
                    $scoreAdded = $correct === $total ? 2 : ($correct > 0 ? 1 : 0);
                }

                $progress = AlphabetProgress::firstOrNew([
                    'user_id' => $user->id,
                    'letter_id' => $letter->id,
                ]);

                $progress->attempts = ($progress->attempts ?? 0) + 1;
                $progress->score = min(
                    self::MAX_SCORE,
                    ($progress->score ?? 0) + $scoreAdded,
                );
                $progress->save();

                $lettersResult[] = [
                    'letter_id' => $letter->id,
                    'score_added' => $scoreAdded,
                    'score' => $progress->score,
                    'attempts' => $progress->attempts,
                    'max_score' => self::MAX_SCORE,
                ];
            }
        });

        $user->refresh();

        return response()->json([
            'data' => [
                'passed' => $percent >= 50,
                'percent' => $percent,
                'blueberries_earned' => $actualBlueberries,
                'total_blueberries' => $user->blueberry,
                'exp_earned' => $expEarned,
                'total_exp' => $user->exp,
                'letters' => $lettersResult,
            ],
        ]);
    }
}