<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserGrammarRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'grammar_rule_id',
        'status',
        'interval_days',
        'next_review_at',
        'correct_streak',
        'mistakes_count',
        'started_at',
    ];

    protected $casts = [
        'next_review_at' => 'datetime',
        'started_at' => 'datetime',
        'interval_days' => 'integer',
        'correct_streak' => 'integer',
        'mistakes_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function grammarRule(): BelongsTo
    {
        return $this->belongsTo(GrammarRule::class);
    }
}