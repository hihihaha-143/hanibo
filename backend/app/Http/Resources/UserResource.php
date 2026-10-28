<?php

namespace App\Http\Resources;

use App\Models\Shop\ShopItem;
use App\Http\Resources\Shop\ShopItemResource;
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

        $selectedIconIds = array_values(array_map('intval', (array) ($this->selected_icon_ids ?? [])));

        $selectedIcons = $selectedIconIds
            ? ShopItem::query()
                ->whereIn('id', $selectedIconIds)
                ->get()
                ->sortBy(fn ($i) => array_search($i->id, $selectedIconIds, true))
                ->values()
            : collect();

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
            'selected_status' => $this->selected_status_id
                ? (new ShopItemResource($this->selectedStatus))->resolve()
                : null,
            'selected_avatar' => $this->selected_avatar_id
                ? (new ShopItemResource($this->selectedAvatar))->resolve()
                : null,
            'selected_frame' => $this->selected_frame_id
                ? (new ShopItemResource($this->selectedFrame))->resolve()
                : null,
            'selected_banner' => $this->selected_banner_id
                ? (new ShopItemResource($this->selectedBanner))->resolve()
                : null,
            'selected_nickname_color' => $this->selected_nickname_color_id
                ? (new ShopItemResource($this->selectedNicknameColor))->resolve()
                : null,
            'selected_medal' => $this->selected_medal_id
                ? (new ShopItemResource($this->selectedMedal))->resolve()
                : null,
            'selected_icons' => ShopItemResource::collection($selectedIcons)->resolve(),
            'exp_boost_until' => $this->exp_boost_until?->toIso8601String(),
            'has_exp_boost' => $this->exp_boost_until !== null && $this->exp_boost_until->isFuture(),
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