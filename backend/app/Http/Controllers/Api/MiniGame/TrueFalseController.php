<?php

namespace App\Http\Controllers\Api\MiniGame;

use App\Http\Controllers\Controller;
use App\Models\Word;
use Illuminate\Http\JsonResponse;

class TrueFalseController extends Controller
{
    public function show(): JsonResponse
    {
        $total = Word::query()->count();

        if ($total < 2) {
            return response()->json(['message' => 'Not enough words'], 404);
        }

        $target = Word::query()->inRandomOrder()->first();

        $showCorrect = random_int(0, 1) === 1;

        if ($showCorrect) {
            $shownTranslation = $target->translation;
            $isCorrect = true;
        } else {
            $other = Word::query()
                ->where('id', '!=', $target->id)
                ->inRandomOrder()
                ->first();

            $shownTranslation = $other->translation;
            $isCorrect = false;
        }

        return response()->json([
            'word_id' => $target->id,
            'hangul' => $target->hangul,
            'translation' => $shownTranslation,
            'is_correct' => $isCorrect,
        ]);
    }
}