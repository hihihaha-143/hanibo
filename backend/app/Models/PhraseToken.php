<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PhraseToken extends Model
{
    protected $fillable = [
        'phrase_id',
        'order',
        'text',
        'space_after',
        'word_id',
        'grammar_rule_id',
    ];

    protected $casts = [
        'order' => 'integer',
        'space_after' => 'boolean',
    ];

    public function phrase(): BelongsTo
    {
        return $this->belongsTo(Phrase::class);
    }

    public function word(): BelongsTo
    {
        return $this->belongsTo(Word::class);
    }

    public function grammarRule(): BelongsTo
    {
        return $this->belongsTo(GrammarRule::class);
    }
}