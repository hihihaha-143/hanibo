<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPhrase extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phrase_id',
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

    public function phrase(): BelongsTo
    {
        return $this->belongsTo(Phrase::class);
    }
}