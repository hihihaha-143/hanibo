<?php

namespace App\Http\Controllers\Api\MiniGame;

use App\Http\Controllers\Controller;
use App\Models\Word;
use Illuminate\Http\JsonResponse;

class TextInputController extends Controller
{
    public function show(): JsonResponse
    {
        $total = Word::query()->count();

        if ($total < 1) {
            return response()->json(['message' => 'No words'], 404);
        }

        $word = Word::query()->inRandomOrder()->first(['id', 'hangul', 'translation']);

        return response()->json([
            'word_id' => $word->id,
            'translation' => $word->translation,
            'hangul' => $word->hangul,
        ]);
    }
}