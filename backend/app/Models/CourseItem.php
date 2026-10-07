<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CourseItem extends Model
{
    protected $fillable = [
        'type',
        'order',
        'level_id',
        'title',
        'extra_id',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function extra(): BelongsTo
    {
        return $this->belongsTo(Extra::class);
    }

    public function words(): BelongsToMany
    {
        return $this->belongsToMany(Word::class, 'lesson_word')
            ->withPivot('order')
            ->orderBy('lesson_word.order');
    }

    public function phrases(): BelongsToMany
    {
        return $this->belongsToMany(Phrase::class, 'lesson_phrase')
            ->withPivot('order')
            ->orderBy('lesson_phrase.order');
    }

    public function grammarRules(): BelongsToMany
    {
        return $this->belongsToMany(GrammarRule::class, 'lesson_grammar')
            ->withPivot('order')
            ->orderBy('lesson_grammar.order');
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function testLessons(): BelongsToMany
    {
        return $this->belongsToMany(
            CourseItem::class,
            'course_test_lessons',
            'course_test_id',
            'course_lesson_id',
        )->orderBy('course_lesson_id');
    }
}