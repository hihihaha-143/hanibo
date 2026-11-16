<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PhraseResource;
use App\Models\Phrase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DailyPhraseController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $timezone = $user->timezone ?: 'UTC';

        $today = now($timezone)->startOfDay();
        $epoch = now($timezone)->setDate(1970, 1, 1)->startOfDay();
        $dayIndex = (int) $epoch->diffInDays($today);

        $total = Phrase::query()->count();

        if ($total === 0) {
            return response()->json(['message' => 'No phrases yet'], 404);
        }

        $seed = $dayIndex * 13 + 7;
        $offset = $seed % $total;

        $phrase = Phrase::query()
            ->with(['level', 'topics', 'tokens', 'grammarRules'])
            ->with([
                'progress' => fn ($q) => $q->where('user_id', $user->id),
            ])
            ->orderBy('id')
            ->skip($offset)
            ->first();

        return response()->json([
            'date' => $today->toDateString(),
            'phrase' => (new PhraseResource($phrase))->resolve(),
        ]);
    }
}