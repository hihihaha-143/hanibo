<?php

namespace App\Http\Controllers\Api\MiniGame;

use App\Http\Controllers\Controller;
use App\Models\Word;
use Illuminate\Http\JsonResponse;

class SyllableOrderController extends Controller
{
    public function show(): JsonResponse
    {
        $words = Word::query()
            ->whereRaw('CHAR_LENGTH(hangul) >= 2')
            ->inRandomOrder()
            ->limit(50)
            ->get(['id', 'hangul', 'translation']);

        if ($words->isEmpty()) {
            return response()->json(['message' => 'Not enough words'], 404);
        }

        $word = $words->first();
        $syllables = preg_split('//u', $word->hangul, -1, PREG_SPLIT_NO_EMPTY);

        if (count($syllables) < 2) {
            return response()->json(['message' => 'Not enough words'], 404);
        }

        // Перемешиваем, гарантируя что порядок отличается от исходного
        $shuffled = $syllables;
        $attempts = 0;
        while ($shuffled === $syllables && $attempts < 20) {
            shuffle($shuffled);
            $attempts++;
        }

        // Если все слоги одинаковые — перемешать не получится
        if ($shuffled === $syllables && count(array_unique($syllables)) > 1) {
            $shuffled = array_reverse($syllables);
        }

        return response()->json([
            'word_id' => $word->id,
            'hangul' => $word->hangul,
            'translation' => $word->translation,
            'syllables' => array_values($shuffled),
        ]);
    }
}