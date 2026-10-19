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

        $user = $request->user();

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

        return response()->json([
            'data' => [
                'passed' => $passed,
                'percent' => $percent,
                'score_added' => $scoreAdded,
                'score' => $progress->score,
                'attempts' => $progress->attempts,
                'max_score' => self::MAX_SCORE,
            ],
        ]);
    }
}