<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PhraseResource;
use App\Models\Phrase;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PhrasesController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $userId = $request->user()->id;

        $query = Phrase::query()
            ->with(['level', 'topics', 'tokens', 'grammarRules'])
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

        if ($levelId = $request->input('level_id')) {
            $query->where('level_id', $levelId);
        }

        $tab = $request->input('tab', 'all');

        if ($tab === 'progress') {
            $query->whereHas('progress', function ($q) use ($userId) {
                $q->where('user_id', $userId)
                    ->where('interval_days', '<', 30);
            });
        } elseif ($tab === 'learned') {
            $query->whereHas('progress', function ($q) use ($userId) {
                $q->where('user_id', $userId)
                    ->where('interval_days', '>=', 30);
            });
        } elseif ($tab === 'review') {
            $query->whereHas('progress', function ($q) use ($userId) {
                $q->where('user_id', $userId)
                    ->where('next_review_at', '<=', now());
            });
        }

        $perPage = min(100, max(1, (int) $request->input('per_page', 30)));
        $phrases = $query->orderBy('hangul')->paginate($perPage);

        return PhraseResource::collection($phrases);
    }
}