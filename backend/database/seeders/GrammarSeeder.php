<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GrammarSeeder extends Seeder
{
    private const LESSON_ORDERS = [1, 3, 4, 7, 8, 9, 10, 13, 14, 15];

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

        $formId = fn (string $title) => DB::table('forms')->where('title', $title)->value('id');
        $level1Id = DB::table('levels')->where('title', '1급')->value('id');

        $politeId = $formId('вежливая');

        // ---------- rules ----------
        // Каждый элемент: [lesson_order => [rule, rule]]
        $rulesByLesson = [
            1 => [
                [
                    'title' => 'Вежливая форма глагола -아요/-어요',
                    'construction' => 'V-아요 / V-어요',
                    'form_id' => $politeId,
                    'phrases' => ['안녕하세요', '감사합니다'],
                ],
                [
                    'title' => 'Именительный падеж (частица 은/는)',
                    'construction' => 'N-은 / N-는',
                    'form_id' => null,
                    'phrases' => ['저는 학생입니다', '이름이 뭐예요?'],
                ],
            ],
            3 => [
                [
                    'title' => 'Винительный падеж (частица 를/을)',
                    'construction' => 'N-를 / N-을',
                    'form_id' => null,
                    'phrases' => ['저는 학생입니다', '비빔밥을 먹읍시다'],
                ],
                [
                    'title' => 'Частица тоже -도',
                    'construction' => 'N-도',
                    'form_id' => null,
                    'phrases' => ['구두도 샀습니다', '지하철역과 시장도 가까워서 아주 편리합니다'],
                ],
            ],
            4 => [
                [
                    'title' => 'Дательный падеж -에 (куда / когда)',
                    'construction' => 'N-에',
                    'form_id' => null,
                    'phrases' => ['지금 공항에 갑니다', '아침 여섯 시에 일어납니다'],
                ],
                [
                    'title' => 'Частица -에서 (где / откуда)',
                    'construction' => 'N-에서',
                    'form_id' => null,
                    'phrases' => ['도서관에서 책을 읽습니다', '백화점에서 가방을 샀습니다'],
                ],
            ],
            7 => [
                [
                    'title' => 'Прошедшее время -았/었-',
                    'construction' => 'V-았- / V-었-',
                    'form_id' => null,
                    'phrases' => ['새집으로 이사를 했습니다', '어제는 공원에서 그림을 그렸습니다'],
                ],
                [
                    'title' => 'Отрицание 안',
                    'construction' => '안 + V',
                    'form_id' => null,
                    'phrases' => ['오늘은 바쁩니다', '내일부터 주말까지는 날씨가 맑겠습니다'],
                ],
            ],
            8 => [
                [
                    'title' => 'Соединительная частица -하고 / -(이)랑 (и, с)',
                    'construction' => 'N-하고 / N-(이)랑',
                    'form_id' => null,
                    'phrases' => ['친구와 함께 영화를 봤습니다', '가족들과 함께 살았습니다'],
                ],
                [
                    'title' => 'Дательный падеж -에게 / -한테 (кому)',
                    'construction' => 'N-에게 / N-한테',
                    'form_id' => null,
                    'phrases' => ['저는 프랑스 사람입니다', '언니의 결혼식입니다'],
                ],
            ],
            9 => [
                [
                    'title' => 'Будущее время -(으)ㄹ 거예요',
                    'construction' => 'V-(으)ㄹ 거예요',
                    'form_id' => $politeId,
                    'phrases' => ['영화를 보러 갈 거예요', '비행기표를 사려고 하는데요'],
                ],
                [
                    'title' => 'Желание -고 싶다 (хотеть)',
                    'construction' => 'V-고 싶다',
                    'form_id' => $politeId,
                    'phrases' => ['옷을 사려고 합니다', '등산을 자주 하고 싶지만 시간이 없습니다'],
                ],
            ],
            10 => [
                [
                    'title' => 'Возможность -(으)ㄹ 수 있다 (мочь)',
                    'construction' => 'V-(으)ㄹ 수 있다',
                    'form_id' => null,
                    'phrases' => ['이 카드가 있으면 5% 싸게 살 수 있습니다', '밤에 가면 아름다운 야경도 즐길 수 있습니다'],
                ],
                [
                    'title' => 'Невозможность 못 (не мочь)',
                    'construction' => '못 + V',
                    'form_id' => null,
                    'phrases' => ['오늘은 바쁩니다', '몸도 건강해지고 걱정도 없어지는 것 같습니다'],
                ],
            ],
            13 => [
                [
                    'title' => 'Соединение действий -고 (и, затем)',
                    'construction' => 'V-고',
                    'form_id' => null,
                    'phrases' => ['청소를 합니다', '요리를 합니다'],
                ],
                [
                    'title' => 'Противопоставление -지만 (но)',
                    'construction' => 'V-지만',
                    'form_id' => null,
                    'phrases' => ['등산을 자주 하고 싶지만 시간이 없습니다', '옷이 비싸요'],
                ],
            ],
            14 => [
                [
                    'title' => 'Причина / связь -아/어서',
                    'construction' => 'V-아서 / V-어서',
                    'form_id' => $politeId,
                    'phrases' => ['지하철역과 시장도 가까워서 아주 편리합니다', '그래서 수박을 샀습니다'],
                ],
                [
                    'title' => 'Фон / контраст -는데',
                    'construction' => 'V-는데',
                    'form_id' => null,
                    'phrases' => ['지금 한국어를 배우고 있는데 아주 재미있습니다', '비행기표를 사려고 하는데요'],
                ],
            ],
            15 => [
                [
                    'title' => 'Частица только -만',
                    'construction' => 'N-만',
                    'form_id' => null,
                    'phrases' => ['저는 혼자 산에 오르는 것을 좋아합니다', '주말에 시간이 있어요?'],
                ],
                [
                    'title' => 'Определительная форма -(으)ㄴ/는',
                    'construction' => 'V-(으)ㄴ / V-는 + N',
                    'form_id' => null,
                    'phrases' => ['새집은 넓고 깨끗합니다', '밤에 가면 아름다운 야경도 즐길 수 있습니다'],
                ],
            ],
        ];

        // Собираем все правила плоско: [title => data]
        $flatRules = [];
        foreach ($rulesByLesson as $lessonOrder => $list) {
            foreach ($list as $idx => $rule) {
                $flatRules[$rule['title']] = $rule + ['lesson_order' => $lessonOrder, 'lesson_pos' => $idx + 1];
            }
        }

        // ---------- upsert grammar_rules ----------
        foreach ($flatRules as $title => $rule) {
            DB::table('grammar_rules')->updateOrInsert(
                ['title' => $title],
                [
                    'title' => $title,
                    'construction' => $rule['construction'],
                    'form_id' => $rule['form_id'],
                    'level_id' => $level1Id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $ruleIds = DB::table('grammar_rules')
            ->whereIn('title', array_keys($flatRules))
            ->pluck('id', 'title');

        // ---------- lesson_grammar (только type=lesson) ----------
        $lessonCourseItems = DB::table('course_items')
            ->where('type', 'lesson')
            ->whereIn('order', self::LESSON_ORDERS)
            ->pluck('id', 'order');

        foreach ($flatRules as $title => $rule) {
            $courseItemId = $lessonCourseItems[$rule['lesson_order']] ?? null;
            $ruleId = $ruleIds[$title] ?? null;

            if (!$courseItemId || !$ruleId) {
                continue;
            }

            DB::table('lesson_grammar')->updateOrInsert(
                ['course_item_id' => $courseItemId, 'grammar_rule_id' => $ruleId],
                ['order' => $rule['lesson_pos']]
            );
        }

        // ---------- grammar_phrase ----------
        // Для каждого правила: чистим старые связи, затем вешаем найденные фразы.
        // Fallback: первые 2 фразы этого урока (если заданные фразы не найдены).
        $lessonPhrases = DB::table('lesson_phrase')
            ->join('phrases', 'phrases.id', '=', 'lesson_phrase.phrase_id')
            ->whereIn('lesson_phrase.course_item_id', $lessonCourseItems->values())
            ->orderBy('lesson_phrase.order')
            ->get(['lesson_phrase.course_item_id', 'phrases.hangul'])
            ->groupBy('course_item_id');

        foreach ($flatRules as $title => $rule) {
            $ruleId = $ruleIds[$title] ?? null;
            if (!$ruleId) {
                continue;
            }

            $courseItemId = $lessonCourseItems[$rule['lesson_order']] ?? null;

            // Находим id фраз из заданного списка
            $phraseIds = DB::table('phrases')
                ->whereIn('hangul', $rule['phrases'])
                ->pluck('id')
                ->all();

            // Fallback: первые 2 фразы урока
            if (count($phraseIds) < 2 && $courseItemId) {
                $fallbackHangul = ($lessonPhrases[$courseItemId] ?? collect())
                    ->pluck('hangul')
                    ->take(2)
                    ->all();

                $fallbackIds = DB::table('phrases')
                    ->whereIn('hangul', $fallbackHangul)
                    ->pluck('id')
                    ->all();

                $phraseIds = array_values(array_unique(array_merge($phraseIds, $fallbackIds)));
            }

            // Чистим старые связи этого правила
            DB::table('grammar_phrase')->where('grammar_rule_id', $ruleId)->delete();

            foreach ($phraseIds as $pid) {
                DB::table('grammar_phrase')->insert([
                    'grammar_rule_id' => $ruleId,
                    'phrase_id' => $pid,
                ]);
            }
        }
    }
}