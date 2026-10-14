<?php

namespace Database\Seeders;

use App\Models\LibraryItem;
use Illuminate\Database\Seeder;

class LibraryItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'title'       => 'Sejong Korean 1',
                'author'      => 'King Sejong Institute',
                'type'        => LibraryItem::TYPE_TEXTBOOK,
                'description' => 'Базовый учебник корейского языка для начинающих.',
                'file_path'   => 'library/files/1.pdf',
                'level'       => '1급',
                'language'    => 'ko',
                'pages'       => 200,
                'year'        => 2020,
            ],
            [
                'title'       => 'Korean-Russian Dictionary',
                'author'      => 'Lee Hyeon',
                'type'        => LibraryItem::TYPE_DICTIONARY,
                'description' => 'Корейско-русский словарь на 30 000 слов.',
                'file_path'   => 'library/files/2.pdf',
                'level'       => null,
                'language'    => 'mixed',
                'pages'       => 850,
                'year'        => 2018,
            ],
            [
                'title'       => 'The Little Prince (어린 왕자)',
                'author'      => 'Antoine de Saint-Exupéry',
                'type'        => LibraryItem::TYPE_BOOK,
                'description' => '«Маленький принц» на корейском языке для чтения.',
                'file_path'   => 'library/files/3.pdf',
                'level'       => '3급',
                'language'    => 'ko',
                'pages'       => 120,
                'year'        => 2015,
            ],
            [
                'title'       => 'TOPIK I Workbook',
                'author'      => 'Hanibo Team',
                'type'        => LibraryItem::TYPE_WORKBOOK,
                'description' => 'Рабочая тетрадь для подготовки к TOPIK I.',
                'file_path'   => 'library/files/4.pdf',
                'level'       => '1-2급',
                'language'    => 'mixed',
                'pages'       => 180,
                'year'        => 2022,
            ],
            [
                'title'       => 'Hanibo Flashcards: Basic Verbs',
                'author'      => 'Hanibo Team',
                'type'        => LibraryItem::TYPE_FLASHCARDS,
                'description' => 'Набор карточек с базовыми корейскими глаголами.',
                'file_path'   => 'library/files/5.pdf',
                'level'       => '1급',
                'language'    => 'ko',
                'pages'       => 60,
                'year'        => 2024,
            ],
        ];

        foreach ($items as $item) {
            LibraryItem::create($item);
        }
    }
}