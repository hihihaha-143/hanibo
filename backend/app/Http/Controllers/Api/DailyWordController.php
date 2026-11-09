<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WordResource;
use App\Models\Word;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DailyWordController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $timezone = $user->timezone ?: 'UTC';

        $today = now($timezone)->startOfDay();
        $dayIndex = (int) $today->diffInDays(now('UTC')->startOfDay(), false);

        // Детерминированный выбор: одинаковый весь день, меняется в 00:00 по TZ.
        $total = Word::query()->count();

        if ($total === 0) {
            return response()->json(['message' => 'No words yet'], 404);
        }

        $seed = abs($dayIndex) * 13 + 7;
        $offset = $seed % $total;

        $word = Word::query()
            ->with(['partOfSpeech', 'level', 'topics', 'phrases'])
            ->with([
                'progress' => fn ($q) => $q->where('user_id', $user->id),
            ])
            ->orderBy('id')
            ->skip($offset)
            ->first();

        return response()->json([
            'date' => $today->toDateString(),
            'word' => (new WordResource($word))->resolve(),
        ]);
    }
}