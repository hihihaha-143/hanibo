<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class GrammarRule extends Model
{
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
}