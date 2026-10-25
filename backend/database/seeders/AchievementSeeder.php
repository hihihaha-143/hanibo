<?php

namespace Database\Seeders;

use App\Models\Achievement\Achievement;
use App\Models\Achievement\AchievementCategory;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['code' => 'alphabet', 'title' => 'Алфавит', 'sort_order' => 10],
        ];

        $categoryIds = [];

        foreach ($categories as $cat) {
            $model = AchievementCategory::updateOrCreate(
                ['code' => $cat['code']],
                [
                    'title' => $cat['title'],
                    'sort_order' => $cat['sort_order'],
                ],
            );
            $categoryIds[$cat['code']] = $model->id;
        }

        $alphabetId = $categoryIds['alphabet'];

        $achievements = [
            // --- Базовые (+3) ---
            [
                'code' => 'first_test',
                'title' => 'Первый шаг',
                'description' => 'Пройти первый тест по алфавиту.',
                'icon' => 'footprints',
                'is_hidden' => false,
                'blueberry_reward' => 3,
                'sort_order' => 10,
            ],
            [
                'code' => 'first_letter',
                'title' => 'Первая буква',
                'description' => 'Довести одну букву до 10/10.',
                'icon' => 'star',
                'is_hidden' => false,
                'blueberry_reward' => 3,
                'sort_order' => 20,
            ],
            [
                'code' => 'first_group',
                'title' => 'Первая группа',
                'description' => 'Пройти тест группы на 100%.',
                'icon' => 'layers',
                'is_hidden' => false,
                'blueberry_reward' => 3,
                'sort_order' => 30,
            ],
            [
                'code' => 'first_all',
                'title' => 'Первый общий',
                'description' => 'Пройти «Пройти всё».',
                'icon' => 'globe',
                'is_hidden' => false,
                'blueberry_reward' => 3,
                'sort_order' => 40,
            ],

            // --- По категориям (+25) ---
            [
                'code' => 'all_vowels',
                'title' => 'Гласные — мастеринг',
                'description' => 'Все гласные (10) на 10/10.',
                'icon' => 'type',
                'is_hidden' => false,
                'blueberry_reward' => 25,
                'sort_order' => 100,
            ],
            [
                'code' => 'all_consonants',
                'title' => 'Согласные — мастеринг',
                'description' => 'Все согласные (19) на 10/10.',
                'icon' => 'type',
                'is_hidden' => false,
                'blueberry_reward' => 25,
                'sort_order' => 110,
            ],
            [
                'code' => 'all_diphthongs',
                'title' => 'Дифтонги — мастеринг',
                'description' => 'Все дифтонги (11) на 10/10.',
                'icon' => 'type',
                'is_hidden' => false,
                'blueberry_reward' => 25,
                'sort_order' => 120,
            ],
            [
                'code' => 'all_assimilation',
                'title' => 'Ассимиляция — мастеринг',
                'description' => 'Все 5 записей ассимиляции на 10/10.',
                'icon' => 'type',
                'is_hidden' => false,
                'blueberry_reward' => 25,
                'sort_order' => 130,
            ],
            [
                'code' => 'all_alphabet',
                'title' => 'Алфавит — мастеринг',
                'description' => 'Все 45 записей на 10/10. Титул: «Знаю алфавит».',
                'icon' => 'crown',
                'is_hidden' => false,
                'blueberry_reward' => 50,
                'sort_order' => 140,
            ],

            // --- Идеальные (+10) ---
            [
                'code' => 'perfect_letter',
                'title' => 'Без единой ошибки',
                'description' => 'Тест по букве на 100%.',
                'icon' => 'sparkles',
                'is_hidden' => true,
                'blueberry_reward' => 10,
                'sort_order' => 200,
            ],
            [
                'code' => 'perfect_group',
                'title' => 'Группа без ошибок',
                'description' => 'Тест группы на 100%.',
                'icon' => 'sparkles',
                'is_hidden' => true,
                'blueberry_reward' => 10,
                'sort_order' => 210,
            ],
            [
                'code' => 'perfect_all',
                'title' => 'Всё без ошибок',
                'description' => '«Пройти всё» на 100%.',
                'icon' => 'sparkles',
                'is_hidden' => true,
                'blueberry_reward' => 25,
                'sort_order' => 220,
            ],

            // --- Количество (+3 / +10 / +25 / +50) ---
            [
                'code' => 'tests_10',
                'title' => 'Десятка',
                'description' => 'Пройдено 10 тестов.',
                'icon' => 'hash',
                'is_hidden' => false,
                'blueberry_reward' => 3,
                'sort_order' => 300,
            ],
            [
                'code' => 'tests_50',
                'title' => 'Полтинник',
                'description' => 'Пройдено 50 тестов.',
                'icon' => 'hash',
                'is_hidden' => false,
                'blueberry_reward' => 10,
                'sort_order' => 310,
            ],
            [
                'code' => 'tests_100',
                'title' => 'Сотка',
                'description' => 'Пройдено 100 тестов.',
                'icon' => 'hash',
                'is_hidden' => false,
                'blueberry_reward' => 25,
                'sort_order' => 320,
            ],
            [
                'code' => 'tests_500',
                'title' => 'Пятисотка',
                'description' => 'Пройдено 500 тестов.',
                'icon' => 'hash',
                'is_hidden' => false,
                'blueberry_reward' => 50,
                'sort_order' => 330,
            ],
            [
                'code' => 'attempts_10',
                'title' => 'Упорство',
                'description' => '10 попыток на одну букву.',
                'icon' => 'rotate-cw',
                'is_hidden' => false,
                'blueberry_reward' => 3,
                'sort_order' => 340,
            ],
            [
                'code' => 'attempts_50',
                'title' => 'Упорный',
                'description' => '50 попыток на одну букву.',
                'icon' => 'rotate-cw',
                'is_hidden' => false,
                'blueberry_reward' => 10,
                'sort_order' => 350,
            ],
            [
                'code' => 'mistakes_10',
                'title' => 'Ошибки — часть пути',
                'description' => '10 ошибок у одной буквы.',
                'icon' => 'alert-circle',
                'is_hidden' => false,
                'blueberry_reward' => 10,
                'sort_order' => 360,
            ],
            [
                'code' => 'mistakes_50',
                'title' => 'Ещё не сдался',
                'description' => '50 ошибок у одной буквы.',
                'icon' => 'alert-circle',
                'is_hidden' => false,
                'blueberry_reward' => 5,
                'sort_order' => 370,
            ],

            // --- Время (+3) ---
            [
                'code' => 'night_owl',
                'title' => 'Полуночник',
                'description' => 'Пройти тест между 00:00 и 05:00.',
                'icon' => 'moon',
                'is_hidden' => true,
                'blueberry_reward' => 3,
                'sort_order' => 400,
            ],
            [
                'code' => 'early_bird',
                'title' => 'Ранняя пташка',
                'description' => 'Пройти тест между 05:00 и 08:00.',
                'icon' => 'sunrise',
                'is_hidden' => true,
                'blueberry_reward' => 3,
                'sort_order' => 410,
            ],

            // --- Шуточные (+5) ---
            [
                'code' => 'all_wrong',
                'title' => 'Абсолютный ноль',
                'description' => 'Пройти тест и ответить на все вопросы неправильно.',
                'icon' => 'x-circle',
                'is_hidden' => true,
                'blueberry_reward' => 3,
                'sort_order' => 500,
            ],
            [
                'code' => 'double_confetti',
                'title' => 'Двойной салют',
                'description' => 'За один тест две буквы достигли 10/10.',
                'icon' => 'party-popper',
                'is_hidden' => true,
                'blueberry_reward' => 10,
                'sort_order' => 510,
            ],
            [
                'code' => 'triple_confetti',
                'title' => 'Тройной салют',
                'description' => 'За один тест три буквы достигли 10/10.',
                'icon' => 'party-popper',
                'is_hidden' => true,
                'blueberry_reward' => 50,
                'sort_order' => 520,
            ],
            [
                'code' => 'one_letter_fan',
                'title' => 'Фанат одной буквы',
                'description' => '20 попыток на одну и ту же букву.',
                'icon' => 'heart',
                'is_hidden' => true,
                'blueberry_reward' => 10,
                'sort_order' => 530,
            ],
            [
                'code' => 'mistake_100',
                'title' => 'Корейский — сложный',
                'description' => '100 накопленных ошибок (сумма по всем буквам).',
                'icon' => 'skull',
                'is_hidden' => true,
                'blueberry_reward' => 5,
                'sort_order' => 540,
            ],
            [
                'code' => 'mistake_1000',
                'title' => 'Тысяча ошибок',
                'description' => '1000 накопленных ошибок (сумма по всем буквам).',
                'icon' => 'skull',
                'is_hidden' => true,
                'blueberry_reward' => 50,
                'sort_order' => 550,
            ],
        ];

        foreach ($achievements as $item) {
            Achievement::updateOrCreate(
                ['code' => $item['code']],
                [
                    'title' => $item['title'],
                    'description' => $item['description'],
                    'icon' => $item['icon'],
                    'category_id' => $alphabetId,
                    'is_hidden' => $item['is_hidden'],
                    'blueberry_reward' => $item['blueberry_reward'],
                    'sort_order' => $item['sort_order'],
                ],
            );
        }
    }
}