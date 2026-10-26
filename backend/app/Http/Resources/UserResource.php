<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $expToday = (int) ($this->exp_today ?? 0);
        $dailyGoal = (int) ($this->daily_exp_goal ?? 150);

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
            'timezone' => $this->timezone,
            'daily_exp_goal' => $dailyGoal,
            'exp_today' => $expToday,
            'exp_today_date' => $this->exp_today_date?->toDateString(),
            'goal_reached' => $dailyGoal > 0 && $expToday >= $dailyGoal,
            'streak_current' => $this->streak_current,
            'streak_best' => $this->streak_best,
            'streak_last_date' => $this->streak_last_date?->toIso8601String(),
            'streak_freezes' => $this->streak_freezes,
            'strawberry' => $this->strawberry,
            'blueberry' => $this->blueberry,
            'exp' => $this->exp,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}