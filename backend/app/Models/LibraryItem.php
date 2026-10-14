<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LibraryItem extends Model
{
    use HasFactory;

    public const TYPE_TEXTBOOK   = 'textbook';
    public const TYPE_DICTIONARY = 'dictionary';
    public const TYPE_BOOK       = 'book';
    public const TYPE_WORKBOOK   = 'workbook';
    public const TYPE_FLASHCARDS = 'flashcards';

    public const TYPES = [
        self::TYPE_TEXTBOOK,
        self::TYPE_DICTIONARY,
        self::TYPE_BOOK,
        self::TYPE_WORKBOOK,
        self::TYPE_FLASHCARDS,
    ];

    protected $fillable = [
        'title',
        'author',
        'type',
        'description',
        'cover_path',
        'file_path',
        'level',
        'language',
        'pages',
        'year',
    ];

    protected $casts = [
        'pages' => 'integer',
        'year'  => 'integer',
    ];
}