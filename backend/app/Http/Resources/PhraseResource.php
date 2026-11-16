<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PhraseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'hangul' => $this->hangul,
            'translation' => $this->translation,
            'level' => new LevelResource($this->whenLoaded('level')),
            'topics' => TopicResource::collection($this->whenLoaded('topics')),
            'tokens' => PhraseTokenResource::collection($this->whenLoaded('tokens')),
            'grammar_rules' => GrammarRuleResource::collection($this->whenLoaded('grammarRules')),
            'progress' => $this->whenLoaded('progress', function () {
                $progress = $this->progress->first();

                if (!$progress) {
                    return null;
                }

                return [
                    'interval_days' => $progress->interval_days,
                    'next_review_at' => $progress->next_review_at?->toIso8601String(),
                    'is_learned' => $progress->interval_days > 0,
                ];
            }),
        ];
    }
}