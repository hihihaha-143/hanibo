<?php

namespace App\Http\Controllers\Api\MiniGame;

use App\Http\Controllers\Controller;
use App\Models\Word;
use Illuminate\Http\JsonResponse;

class AudioChooseController extends Controller
{
    public function show(): JsonResponse
    {
        $total = Word::query()->count();

        if ($total < 4) {
            return response()->json(['message' => 'Not enough words'], 404);
        }

        $target = Word::query()->inRandomOrder()->first();

        $distractors = Word::query()
            ->where('id', '!=', $target->id)
            ->inRandomOrder()
            ->limit(3)
            ->get();

        return response()->json([
            'target' => [
                'id' => $target->id,
                'hangul' => $target->hangul,
                'translation' => $target->translation,
            ],
            'distractors' => $distractors->map(fn (Word $w) => [
                'id' => $w->id,
                'hangul' => $w->hangul,
                'translation' => $w->translation,
            ])->values(),
        ]);
    }
}