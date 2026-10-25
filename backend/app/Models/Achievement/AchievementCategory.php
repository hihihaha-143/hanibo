<?php

namespace App\Models\Achievement;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AchievementCategory extends Model
{
    protected $fillable = [
        'code',
        'title',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(Achievement::class, 'category_id');
    }
}