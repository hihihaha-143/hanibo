<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PhraseTokenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'order' => $this->order,
            'text' => $this->text,
            'space_after' => $this->space_after,
            'word' => $this->whenLoaded('word', function () {
                return $this->word ? [
                    'id' => $this->word->id,
                    'hangul' => $this->word->hangul,
                    'translation' => $this->word->translation,
                ] : null;
            }),
            'grammar_rule' => $this->whenLoaded('grammarRule', function () {
                return $this->grammarRule ? [
                    'id' => $this->grammarRule->id,
                    'title' => $this->grammarRule->title,
                    'construction' => $this->grammarRule->construction,
                ] : null;
            }),
        ];
    }
}