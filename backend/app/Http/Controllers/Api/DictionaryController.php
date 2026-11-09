<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WordResource;
use App\Models\Word;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DictionaryController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $userId = $request->user()->id;

        $query = Word::query()
            ->with(['partOfSpeech', 'level', 'topics', 'phrases'])
            ->with([
                'progress' => fn ($q) => $q->where('user_id', $userId),
            ]);

        if ($search = trim((string) $request->input('search'))) {
            $query->where(function ($q) use ($search) {
                $q->where('hangul', 'like', "%{$search}%")
                    ->orWhere('translation', 'like', "%{$search}%");
            });
        }

        if ($topicId = $request->input('topic_id')) {
            $query->whereHas('topics', fn ($q) => $q->where('topics.id', $topicId));
        }

        $tab = $request->input('tab', 'all');

        if ($tab === 'progress') {
            $query->whereHas('progress', function ($q) use ($userId) {
                $q->where('user_id', $userId)
                    ->where('interval_days', 0);
            });
        } elseif ($tab === 'learned') {
            $query->whereHas('progress', function ($q) use ($userId) {
                $q->where('user_id', $userId)
                    ->where('interval_days', '>', 0);
            });
        } elseif ($tab === 'review') {
            $query->whereHas('progress', function ($q) use ($userId) {
                $q->where('user_id', $userId)
                    ->where('next_review_at', '<=', now());
            });
        }

        $words = $query->orderBy('hangul')->paginate(30);

        return WordResource::collection($words);
    }
}