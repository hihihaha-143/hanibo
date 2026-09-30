<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Level extends Model
{
    protected $fillable = [
        'title',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function words(): HasMany
    {
        return $this->hasMany(Word::class);
    }

    public function phrases(): HasMany
    {
        return $this->hasMany(Phrase::class);
    }
}