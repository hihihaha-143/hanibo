<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DictionarySeeder extends Seeder
{
    public function run(): void
    {
        // ---------- levels ----------
        $levels = [
            ['title' => '1급', 'order' => 1],
            ['title' => '2급', 'order' => 2],
            ['title' => '3급', 'order' => 3],
            ['title' => '4급', 'order' => 4],
            ['title' => '5급', 'order' => 5],
            ['title' => '6급', 'order' => 6],
        ];
        foreach ($levels as $row) {
            DB::table('levels')->updateOrInsert(
                ['title' => $row['title']],
                $row + ['created_at' => now(), 'updated_at' => now()]
            );
        }

        // ---------- parts_of_speech ----------
        $parts = [
            ['title' => 'существительное', 'order' => 1],
            ['title' => 'глагол', 'order' => 2],
            ['title' => 'прилагательное', 'order' => 3],
            ['title' => 'наречие', 'order' => 4],
            ['title' => 'местоимение', 'order' => 5],
            ['title' => 'числительное', 'order' => 6],
            ['title' => 'частица', 'order' => 7],
            ['title' => 'междометие', 'order' => 8],
            ['title' => 'счётное слово', 'order' => 9],
        ];
        foreach ($parts as $row) {
            DB::table('parts_of_speech')->updateOrInsert(
                ['title' => $row['title']],
                $row + ['created_at' => now(), 'updated_at' => now()]
            );
        }

        // ---------- topics ----------
        $topics = [
            ['title' => 'Приветствия', 'order' => 1],
            ['title' => 'Дом', 'order' => 2],
            ['title' => 'Еда', 'order' => 3],
        ];
        foreach ($topics as $row) {
            DB::table('topics')->updateOrInsert(
                ['title' => $row['title']],
                $row + ['created_at' => now(), 'updated_at' => now()]
            );
        }

        // ---------- words ----------
        $nounId = DB::table('parts_of_speech')->where('title', 'существительное')->value('id');
        $verbId = DB::table('parts_of_speech')->where('title', 'глагол')->value('id');
        $level1Id = DB::table('levels')->where('title', '1급')->value('id');

        $words = [
            ['hangul' => '안녕', 'translation' => 'привет', 'part_of_speech_id' => $nounId, 'level_id' => $level1Id],
            ['hangul' => '안녕하세요', 'translation' => 'здравствуйте', 'part_of_speech_id' => $nounId, 'level_id' => $level1Id],
            ['hangul' => '사과', 'translation' => 'яблоко', 'part_of_speech_id' => $nounId, 'level_id' => $level1Id],
            ['hangul' => '먹다', 'translation' => 'есть (кушать)', 'part_of_speech_id' => $verbId, 'level_id' => $level1Id],
        ];
        foreach ($words as $row) {
            DB::table('words')->updateOrInsert(
                ['hangul' => $row['hangul']],
                $row + ['created_at' => now(), 'updated_at' => now()]
            );
        }

        // ---------- привязка слов к темам ----------
        $wordTopic = [
            ['hangul' => '안녕', 'topic' => 'Приветствия'],
            ['hangul' => '안녕하세요', 'topic' => 'Приветствия'],
            ['hangul' => '사과', 'topic' => 'Еда'],
            ['hangul' => '먹다', 'topic' => 'Еда'],
        ];
        foreach ($wordTopic as $row) {
            $wordId = DB::table('words')->where('hangul', $row['hangul'])->value('id');
            $topicId = DB::table('topics')->where('title', $row['topic'])->value('id');
            if ($wordId && $topicId) {
                DB::table('word_topic')->updateOrInsert(
                    ['word_id' => $wordId, 'topic_id' => $topicId],
                    []
                );
            }
        }

        // ---------- phrases ----------
        $phrases = [
            ['hangul' => '안녕하세요', 'translation' => 'Здравствуйте', 'level_id' => $level1Id],
            ['hangul' => '사과를 먹어요', 'translation' => 'Я ем яблоко', 'level_id' => $level1Id],
        ];
        foreach ($phrases as $row) {
            DB::table('phrases')->updateOrInsert(
                ['hangul' => $row['hangul']],
                $row + ['created_at' => now(), 'updated_at' => now()]
            );
        }

        // ---------- привязка фраз к темам ----------
        $phraseTopic = [
            ['hangul' => '안녕하세요', 'topic' => 'Приветствия'],
            ['hangul' => '사과를 먹어요', 'topic' => 'Еда'],
        ];
        foreach ($phraseTopic as $row) {
            $phraseId = DB::table('phrases')->where('hangul', $row['hangul'])->value('id');
            $topicId = DB::table('topics')->where('title', $row['topic'])->value('id');
            if ($phraseId && $topicId) {
                DB::table('phrase_topic')->updateOrInsert(
                    ['phrase_id' => $phraseId, 'topic_id' => $topicId],
                    []
                );
            }
        }

        // ---------- привязка фраз к словам (phrase_word) ----------
        $phraseWord = [
            ['phrase' => '안녕하세요', 'word' => '안녕'],
            ['phrase' => '사과를 먹어요', 'word' => '사과'],
            ['phrase' => '사과를 먹어요', 'word' => '먹다'],
        ];
        foreach ($phraseWord as $row) {
            $phraseId = DB::table('phrases')->where('hangul', $row['phrase'])->value('id');
            $wordId = DB::table('words')->where('hangul', $row['word'])->value('id');
            if ($phraseId && $wordId) {
                DB::table('phrase_word')->updateOrInsert(
                    ['phrase_id' => $phraseId, 'word_id' => $wordId],
                    []
                );
            }
        }
    }
}