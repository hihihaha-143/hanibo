<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CourseTestLessonSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            'Тест 1' => [1, 3, 4],
            'Тест 2' => [7, 8, 9, 10],
        ];

        foreach ($groups as $testTitle => $lessonOrders) {
            $testId = DB::table('course_items')
                ->where('type', 'test')
                ->where('title', $testTitle)
                ->value('id');

            if (!$testId) {
                continue;
            }

            $lessonIds = DB::table('course_items')
                ->where('type', 'lesson')
                ->whereIn('order', $lessonOrders)
                ->pluck('id');

            foreach ($lessonIds as $lessonId) {
                DB::table('course_test_lessons')->updateOrInsert(
                    [
                        'course_test_id' => $testId,
                        'course_lesson_id' => $lessonId,
                    ],
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                );
            }
        }
    }
}
