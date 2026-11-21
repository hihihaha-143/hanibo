<?php

namespace App\Models;

use App\Models\Achievement\Achievement;
use App\Models\Achievement\Title;
use App\Models\Shop\ShopItem;
use App\Models\Shop\UserItem;
use App\Services\Streak\StreakService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nickname',
        'email',
        'password',
        'role',
        'language_level',
        'avatar',
        'selected_title_id',
        'selected_status_id',
        'selected_avatar_id',
        'selected_frame_id',
        'selected_banner_id',
        'selected_nickname_color_id',
        'selected_medal_id',
        'selected_icon_ids',
        'exp_boost_until',
        'timezone',
        'daily_exp_goal',
        'exp_today',
        'exp_today_date',
        'strawberry',
        'blueberry',
        'exp',
        'streak_current',
        'streak_best',
        'streak_last_date',
        'streak_frozen_date',
        'streak_freezes',
        'streak_rewards_claimed',
        'streak_milestone_claimed',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'streak_last_date' => 'date',
            'streak_frozen_date' => 'date',
            'exp_today_date' => 'date',
            'strawberry' => 'integer',
            'blueberry' => 'integer',
            'exp' => 'integer',
            'streak_current' => 'integer',
            'streak_best' => 'integer',
            'streak_freezes' => 'integer',
            'streak_rewards_claimed' => 'integer',
            'streak_milestone_claimed' => 'integer',
            'daily_exp_goal' => 'integer',
            'exp_today' => 'integer',
            'selected_icon_ids' => 'array',
            'exp_boost_until' => 'datetime',
        ];
    }

    public function alphabetProgress(): HasMany
    {
        return $this->hasMany(AlphabetProgress::class);
    }

    public function achievements(): BelongsToMany
    {
        return $this->belongsToMany(
            Achievement::class,
            'user_achievements',
        )
            ->withPivot('unlocked_at')
            ->withTimestamps();
    }

    public function titles(): BelongsToMany
    {
        return $this->belongsToMany(
            Title::class,
            'user_titles',
        )
            ->withPivot('unlocked_at')
            ->withTimestamps();
    }

    public function selectedTitle(): BelongsTo
    {
        return $this->belongsTo(Title::class, 'selected_title_id');
    }

    public function userItems(): HasMany
    {
        return $this->hasMany(UserItem::class);
    }

    public function selectedStatus(): BelongsTo
    {
        return $this->belongsTo(ShopItem::class, 'selected_status_id');
    }

    public function selectedAvatar(): BelongsTo
    {
        return $this->belongsTo(ShopItem::class, 'selected_avatar_id');
    }

    public function selectedFrame(): BelongsTo
    {
        return $this->belongsTo(ShopItem::class, 'selected_frame_id');
    }

    public function selectedBanner(): BelongsTo
    {
        return $this->belongsTo(ShopItem::class, 'selected_banner_id');
    }

    public function selectedNicknameColor(): BelongsTo
    {
        return $this->belongsTo(ShopItem::class, 'selected_nickname_color_id');
    }

    public function selectedMedal(): BelongsTo
    {
        return $this->belongsTo(ShopItem::class, 'selected_medal_id');
    }

    public function selectedIcons(): HasMany
    {
        return $this->hasMany(ShopItem::class, 'id', 'selected_icon_ids');
    }

    public function hasActiveExpBoost(): bool
    {
        return $this->exp_boost_until !== null && $this->exp_boost_until->isFuture();
    }

    public function ownsShopItem(int $shopItemId): bool
    {
        return $this->userItems()->where('shop_item_id', $shopItemId)->exists();
    }

    public function refreshDailyExp(): array
    {
        $tz = $this->timezone ?: 'UTC';
        $today = Carbon::now($tz)->toDateString();

        $changed = false;

        if ($this->exp_today_date === null || $this->exp_today_date->toDateString() !== $today) {
            $this->exp_today = 0;
            $this->exp_today_date = $today;
            $changed = true;
        }

        if ($changed) {
            $this->save();
        }

        return app(StreakService::class)->refreshStreak($this);
    }


    public function grammarRules(): HasMany
{
    return $this->hasMany(UserGrammarRule::class);
}
}