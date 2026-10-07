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
            'tokens' => PhraseTokenResource::collection($this->whenLoaded('tokens')),
            'grammar_rules' => GrammarRuleResource::collection($this->whenLoaded('grammarRules')),
        ];
    }
}