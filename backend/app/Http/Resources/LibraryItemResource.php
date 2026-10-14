<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LibraryItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'author'      => $this->author,
            'type'        => $this->type,
            'description' => $this->description,
            'cover_url'   => $this->cover_path ? asset($this->cover_path) : null,
            'file_url'    => $this->file_path  ? asset($this->file_path)  : null,
            'level'       => $this->level,
            'language'    => $this->language,
            'pages'       => $this->pages,
            'year'        => $this->year,
        ];
    }
}