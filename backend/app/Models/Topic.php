<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Topic extends Model
{
    protected $fillable = [
        'title',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function words(): BelongsToMany
    {
        return $this->belongsToMany(Word::class, 'word_topic');
    }

    public function phrases(): BelongsToMany
    {
        return $this->belongsToMany(Phrase::class, 'phrase_topic');
    }
}