<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AlphabetLetter extends Model
{
    protected $fillable = [
        'symbol',
        'romanization',
        'category',
        'description',
        'sound_ipa',
        'sound_note',
        'sample_syllable',
        'sample_romanization',
        'family_symbols',
        'family_note',
        'confusion',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'family_symbols' => 'array',
            'confusion' => 'array',
        ];
    }

    public function examples(): HasMany
    {
        return $this->hasMany(AlphabetExample::class, 'letter_id')
            ->orderBy('sort_order');
    }
}