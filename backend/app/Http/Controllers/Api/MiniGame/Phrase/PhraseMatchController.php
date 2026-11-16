<?php

namespace App\Http\Controllers\Api\MiniGame\Phrase;

use App\Http\Controllers\Controller;
use App\Models\Phrase;
use Illuminate\Http\JsonResponse;

class PhraseMatchController extends Controller
{
    private const MIN_PAIRS = 2;
    private const MAX_PAIRS = 6;

    public function show(): JsonResponse
    {
        $total = Phrase::query()->count();

        if ($total < self::MIN_PAIRS) {
            return response()->json(['message' => 'Not enough phrases'], 404);
        }

        $count = min(self::MAX_PAIRS, $total);

        $phrases = Phrase::query()
            ->inRandomOrder()
            ->limit($count)
            ->get(['id', 'hangul', 'translation']);

        return response()->json([
            'pairs' => $phrases->map(fn (Phrase $p) => [
                'id' => $p->id,
                'hangul' => $p->hangul,
                'translation' => $p->translation,
            ])->values(),
        ]);
    }
}