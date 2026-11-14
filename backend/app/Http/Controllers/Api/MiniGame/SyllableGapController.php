<?php

namespace App\Http\Controllers\Api\MiniGame;

use App\Http\Controllers\Controller;
use App\Models\Word;
use Illuminate\Http\JsonResponse;

class SyllableGapController extends Controller
{
    private const HANGUL_START = 0xAC00;
    private const HANGUL_END = 0xD7A3;

    public function show(): JsonResponse
    {
        // Берём случайное слово с длиной хангыля >= 2 слога
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

        // Не первый слог
        $gapIndex = random_int(1, count($syllables) - 1);
        $correct = $syllables[$gapIndex];

        $prompt = implode('', array_slice($syllables, 0, $gapIndex))
            . '_'
            . implode('', array_slice($syllables, $gapIndex + 1));

        // Дистракторы: сначала другие слоги этого же слова
        $used = [$correct => true];
        $distractors = [];

        foreach ($syllables as $i => $syl) {
            if ($i === $gapIndex) continue;
            if (isset($used[$syl])) continue;
            $used[$syl] = true;
            $distractors[] = $syl;
            if (count($distractors) >= 3) break;
        }

        // Добиваем случайными хангыль-слогами
        $safety = 0;
        while (count($distractors) < 3 && $safety < 100) {
            $safety++;
            $code = random_int(self::HANGUL_START, self::HANGUL_END);
            $syl = mb_chr($code, 'UTF-8');
            if (isset($used[$syl])) continue;
            $used[$syl] = true;
            $distractors[] = $syl;
        }

        $variants = array_merge([$correct], $distractors);
        shuffle($variants);
        $correctIndex = array_search($correct, $variants, true);

        return response()->json([
            'word_id' => $word->id,
            'hangul' => $word->hangul,
            'translation' => $word->translation,
            'prompt' => $prompt,
            'correct' => $correct,
            'variants' => $variants,
            'correct_index' => $correctIndex,
        ]);
    }
}