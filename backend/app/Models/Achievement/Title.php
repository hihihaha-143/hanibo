<?php

namespace App\Models\Achievement;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Title extends Model
{
    protected $fillable = [
        'code',
        'title',
        'description',
        'is_hidden',
        'is_purchasable',
        'price',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_hidden' => 'boolean',
            'is_purchasable' => 'boolean',
            'price' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_titles')
            ->withPivot('unlocked_at')
            ->withTimestamps();
    }
}