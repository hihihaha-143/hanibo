<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AlphabetLetter extends Model
{
    protected $fillable = [
        'symbol',
        'romanization',
        'category',
        'description',
        'sort_order',
    ];

    public function examples(): HasMany
    {
        return $this->hasMany(AlphabetExample::class, 'letter_id')
            ->orderBy('sort_order');
    }
}