<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\LessonWord;
use App\Models\Question;
use App\Models\CourseItem;
use Illuminate\Database\Seeder;

class LessonSeeder extends Seeder
{
    public function run(): void
    {
        // 6 уроков, соответствующих course_items с type=lesson
        $lessonsData = [
            [
                'title' => 'Урок 1',
                'order' => 1,
                'words' => [
                    ['안녕하세요', 'здравствуйте'],
                    ['감사합니다', 'спасибо'],
                    ['안녕히 가세요', 'до свидания'],
                    ['죄송합니다', 'извините'],
                    ['네', 'да'],
                    ['아니요', 'нет'],
                    ['저', 'я'],
                    ['학생', 'студент'],
                ],
            ],
            [
                'title' => 'Урок 2',
                'order' => 3,
                'words' => [
                    ['사람', 'человек'],
                    ['친구', 'друг'],
                    ['가족', 'семья'],
                    ['집', 'дом'],
                    ['학교', 'школа'],
                    ['선생님', 'учитель'],
                    ['이름', 'имя'],
                    ['나라', 'страна'],
                ],
            ],
            [
                'title' => 'Урок 3',
                'order' => 4,
                'words' => [
                    ['물', 'вода'],
                    ['밥', 'еда'],
                    ['책', 'книга'],
                    ['차', 'чай'],
                    ['커피', 'кофе'],
                    ['과일', 'фрукт'],
                    ['고기', 'мясо'],
                    ['빵', 'хлеб'],
                ],
            ],
            [
                'title' => 'Урок 4',
                'order' => 7,
                'words' => [
                    ['가다', 'идти'],
                    ['오다', 'приходить'],
                    ['먹다', 'есть'],
                    ['마시다', 'пить'],
                    ['보다', 'смотреть'],
                    ['듣다', 'слушать'],
                    ['읽다', 'читать'],
                    ['쓰다', 'писать'],
                ],
            ],
            [
                'title' => 'Урок 5',
                'order' => 8,
                'words' => [
                    ['크다', 'большой'],
                    ['작다', 'маленький'],
                    ['좋다', 'хороший'],
                    ['나쁘다', 'плохой'],
                    ['많다', 'много'],
                    ['적다', 'мало'],
                    ['새롭다', 'новый'],
                    ['예쁘다', 'красивый'],
                ],
            ],
            [
                'title' => 'Урок 6',
                'order' => 9,
                'words' => [
                    ['오늘', 'сегодня'],
                    ['내일', 'завтра'],
                    ['어제', 'вчера'],
                    ['아침', 'утро'],
                    ['저녁', 'вечер'],
                    ['밤', 'ночь'],
                    ['시간', 'время'],
                    ['날', 'день'],
                ],
            ],
        ];
  foreach ($lessonsData as $lessonData) {
            $lesson = Lesson::create([
                'title' => $lessonData['title'],
                'order' => $lessonData['order'],
            ]);

            $words = [];
            foreach ($lessonData['words'] as $i => [$korean, $russian]) {
                $words[] = LessonWord::create([
                    'lesson_id' => $lesson->id,
                    'korean'    => $korean,
                    'russian'   => $russian,
                    'order'     => $i + 1,
                ]);
            }

            foreach ($words as $word) {
                $distractors = collect($words)
                    ->where('id', '!=', $word->id)
                    ->pluck('russian')
                    ->shuffle()
                    ->take(3)
                    ->values()
                    ->all();

                $options = array_merge([$word->russian], $distractors);
                shuffle($options);

                $correctIndex = array_search($word->russian, $options);

                Question::create([
                    'lesson_id' => $lesson->id,
                    'type'      => 'choose_translation',
                    'payload'   => [
                        'prompt'        => $word->korean,
                        'options'       => $options,
                        'correct_index' => $correctIndex,
                    ],
                ]);
            }

            // Привязываем урок к course_item по order
            CourseItem::where('type', 'lesson')
                ->where('order', $lessonData['order'])
                ->update(['lesson_id' => $lesson->id]);
        }
    }
}