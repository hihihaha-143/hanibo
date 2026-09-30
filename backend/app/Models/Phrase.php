<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Phrase extends Model
{
    protected $fillable = [
        'hangul',
        'translation',
        'level_id',
    ];

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function topics(): BelongsToMany
    {
        return $this->belongsToMany(Topic::class, 'phrase_topic');
    }

    public function words(): BelongsToMany
    {
        return $this->belongsToMany(Word::class, 'phrase_word');
    }

    public function grammarRules(): BelongsToMany
    {
        return $this->belongsToMany(GrammarRule::class, 'grammar_phrase');
    }

    public function courseItems(): BelongsToMany
    {
        return $this->belongsToMany(CourseItem::class, 'lesson_phrase')
            ->withPivot('order')
            ->orderBy('lesson_phrase.order');
    }

    public function tokens(): HasMany
    {
        return $this->hasMany(PhraseToken::class)->orderBy('order');
    }
}