<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlphabetProgress extends Model
{
    protected $table = 'alphabet_progress';

    protected $fillable = [
        'user_id',
        'letter_id',
        'score',
        'attempts',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'attempts' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function letter(): BelongsTo
    {
        return $this->belongsTo(AlphabetLetter::class, 'letter_id');
    }
}