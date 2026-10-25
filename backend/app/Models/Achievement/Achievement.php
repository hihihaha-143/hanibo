<?php

namespace App\Models\Achievement;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Achievement extends Model
{
    protected $fillable = [
        'code',
        'title',
        'description',
        'icon',
        'image',
        'category_id',
        'is_hidden',
        'blueberry_reward',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_hidden' => 'boolean',
            'blueberry_reward' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(AchievementCategory::class, 'category_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_achievements')
            ->withPivot('unlocked_at')
            ->withTimestamps();
    }
}