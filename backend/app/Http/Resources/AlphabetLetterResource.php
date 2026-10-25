<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlphabetLetterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'symbol' => $this->symbol,
            'romanization' => $this->romanization,
            'category' => $this->category,
            'description' => $this->description,
            'sound_ipa' => $this->sound_ipa,
            'sound_note' => $this->sound_note,
            'sample_syllable' => $this->sample_syllable,
            'sample_romanization' => $this->sample_romanization,
            'family_symbols' => $this->family_symbols ?? [],
            'family_note' => $this->family_note,
            'confusion' => $this->confusion ?? [],
            'examples' => AlphabetExampleResource::collection($this->whenLoaded('examples')),
            'progress' => $this->whenLoaded('progress', function () {
                $p = $this->progress->first();

                return [
                    'score' => $p?->score ?? 0,
                    'attempts' => $p?->attempts ?? 0,
                    'mistakes' => $p?->mistakes ?? 0,
                    'max_score' => 10,
                ];
            }),
        ];
    }
}