<?php

namespace App\Models;

use App\Models\Achievement\Achievement;
use App\Models\Achievement\Title;
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
            'daily_exp_goal' => 'integer',
            'exp_today' => 'integer',
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
}