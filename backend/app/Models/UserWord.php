<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserWord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'word_id',
        'mistakes_count',
        'correct_streak',
        'interval_days',
        'next_review_at',
    ];

    protected $casts = [
        'mistakes_count' => 'integer',
        'correct_streak' => 'integer',
        'interval_days'   => 'integer',
        'next_review_at'  => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function word(): BelongsTo
    {
        return $this->belongsTo(Word::class);
    }
}