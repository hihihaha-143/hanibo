<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Phrase;
use Illuminate\Http\JsonResponse;

class DailyPhraseQuizController extends Controller
{
    public function show(): JsonResponse
    {
        $total = Phrase::query()->count();

        if ($total < 4) {
            return response()->json(['message' => 'Not enough phrases'], 404);
        }

        $target = Phrase::query()->inRandomOrder()->first();

        $distractors = Phrase::query()
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
            'distractors' => $distractors->map(fn (Phrase $p) => [
                'id' => $p->id,
                'hangul' => $p->hangul,
                'translation' => $p->translation,
            ])->values(),
        ]);
    }
}