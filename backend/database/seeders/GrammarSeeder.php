<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GrammarSeeder extends Seeder
{
    public function run(): void
    {
        // ---------- forms ----------
        $forms = [
            ['title' => 'вежливая', 'order' => 1],
            ['title' => 'неформальная', 'order' => 2],
            ['title' => 'формальная', 'order' => 3],
            ['title' => 'разговорная', 'order' => 4],
            ['title' => 'письменная', 'order' => 5],
        ];
        foreach ($forms as $row) {
            DB::table('forms')->updateOrInsert(
                ['title' => $row['title']],
                $row + ['created_at' => now(), 'updated_at' => now()]
            );
        }

        $politeId = DB::table('forms')->where('title', 'вежливая')->value('id');
        $level1Id = DB::table('levels')->where('title', '1급')->value('id');

        // ---------- grammar_rules ----------
        $rules = [
            [
                'title' => 'Вежливая форма глагола -아요/-어요',
                'construction' => 'V-아요 / V-어요',
                'form_id' => $politeId,
                'level_id' => $level1Id,
            ],
            [
                'title' => 'Винительный падеж (частица 를/을)',
                'construction' => 'N-를 / N-을',
                'form_id' => null,
                'level_id' => $level1Id,
            ],
        ];
        foreach ($rules as $row) {
            DB::table('grammar_rules')->updateOrInsert(
                ['title' => $row['title']],
                $row + ['created_at' => now(), 'updated_at' => now()]
            );
        }

        $politeRuleId = DB::table('grammar_rules')
            ->where('title', 'Вежливая форма глагола -아요/-어요')
            ->value('id');
        $objectParticleRuleId = DB::table('grammar_rules')
            ->where('title', 'Винительный падеж (частица 를/을)')
            ->value('id');

        // ---------- phrases (примеры) ----------
        // Используем существующую фразу «사과를 먹어요».
        $phraseId = DB::table('phrases')->where('hangul', '사과를 먹어요')->value('id');

        if (!$phraseId) {
            $phraseId = DB::table('phrases')->insertGetId([
                'hangul' => '사과를 먹어요',
                'translation' => 'Я ем яблоко',
                'level_id' => $level1Id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $wordAppleId = DB::table('words')->where('hangul', '사과')->value('id');
        $wordEatId = DB::table('words')->where('hangul', '먹다')->value('id');

        // ---------- phrase_tokens ----------
        if ($phraseId) {
            DB::table('phrase_tokens')->where('phrase_id', $phraseId)->delete();

            $tokens = [
                ['order' => 1, 'text' => '사과', 'word_id' => $wordAppleId, 'grammar_rule_id' => null, 'space_after' => false],
                ['order' => 2, 'text' => '를', 'word_id' => null, 'grammar_rule_id' => $objectParticleRuleId, 'space_after' => true],
                ['order' => 3, 'text' => '먹', 'word_id' => $wordEatId, 'grammar_rule_id' => $politeRuleId, 'space_after' => false],
                ['order' => 4, 'text' => '어요', 'word_id' => null, 'grammar_rule_id' => $politeRuleId, 'space_after' => false],
            ];

            foreach ($tokens as $t) {
                DB::table('phrase_tokens')->insert(
                    $t + [
                        'phrase_id' => $phraseId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }

        // ---------- grammar_phrase (привязка фразы к грамматике) ----------
        if ($phraseId) {
            $links = [
                ['grammar_rule_id' => $politeRuleId, 'phrase_id' => $phraseId],
                ['grammar_rule_id' => $objectParticleRuleId, 'phrase_id' => $phraseId],
            ];
            foreach ($links as $link) {
                DB::table('grammar_phrase')->updateOrInsert($link, []);
            }
        }

        // ---------- привязка грамматики к уроку 1 ----------
        $lessonId = DB::table('course_items')
            ->where('type', 'lesson')
            ->where('order', 1)
            ->value('id');

        if ($lessonId && $politeRuleId) {
            DB::table('lesson_grammar')->updateOrInsert(
                ['course_item_id' => $lessonId, 'grammar_rule_id' => $politeRuleId],
                ['order' => 1]
            );
        }
    }
}