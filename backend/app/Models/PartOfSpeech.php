<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PartOfSpeech extends Model
{
    protected $table = 'parts_of_speech';

    protected $fillable = [
        'title',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function words(): HasMany
    {
        return $this->hasMany(Word::class);
    }
}