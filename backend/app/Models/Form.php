<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Form extends Model
{
    protected $fillable = [
        'title',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function grammarRules(): HasMany
    {
        return $this->hasMany(GrammarRule::class);
    }
}