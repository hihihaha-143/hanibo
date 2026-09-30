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
            'form' => new FormResource($this->whenLoaded('form')),
            'level' => new LevelResource($this->whenLoaded('level')),
            'phrases' => PhraseResource::collection($this->whenLoaded('phrases')),
        ];
    }
}