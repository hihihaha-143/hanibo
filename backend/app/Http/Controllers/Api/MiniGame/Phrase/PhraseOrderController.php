<?php

namespace App\Http\Controllers\Api\MiniGame\Phrase;

use App\Http\Controllers\Controller;
use App\Models\Phrase;
use Illuminate\Http\JsonResponse;

class PhraseOrderController extends Controller
{
    public function show(): JsonResponse
    {
        $phrase = Phrase::query()
            ->whereHas('tokens')
            ->with(['tokens' => fn ($q) => $q->orderBy('order')])
            ->inRandomOrder()
            ->first();

        if (!$phrase || $phrase->tokens->count() < 2) {
            return response()->json(['message' => 'Not enough phrases'], 404);
        }

        $tokens = $phrase->tokens->map(fn ($t) => [
            'order' => $t->order,
            'text' => $t->text,
            'space_after' => (bool) $t->space_after,
        ])->values()->all();

        $shuffled = $tokens;
        $attempts = 0;
        while ($this->sameOrder($shuffled, $tokens) && $attempts < 20) {
            shuffle($shuffled);
            $attempts++;
        }

        if ($this->sameOrder($shuffled, $tokens)) {
            $shuffled = array_reverse($tokens);
        }

        $correctText = $this->buildText($tokens);

        return response()->json([
            'phrase_id' => $phrase->id,
            'hangul' => $phrase->hangul,
            'translation' => $phrase->translation,
            'tokens' => array_values($shuffled),
            'correct_text' => $correctText,
        ]);
    }

    private function sameOrder(array $a, array $b): bool
    {
        if (count($a) !== count($b)) {
            return false;
        }
        foreach ($a as $i => $t) {
            if (($t['order'] ?? null) !== ($b[$i]['order'] ?? null)) {
                return false;
            }
        }
        return true;
    }

    private function buildText(array $tokens): string
    {
        $out = '';
        foreach ($tokens as $token) {
            $out .= $token['text'];
            if (!empty($token['space_after'])) {
                $out .= ' ';
            }
        }
        return rtrim($out);
    }
}