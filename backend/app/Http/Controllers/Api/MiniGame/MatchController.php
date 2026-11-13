<?php

namespace App\Http\Controllers\Api\MiniGame;

use App\Http\Controllers\Controller;
use App\Models\Word;
use Illuminate\Http\JsonResponse;

class MatchController extends Controller
{
    private const MIN_PAIRS = 2;
    private const MAX_PAIRS = 6;

    public function show(): JsonResponse
    {
        $total = Word::query()->count();

        if ($total < self::MIN_PAIRS) {
            return response()->json(['message' => 'Not enough words'], 404);
        }

        $count = min(self::MAX_PAIRS, $total);

        $words = Word::query()
            ->inRandomOrder()
            ->limit($count)
            ->get(['id', 'hangul', 'translation']);

        return response()->json([
            'pairs' => $words->map(fn (Word $w) => [
                'id' => $w->id,
                'hangul' => $w->hangul,
                'translation' => $w->translation,
            ])->values(),
        ]);
    }
}