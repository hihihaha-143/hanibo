<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'hangul' => $this->hangul,
            'translation' => $this->translation,
            'part_of_speech' => new PartOfSpeechResource($this->whenLoaded('partOfSpeech')),
            'level' => new LevelResource($this->whenLoaded('level')),
            'topics' => TopicResource::collection($this->whenLoaded('topics')),
            'phrases' => PhraseResource::collection($this->whenLoaded('phrases')),
        ];
    }
}