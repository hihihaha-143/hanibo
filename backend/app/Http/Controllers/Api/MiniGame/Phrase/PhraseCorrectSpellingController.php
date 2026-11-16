<?php

namespace App\Http\Controllers\Api\MiniGame\Phrase;

use App\Http\Controllers\Controller;
use App\Models\Phrase;
use App\Models\Word;
use Illuminate\Http\JsonResponse;

class PhraseCorrectSpellingController extends Controller
{
    public function show(): JsonResponse
    {
        $phrase = Phrase::query()
            ->whereHas(
                'tokens',
                fn ($q) => $q->whereNotNull('word_id'),
                '>=',
                2
            )
            ->with([
                'tokens' => fn ($q) => $q->orderBy('order'),
            ])
            ->inRandomOrder()
            ->first();

        if (!$phrase) {
            return response()->json(['message' => 'Not enough phrases'], 404);
        }

        $tokens = $phrase->tokens->values();
        $correct = $this->buildText($tokens);

        $wordTokenIndexes = [];
        foreach ($tokens as $i => $t) {
            if ($t->word_id !== null) {
                $wordTokenIndexes[] = $i;
            }
        }

        if (count($wordTokenIndexes) < 2) {
            return response()->json(['message' => 'Not enough phrases'], 404);
        }

        $used = [$correct => true];
        $distractors = [];

        $attempts = 0;
        $maxAttempts = 200;

        while (count($distractors) < 3 && $attempts < $maxAttempts) {
            $attempts++;

            $replaceIndex = $wordTokenIndexes[random_int(0, count($wordTokenIndexes) - 1)];
            $originalWordId = $tokens[$replaceIndex]->word_id;

            $replacement = Word::query()
                ->where('id', '!=', $originalWordId)
                ->inRandomOrder()
                ->first(['id', 'hangul']);

            if (!$replacement) {
                continue;
            }

            $copy = $tokens->all();
            $copy[$replaceIndex] = clone $tokens[$replaceIndex];
            $copy[$replaceIndex]->text = $replacement->hangul;

            $candidate = $this->buildText(collect($copy));

            if (isset($used[$candidate])) {
                continue;
            }
            $used[$candidate] = true;
            $distractors[] = $candidate;
        }

        if (count($distractors) < 3) {
            return response()->json(['message' => 'Not enough phrases'], 404);
        }

        $variants = array_merge([$correct], $distractors);
        shuffle($variants);
        $correctIndex = array_search($correct, $variants, true);

        return response()->json([
            'phrase_id' => $phrase->id,
            'translation' => $phrase->translation,
            'hangul' => $phrase->hangul,
            'variants' => $variants,
            'correct_index' => $correctIndex,
        ]);
    }

    private function buildText($tokens): string
    {
        $out = '';
        foreach ($tokens as $token) {
            $out .= $token->text;
            if ($token->space_after) {
                $out .= ' ';
            }
        }
        return rtrim($out);
    }
}