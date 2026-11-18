<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GrammarRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'construction',
        'form_id',
        'level_id',
    ];

    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class);
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function phrases(): BelongsToMany
    {
        return $this->belongsToMany(Phrase::class, 'grammar_phrase');
    }

    public function lessons(): BelongsToMany
    {
        return $this->belongsToMany(CourseItem::class, 'lesson_grammar')
            ->withPivot('order')
            ->orderBy('lesson_grammar.order');
    }

    public function userGrammarRules(): HasMany
    {
        return $this->hasMany(UserGrammarRule::class);
    }
}