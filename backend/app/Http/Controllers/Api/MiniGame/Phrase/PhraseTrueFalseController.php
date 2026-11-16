<?php

namespace App\Http\Controllers\Api\MiniGame\Phrase;

use App\Http\Controllers\Controller;
use App\Models\Phrase;
use Illuminate\Http\JsonResponse;

class PhraseTrueFalseController extends Controller
{
    public function show(): JsonResponse
    {
        $total = Phrase::query()->count();

        if ($total < 2) {
            return response()->json(['message' => 'Not enough phrases'], 404);
        }

        $target = Phrase::query()->inRandomOrder()->first();

        $showCorrect = random_int(0, 1) === 1;

        if ($showCorrect) {
            $shownTranslation = $target->translation;
            $isCorrect = true;
        } else {
            $other = Phrase::query()
                ->where('id', '!=', $target->id)
                ->inRandomOrder()
                ->first();

            $shownTranslation = $other->translation;
            $isCorrect = false;
        }

        return response()->json([
            'phrase_id' => $target->id,
            'hangul' => $target->hangul,
            'translation' => $shownTranslation,
            'is_correct' => $isCorrect,
        ]);
    }
}