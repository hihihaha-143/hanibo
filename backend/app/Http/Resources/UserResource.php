<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nickname' => $this->nickname,
            'email' => $this->email,
            'role' => $this->role,
            'language_level' => $this->language_level,
            'avatar' => $this->avatar,
            'strawberry' => $this->strawberry,
            'blueberry' => $this->blueberry,
            'exp' => $this->exp,
            'streak_current' => $this->streak_current,
            'streak_best' => $this->streak_best,
            'streak_last_date' => $this->streak_last_date?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}