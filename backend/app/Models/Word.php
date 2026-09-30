<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Word extends Model
{
    protected $fillable = [
        'hangul',
        'translation',
        'part_of_speech_id',
        'level_id',
    ];

    public function partOfSpeech(): BelongsTo
    {
        return $this->belongsTo(PartOfSpeech::class, 'part_of_speech_id');
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function topics(): BelongsToMany
    {
        return $this->belongsToMany(Topic::class, 'word_topic');
    }

    public function phrases(): BelongsToMany
    {
        return $this->belongsToMany(Phrase::class, 'phrase_word');
    }

    public function courseItems(): BelongsToMany
    {
        return $this->belongsToMany(CourseItem::class, 'lesson_word')
            ->withPivot('order')
            ->withTimestamps(false);
    }
}