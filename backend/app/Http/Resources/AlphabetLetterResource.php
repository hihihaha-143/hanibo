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
            'examples' => AlphabetExampleResource::collection($this->whenLoaded('examples')),
        ];
    }
}