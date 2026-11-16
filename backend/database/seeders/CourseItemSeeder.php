<?php

namespace Database\Seeders;

use App\Models\CourseItem;
use Illuminate\Database\Seeder;

class CourseItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['type' => 'lesson', 'order' => 1,  'title' => 'Урок 1'],
            ['type' => 'extra',  'order' => 2,  'title' => 'Доп. материал'],
            ['type' => 'lesson', 'order' => 3,  'title' => 'Урок 2'],
            ['type' => 'lesson', 'order' => 4,  'title' => 'Урок 3'],
            ['type' => 'test',   'order' => 5,  'title' => 'Тест 1'],
            ['type' => 'extra',  'order' => 6,  'title' => 'Доп. материал'],
            ['type' => 'lesson', 'order' => 7,  'title' => 'Урок 4'],
            ['type' => 'lesson', 'order' => 8,  'title' => 'Урок 5'],
            ['type' => 'lesson', 'order' => 9,  'title' => 'Урок 6'],
            ['type' => 'lesson', 'order' => 10, 'title' => 'Урок 7'],
            ['type' => 'extra',  'order' => 11, 'title' => 'Доп. материал'],
            ['type' => 'test',   'order' => 12, 'title' => 'Тест 2'],
            ['type' => 'lesson', 'order' => 13, 'title' => 'Урок 8'],
            ['type' => 'lesson', 'order' => 14, 'title' => 'Урок 9'],
            ['type' => 'lesson', 'order' => 15, 'title' => 'Урок 10'],
        ];

        foreach ($items as $item) {
            CourseItem::create($item);
        }
    }
}