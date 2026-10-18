<?php

namespace Database\Seeders;

use App\Models\AlphabetLetter;
use Illuminate\Database\Seeder;

class AlphabetSeeder extends Seeder
{
    public function run(): void
    {
        $vowels = [
            [
                'symbol' => 'ㅏ',
                'romanization' => 'а',
                'examples' => [
                    ['word' => '가방', 'romanization' => 'кабан', 'meaning' => 'сумка'],
                    ['word' => '나무', 'romanization' => 'наму', 'meaning' => 'дерево'],
                    ['word' => '사람', 'romanization' => 'сарам', 'meaning' => 'человек'],
                    ['word' => '바다', 'romanization' => 'пада', 'meaning' => 'море'],
                    ['word' => '아이', 'romanization' => 'аи', 'meaning' => 'ребёнок'],
                    ['word' => '학교', 'romanization' => 'хаккё', 'meaning' => 'школа'],
                ],
            ],
            [
                'symbol' => 'ㅑ',
                'romanization' => 'я',
                'examples' => [
                    ['word' => '야구', 'romanization' => 'ягу', 'meaning' => 'бейсбол'],
                    ['word' => '양말', 'romanization' => 'янмаль', 'meaning' => 'носок'],
                    ['word' => '약', 'romanization' => 'як', 'meaning' => 'лекарство'],
                    ['word' => '야채', 'romanization' => 'ячхэ', 'meaning' => 'овощи'],
                    ['word' => '양파', 'romanization' => 'янпха', 'meaning' => 'лук'],
                    ['word' => '약속', 'romanization' => 'яксок', 'meaning' => 'обещание'],
                ],
            ],
            [
                'symbol' => 'ㅓ',
                'romanization' => 'оэ',
                'examples' => [
                    ['word' => '어머니', 'romanization' => 'омони', 'meaning' => 'мама'],
                    ['word' => '언니', 'romanization' => 'онни', 'meaning' => 'старшая сестра (для девушки)'],
                    ['word' => '거울', 'romanization' => 'коуль', 'meaning' => 'зеркало'],
                    ['word' => '버스', 'romanization' => 'посу', 'meaning' => 'автобус'],
                    ['word' => '서울', 'romanization' => 'соуль', 'meaning' => 'Сеул'],
                    ['word' => '커피', 'romanization' => 'кхопхи', 'meaning' => 'кофе'],
                ],
            ],
            [
                'symbol' => 'ㅕ',
                'romanization' => 'йоэ',
                'examples' => [
                    ['word' => '여자', 'romanization' => 'ёджа', 'meaning' => 'женщина'],
                    ['word' => '여행', 'romanization' => 'ёхэн', 'meaning' => 'путешествие'],
                    ['word' => '벼', 'romanization' => 'пё', 'meaning' => 'рис (растение)'],
                    ['word' => '겨울', 'romanization' => 'кёуль', 'meaning' => 'зима'],
                    ['word' => '며느리', 'romanization' => 'мёныри', 'meaning' => 'невестка'],
                ],
            ],
            [
                'symbol' => 'ㅗ',
                'romanization' => 'о',
                'examples' => [
                    ['word' => '오이', 'romanization' => 'ои', 'meaning' => 'огурец'],
                    ['word' => '고기', 'romanization' => 'коги', 'meaning' => 'мясо'],
                    ['word' => '노래', 'romanization' => 'норэ', 'meaning' => 'песня'],
                    ['word' => '모자', 'romanization' => 'моджа', 'meaning' => 'шапка'],
                    ['word' => '도시', 'romanization' => 'тоси', 'meaning' => 'город'],
                    ['word' => '소리', 'romanization' => 'сори', 'meaning' => 'звук'],
                ],
            ],
            [
                'symbol' => 'ㅛ',
                'romanization' => 'ё',
                'examples' => [
                    ['word' => '요리', 'romanization' => 'ёри', 'meaning' => 'готовка, блюдо'],
                    ['word' => '교실', 'romanization' => 'кёсиль', 'meaning' => 'класс (комната)'],
                    ['word' => '표', 'romanization' => 'пхё', 'meaning' => 'билет'],
                    ['word' => '용', 'romanization' => 'ён', 'meaning' => 'дракон'],
                    ['word' => '요일', 'romanization' => 'ёиль', 'meaning' => 'день недели'],
                ],
            ],
            [
                'symbol' => 'ㅜ',
                'romanization' => 'у',
                'examples' => [
                    ['word' => '우유', 'romanization' => 'ую', 'meaning' => 'молоко'],
                    ['word' => '구두', 'romanization' => 'куду', 'meaning' => 'туфли'],
                    ['word' => '나무', 'romanization' => 'наму', 'meaning' => 'дерево'],
                    ['word' => '수박', 'romanization' => 'субак', 'meaning' => 'арбуз'],
                    ['word' => '우산', 'romanization' => 'усан', 'meaning' => 'зонт'],
                    ['word' => '두부', 'romanization' => 'тубу', 'meaning' => 'тофу'],
                ],
            ],
            [
                'symbol' => 'ㅠ',
                'romanization' => 'ю',
                'examples' => [
                    ['word' => '유리', 'romanization' => 'юри', 'meaning' => 'стекло'],
                    ['word' => '우유', 'romanization' => 'ую', 'meaning' => 'молоко'],
                    ['word' => '휴일', 'romanization' => 'хюиль', 'meaning' => 'выходной'],
                    ['word' => '규칙', 'romanization' => 'кючхик', 'meaning' => 'правило'],
                    ['word' => '뉴스', 'romanization' => 'нюсы', 'meaning' => 'новости'],
                ],
            ],
            [
                'symbol' => 'ㅡ',
                'romanization' => 'ы',
                'examples' => [
                    ['word' => '그림', 'romanization' => 'кырим', 'meaning' => 'картина'],
                    ['word' => '음악', 'romanization' => 'ымак', 'meaning' => 'музыка'],
                    ['word' => '크다', 'romanization' => 'кхыда', 'meaning' => 'быть большим'],
                    ['word' => '슬프다', 'romanization' => 'сыльпхыда', 'meaning' => 'быть грустным'],
                ],
            ],
            [
                'symbol' => 'ㅣ',
                'romanization' => 'и',
                'examples' => [
                    ['word' => '이름', 'romanization' => 'ирым', 'meaning' => 'имя'],
                    ['word' => '시간', 'romanization' => 'сиган', 'meaning' => 'время'],
                    ['word' => '지갑', 'romanization' => 'чигап', 'meaning' => 'кошелёк'],
                    ['word' => '비', 'romanization' => 'пи', 'meaning' => 'дождь'],
                    ['word' => '피자', 'romanization' => 'пхиджа', 'meaning' => 'пицца'],
                    ['word' => '나이', 'romanization' => 'наи', 'meaning' => 'возраст'],
                ],
            ],
        ];

        $diphthongs = [
            [
                'symbol' => 'ㅐ',
                'romanization' => 'э',
                'examples' => [
                    ['word' => '개', 'romanization' => 'кэ', 'meaning' => 'собака'],
                    ['word' => '내일', 'romanization' => 'нэиль', 'meaning' => 'завтра'],
                    ['word' => '생일', 'romanization' => 'сэниль', 'meaning' => 'день рождения'],
                    ['word' => '책', 'romanization' => 'чхэк', 'meaning' => 'книга'],
                    ['word' => '새', 'romanization' => 'сэ', 'meaning' => 'птица'],
                    ['word' => '배', 'romanization' => 'пэ', 'meaning' => 'груша / живот'],
                ],
            ],
            [
                'symbol' => 'ㅒ',
                'romanization' => 'йэ',
                'examples' => [
                    ['word' => '얘기', 'romanization' => 'йэги', 'meaning' => 'разговор'],
                    ['word' => '걔', 'romanization' => 'кйэ', 'meaning' => 'тот парень/девушка (разг.)'],
                    ['word' => '얘', 'romanization' => 'йэ', 'meaning' => 'этот ребёнок (разг.)'],
                    ['word' => '쟤', 'romanization' => 'чйэ', 'meaning' => 'тот ребёнок (разг.)'],
                ],
            ],
            [
                'symbol' => 'ㅔ',
                'romanization' => 'е',
                'examples' => [
                    ['word' => '네', 'romanization' => 'не', 'meaning' => 'да'],
                    ['word' => '세수', 'romanization' => 'сесу', 'meaning' => 'умывание'],
                    ['word' => '메뉴', 'romanization' => 'меню', 'meaning' => 'меню'],
                    ['word' => '데이터', 'romanization' => 'теитхо', 'meaning' => 'данные'],
                    ['word' => '게임', 'romanization' => 'кеим', 'meaning' => 'игра'],
                ],
            ],
            [
                'symbol' => 'ㅖ',
                'romanization' => 'йе',
                'examples' => [
                    ['word' => '예', 'romanization' => 'йе', 'meaning' => 'да (вежл.)'],
                    ['word' => '시계', 'romanization' => 'сигйе', 'meaning' => 'часы'],
                    ['word' => '예의', 'romanization' => 'йеи', 'meaning' => 'вежливость'],
                    ['word' => '폐', 'romanization' => 'пхйе', 'meaning' => 'лёгкие'],
                ],
            ],
            [
                'symbol' => 'ㅘ',
                'romanization' => 'ва',
                'examples' => [
                    ['word' => '과일', 'romanization' => 'кваиль', 'meaning' => 'фрукты'],
                    ['word' => '사과', 'romanization' => 'сагва', 'meaning' => 'яблоко'],
                    ['word' => '과자', 'romanization' => 'кваджа', 'meaning' => 'печенье'],
                    ['word' => '화', 'romanization' => 'хва', 'meaning' => 'гнев'],
                    ['word' => '좌', 'romanization' => 'чва', 'meaning' => 'левый'],
                ],
            ],
            [
                'symbol' => 'ㅙ',
                'romanization' => 'вэ',
                'examples' => [
                    ['word' => '왜', 'romanization' => 'вэ', 'meaning' => 'почему'],
                    ['word' => '괜찮다', 'romanization' => 'квэнчхантха', 'meaning' => 'быть в порядке'],
                    ['word' => '돼지', 'romanization' => 'твэджи', 'meaning' => 'свинья'],
                    ['word' => '쇄', 'romanization' => 'свэ', 'meaning' => 'замок'],
                ],
            ],
            [
                'symbol' => 'ㅚ',
                'romanization' => 'ве',
                'examples' => [
                    ['word' => '회사', 'romanization' => 'хвеса', 'meaning' => 'фирма, компания'],
                    ['word' => '회의', 'romanization' => 'хвеи', 'meaning' => 'совещание'],
                    ['word' => '쇠', 'romanization' => 'све', 'meaning' => 'железо'],
                    ['word' => '괴물', 'romanization' => 'квемуль', 'meaning' => 'монстр'],
                ],
            ],
            [
                'symbol' => 'ㅟ',
                'romanization' => 'ви',
                'examples' => [
                    ['word' => '귀', 'romanization' => 'кви', 'meaning' => 'ухо'],
                    ['word' => '위', 'romanization' => 'ви', 'meaning' => 'верх'],
                    ['word' => '쥐', 'romanization' => 'чви', 'meaning' => 'мышь'],
                    ['word' => '뒤', 'romanization' => 'тви', 'meaning' => 'сзади'],
                    ['word' => '취미', 'romanization' => 'чхвими', 'meaning' => 'хобби'],
                ],
            ],
            [
                'symbol' => 'ㅢ',
                'romanization' => 'ый',
                'examples' => [
                    ['word' => '의사', 'romanization' => 'ыйса', 'meaning' => 'врач'],
                    ['word' => '의자', 'romanization' => 'ыйджа', 'meaning' => 'стул'],
                    ['word' => '희망', 'romanization' => 'хыйман', 'meaning' => 'надежда'],
                    ['word' => '회의', 'romanization' => 'хвеи', 'meaning' => 'совещание'],
                ],
            ],
            [
                'symbol' => 'ㅝ',
                'romanization' => 'во',
                'examples' => [
                    ['word' => '원', 'romanization' => 'вон', 'meaning' => 'вона (валюта)'],
                    ['word' => '월요일', 'romanization' => 'вориль', 'meaning' => 'понедельник'],
                    ['word' => '권', 'romanization' => 'квон', 'meaning' => 'право, том'],
                    ['word' => '원숭이', 'romanization' => 'вонсуни', 'meaning' => 'обезьяна'],
                ],
            ],
            [
                'symbol' => 'ㅞ',
                'romanization' => 'ве',
                'examples' => [
                    ['word' => '웨이터', 'romanization' => 'веитхо', 'meaning' => 'официант'],
                    ['word' => '웨딩', 'romanization' => 'ведин', 'meaning' => 'свадьба'],
                    ['word' => '궤', 'romanization' => 'кве', 'meaning' => 'сундук'],
                    ['word' => '웨', 'romanization' => 'ве', 'meaning' => 'буква «ве»'],
                ],
            ],
        ];

        $this->seedCategory('vowel', $vowels);
        $this->seedCategory('diphthong', $diphthongs);
    }

    private function seedCategory(string $category, array $letters): void
    {
        $sortOrder = 0;

        foreach ($letters as $letter) {
            $sortOrder++;

            $model = AlphabetLetter::create([
                'symbol' => $letter['symbol'],
                'romanization' => $letter['romanization'],
                'category' => $category,
                'description' => null,
                'sort_order' => $sortOrder,
            ]);

            $exampleOrder = 0;
            foreach ($letter['examples'] as $example) {
                $exampleOrder++;
                $model->examples()->create([
                    'word' => $example['word'],
                    'romanization' => $example['romanization'] ?? null,
                    'meaning' => $example['meaning'],
                    'sort_order' => $exampleOrder,
                ]);
            }
        }
    }
}