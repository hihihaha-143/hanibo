<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlphabetExample extends Model
{
    protected $fillable = [
        'letter_id',
        'word',
        'romanization',
        'meaning',
        'sort_order',
    ];

    public function letter(): BelongsTo
    {
        return $this->belongsTo(AlphabetLetter::class, 'letter_id');
    }
}