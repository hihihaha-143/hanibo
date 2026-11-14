<?php

namespace App\Http\Controllers\Api\MiniGame;

use App\Http\Controllers\Controller;
use App\Models\Word;
use Illuminate\Http\JsonResponse;

class CorrectSpellingController extends Controller
{
    private const HANGUL_START = 0xAC00;
    private const HANGUL_END = 0xD7A3;

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

        $correct = $word->hangul;
        $used = [$correct => true];
        $distractors = [];

        $attempts = 0;
        $maxAttempts = 200;

        while (count($distractors) < 3 && $attempts < $maxAttempts) {
            $attempts++;

            // Меняем один случайный слог на другой случайный хангыль-слог
            $copy = $syllables;
            $i = random_int(0, count($copy) - 1);

            $code = random_int(self::HANGUL_START, self::HANGUL_END);
            $newSyl = mb_chr($code, 'UTF-8');

            if ($copy[$i] === $newSyl) continue;
            $copy[$i] = $newSyl;
            $candidate = implode('', $copy);

            if (isset($used[$candidate])) continue;
            $used[$candidate] = true;
            $distractors[] = $candidate;
        }

        if (count($distractors) < 3) {
            return response()->json(['message' => 'Not enough words'], 404);
        }

        $variants = array_merge([$correct], $distractors);
        shuffle($variants);
        $correctIndex = array_search($correct, $variants, true);

        return response()->json([
            'word_id' => $word->id,
            'translation' => $word->translation,
            'hangul' => $word->hangul,
            'variants' => $variants,
            'correct_index' => $correctIndex,
        ]);
    }
}