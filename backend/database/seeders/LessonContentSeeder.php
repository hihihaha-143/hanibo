<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LessonContentSeeder extends Seeder
{
    public function run(): void
    {
        // Урок 1 = course_items.id = 1
        $lessonId = DB::table('course_items')
            ->where('type', 'lesson')
            ->where('order', 1)
            ->value('id');

        if (!$lessonId) {
            return;
        }

        // ---------- слова урока 1 ----------
        $words = [
            ['hangul' => '안녕',       'order' => 1],
            ['hangul' => '안녕하세요', 'order' => 2],
            ['hangul' => '사과',       'order' => 3],
            ['hangul' => '먹다',       'order' => 4],
        ];

        foreach ($words as $row) {
            $wordId = DB::table('words')->where('hangul', $row['hangul'])->value('id');
            if ($wordId) {
                DB::table('lesson_word')->updateOrInsert(
                    ['course_item_id' => $lessonId, 'word_id' => $wordId],
                    ['order' => $row['order']]
                );
            }
        }

        // ---------- фразы урока 1 ----------
        $phrases = [
            ['hangul' => '안녕하세요',     'order' => 1],
            ['hangul' => '사과를 먹어요', 'order' => 2],
        ];

        foreach ($phrases as $row) {
            $phraseId = DB::table('phrases')->where('hangul', $row['hangul'])->value('id');
            if ($phraseId) {
                DB::table('lesson_phrase')->updateOrInsert(
                    ['course_item_id' => $lessonId, 'phrase_id' => $phraseId],
                    ['order' => $row['order']]
                );
            }
        }
    }
}