<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $timezone = $this->timezone ?: 'UTC';
        $today = now($timezone)->toDateString();

        $streakExtendedToday = $this->streak_last_date
            && $this->streak_last_date->toDateString() === $today;

        $streakFrozenToday = $this->streak_frozen_date
            && $this->streak_frozen_date->toDateString() === $today;

        $goalReached = ($this->exp_today ?? 0) >= ($this->daily_exp_goal ?? 0);

        return [
            'id' => $this->id,
            'nickname' => $this->nickname,
            'email' => $this->email,
            'role' => $this->role,
            'language_level' => $this->language_level,
            'avatar' => $this->avatar,
            'selected_title' => $this->selected_title_id
                ? [
                    'id' => $this->selectedTitle?->id,
                    'code' => $this->selectedTitle?->code,
                    'title' => $this->selectedTitle?->title,
                ]
                : null,
            'timezone' => $timezone,
            'daily_exp_goal' => $this->daily_exp_goal,
            'exp_today' => $this->exp_today,
            'exp_today_date' => $this->exp_today_date?->toDateString(),
            'goal_reached' => $goalReached,
            'streak_current' => $this->streak_current,
            'streak_best' => $this->streak_best,
            'streak_last_date' => $this->streak_last_date?->toIso8601String(),
            'streak_extended_today' => $streakExtendedToday,
            'streak_frozen_today' => $streakFrozenToday,
            'streak_freezes' => $this->streak_freezes,
            'strawberry' => $this->strawberry,
            'blueberry' => $this->blueberry,
            'exp' => $this->exp,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}