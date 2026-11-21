<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GrammarRuleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'construction' => $this->construction,
            'form' => $this->whenLoaded('form', fn () => $this->form ? [
                'id' => $this->form->id,
                'title' => $this->form->title,
            ] : null),
            'level' => $this->whenLoaded('level', fn () => $this->level ? [
                'id' => $this->level->id,
                'title' => $this->level->title,
            ] : null),
            'phrases' => PhraseResource::collection($this->whenLoaded('phrases')),
            'status' => $this->user_status,
            'interval_days' => $this->user_interval_days,
            'next_review_at' => $this->user_next_review_at,
            'correct_streak' => $this->user_correct_streak,
            'mistakes_count' => $this->user_mistakes_count,
        ];
    }
}