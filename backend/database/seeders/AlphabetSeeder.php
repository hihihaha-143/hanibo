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
                'sound_ipa' => 'a',
                'sound_note' => 'Открытый звук «а», как в русском «мама».',
                'sample_syllable' => '아',
                'sample_romanization' => 'a',
                'family_symbols' => ['ㅏ', 'ㅑ', 'ㅐ', 'ㅒ'],
                'family_note' => 'Базовые «а»-гласные: ㅏ и ㅑ — одиночные, ㅐ и ㅒ — с добавленной чертой.',
                'confusion' => [
                    ['symbol' => 'ㅓ', 'hint' => 'Отличается направлением: ㅏ смотрит вправо, ㅓ — влево.'],
                    ['symbol' => 'ㅑ', 'hint' => 'У ㅑ две короткие черты, у ㅏ — одна.'],
                ],
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
                'sound_ipa' => 'ja',
                'sound_note' => '«Я» — «а» с коротким «й» впереди.',
                'sample_syllable' => '야',
                'sample_romanization' => 'ya',
                'family_symbols' => ['ㅏ', 'ㅑ', 'ㅐ', 'ㅒ'],
                'family_note' => 'Вариант ㅏ с дополнительной чертой — добавляет «й» в начало.',
                'confusion' => [
                    ['symbol' => 'ㅏ', 'hint' => 'У ㅑ две короткие черты, у ㅏ — одна.'],
                    ['symbol' => 'ㅕ', 'hint' => 'ㅑ смотрит вправо, ㅕ — влево.'],
                ],
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
                'sound_ipa' => 'ʌ',
                'sound_note' => 'Звук между «о» и «а»: губы не округляются, язык оттянут назад. Русского точного аналога нет.',
                'sample_syllable' => '어',
                'sample_romanization' => 'eo',
                'family_symbols' => ['ㅓ', 'ㅕ'],
                'family_note' => 'ㅓ и ㅕ — пара, различаются дополнительной чертой (добавляет «й»).',
                'confusion' => [
                    ['symbol' => 'ㅏ', 'hint' => 'ㅏ смотрит вправо, ㅓ — влево.'],
                    ['symbol' => 'ㅗ', 'hint' => 'ㅗ — округлённое «о» вверх, ㅓ — неогублённое влево.'],
                ],
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
                'sound_ipa' => 'jʌ',
                'sound_note' => 'Тот же звук, что ㅓ, но с «й» впереди.',
                'sample_syllable' => '여',
                'sample_romanization' => 'yeo',
                'family_symbols' => ['ㅓ', 'ㅕ'],
                'family_note' => 'Пара к ㅓ, дополнительная черта добавляет «й».',
                'confusion' => [
                    ['symbol' => 'ㅑ', 'hint' => 'ㅕ смотрит влево, ㅑ — вправо.'],
                    ['symbol' => 'ㅓ', 'hint' => 'Различие — дополнительная черта (звук «й»).'],
                ],
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
                'sound_ipa' => 'o',
                'sound_note' => 'Округлённое «о», губы вытянуты вперёд, как в русском «он».',
                'sample_syllable' => '오',
                'sample_romanization' => 'o',
                'family_symbols' => ['ㅗ', 'ㅛ'],
                'family_note' => 'ㅗ и ㅛ — пара: ㅛ добавляет «й».',
                'confusion' => [
                    ['symbol' => 'ㅜ', 'hint' => 'ㅗ смотрит вверх, ㅜ — вниз.'],
                    ['symbol' => 'ㅓ', 'hint' => 'ㅗ округлённое, ㅓ — нет.'],
                ],
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
                'sound_ipa' => 'jo',
                'sound_note' => '«Ё»: округлённое «о» с «й» впереди.',
                'sample_syllable' => '요',
                'sample_romanization' => 'yo',
                'family_symbols' => ['ㅗ', 'ㅛ'],
                'family_note' => 'Пара к ㅗ, дополнительная черта добавляет «й».',
                'confusion' => [
                    ['symbol' => 'ㅠ', 'hint' => 'ㅛ смотрит вверх, ㅠ — вниз.'],
                    ['symbol' => 'ㅕ', 'hint' => 'ㅛ — округлённое «ё», ㅕ — неогублённое «йоэ».'],
                ],
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
                'sound_ipa' => 'u',
                'sound_note' => '«У», губы сильно округлены, как в русском «утка».',
                'sample_syllable' => '우',
                'sample_romanization' => 'u',
                'family_symbols' => ['ㅜ', 'ㅠ'],
                'family_note' => 'ㅜ и ㅠ — пара: ㅠ добавляет «й».',
                'confusion' => [
                    ['symbol' => 'ㅗ', 'hint' => 'ㅜ смотрит вниз, ㅗ — вверх.'],
                    ['symbol' => 'ㅡ', 'hint' => 'ㅜ округлённое, ㅡ — нет (губы растянуты).'],
                ],
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
                'sound_ipa' => 'ju',
                'sound_note' => '«Ю»: «у» с «й» впереди.',
                'sample_syllable' => '유',
                'sample_romanization' => 'yu',
                'family_symbols' => ['ㅜ', 'ㅠ'],
                'family_note' => 'Пара к ㅜ, дополнительная черта добавляет «й».',
                'confusion' => [
                    ['symbol' => 'ㅛ', 'hint' => 'ㅠ смотрит вниз, ㅛ — вверх.'],
                    ['symbol' => 'ㅜ', 'hint' => 'Различие — дополнительная черта (звук «й»).'],
                ],
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
                'sound_ipa' => 'ɯ',
                'sound_note' => 'Звук между «ы» и «у»: губы не округлены, язык оттянут назад. Похож на русское «ы» после согласных.',
                'sample_syllable' => '으',
                'sample_romanization' => 'eu',
                'family_symbols' => ['ㅡ', 'ㅢ'],
                'family_note' => 'ㅡ — базовая; ㅢ — сочетание с ㅣ, читается по-разному в зависимости от позиции.',
                'confusion' => [
                    ['symbol' => 'ㅜ', 'hint' => 'ㅡ — губы растянуты, ㅜ — округлены.'],
                    ['symbol' => 'ㅣ', 'hint' => 'ㅡ — горизонтальная черта, ㅣ — вертикальная.'],
                ],
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
                'sound_ipa' => 'i',
                'sound_note' => '«И», как в русском «и».',
                'sample_syllable' => '이',
                'sample_romanization' => 'i',
                'family_symbols' => ['ㅣ', 'ㅐ', 'ㅔ', 'ㅚ', 'ㅟ', 'ㅢ'],
                'family_note' => 'ㅣ — основа многих дифтонгов: добавляется к другим гласным.',
                'confusion' => [
                    ['symbol' => 'ㅡ', 'hint' => 'ㅣ — вертикальная черта, ㅡ — горизонтальная.'],
                    ['symbol' => 'ㅐ', 'hint' => 'ㅐ — это ㅏ + ㅣ, а не просто ㅣ с чертой.'],
                ],
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
                'sound_ipa' => 'ɛ',
                'sound_note' => 'Открытый «э», как в русском «это». В современном языке почти сливается с ㅔ.',
                'sample_syllable' => '애',
                'sample_romanization' => 'ae',
                'family_symbols' => ['ㅏ', 'ㅐ', 'ㅒ'],
                'family_note' => 'ㅐ = ㅏ + ㅣ. ㅒ — та же пара с «й».',
                'confusion' => [
                    ['symbol' => 'ㅔ', 'hint' => 'В современном произношении ㅐ и ㅔ почти неразличимы — на письме различай по контексту.'],
                    ['symbol' => 'ㅒ', 'hint' => 'ㅐ начинается с «а», ㅒ — с «йа».'],
                ],
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
                'sound_ipa' => 'jɛ',
                'sound_note' => '«Йэ» — как ㅐ, но с «й» впереди. Встречается редко.',
                'sample_syllable' => '얘',
                'sample_romanization' => 'yae',
                'family_symbols' => ['ㅑ', 'ㅒ', 'ㅐ'],
                'family_note' => 'ㅒ = ㅑ + ㅣ.',
                'confusion' => [
                    ['symbol' => 'ㅐ', 'hint' => 'ㅒ добавляет «й» в начало.'],
                    ['symbol' => 'ㅖ', 'hint' => 'ㅒ основан на «а», ㅖ — на «о/э».'],
                ],
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
                'sound_ipa' => 'e',
                'sound_note' => 'Закрытый «э», чуть более узкий, чем ㅐ. В речи часто совпадает с ㅐ.',
                'sample_syllable' => '에',
                'sample_romanization' => 'e',
                'family_symbols' => ['ㅓ', 'ㅔ', 'ㅖ'],
                'family_note' => 'ㅔ = ㅓ + ㅣ.',
                'confusion' => [
                    ['symbol' => 'ㅐ', 'hint' => 'На письме различай, в речи почти одинаково.'],
                    ['symbol' => 'ㅖ', 'hint' => 'ㅖ добавляет «й» в начало.'],
                ],
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
                'sound_ipa' => 'je',
                'sound_note' => '«Йе» — ㅔ с «й» впереди.',
                'sample_syllable' => '예',
                'sample_romanization' => 'ye',
                'family_symbols' => ['ㅕ', 'ㅖ', 'ㅔ'],
                'family_note' => 'ㅖ = ㅕ + ㅣ.',
                'confusion' => [
                    ['symbol' => 'ㅒ', 'hint' => 'ㅖ основан на ㅕ/ㅔ, ㅒ — на ㅑ/ㅐ.'],
                    ['symbol' => 'ㅔ', 'hint' => 'ㅖ добавляет «й».'],
                ],
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
                'sound_ipa' => 'wa',
                'sound_note' => '«Ва» — быстрое скольжение от «у» к «а».',
                'sample_syllable' => '와',
                'sample_romanization' => 'wa',
                'family_symbols' => ['ㅗ', 'ㅘ', 'ㅙ', 'ㅚ'],
                'family_note' => 'ㅘ = ㅗ + ㅏ. Родственники: ㅙ, ㅚ.',
                'confusion' => [
                    ['symbol' => 'ㅙ', 'hint' => 'ㅘ заканчивается на «а», ㅙ — на «э».'],
                    ['symbol' => 'ㅝ', 'hint' => 'ㅘ начинается с «уа», ㅝ — с «уо».'],
                ],
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
                'sound_ipa' => 'wɛ',
                'sound_note' => '«Вэ» — скольжение от «у» к «э».',
                'sample_syllable' => '왜',
                'sample_romanization' => 'wae',
                'family_symbols' => ['ㅗ', 'ㅘ', 'ㅙ', 'ㅚ'],
                'family_note' => 'ㅙ = ㅗ + ㅐ.',
                'confusion' => [
                    ['symbol' => 'ㅘ', 'hint' => 'ㅙ заканчивается на «э», ㅘ — на «а».'],
                    ['symbol' => 'ㅚ', 'hint' => 'ㅙ — «вэ», ㅚ — «ве/вэ»; в речи часто совпадают.'],
                ],
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
                'sound_ipa' => 'we',
                'sound_note' => '«Ве/вэ» — скольжение от «у» к «э». В современном языке часто произносится как простой «э».',
                'sample_syllable' => '외',
                'sample_romanization' => 'oe',
                'family_symbols' => ['ㅗ', 'ㅘ', 'ㅙ', 'ㅚ'],
                'family_note' => 'ㅚ = ㅗ + ㅣ.',
                'confusion' => [
                    ['symbol' => 'ㅙ', 'hint' => 'В речи почти совпадают, на письме различай.'],
                    ['symbol' => 'ㅟ', 'hint' => 'ㅚ — на «э/е», ㅟ — на «и».'],
                ],
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
                'sound_ipa' => 'wi',
                'sound_note' => '«Ви» — скольжение от «у» к «и».',
                'sample_syllable' => '위',
                'sample_romanization' => 'wi',
                'family_symbols' => ['ㅜ', 'ㅝ', 'ㅞ', 'ㅟ'],
                'family_note' => 'ㅟ = ㅜ + ㅣ.',
                'confusion' => [
                    ['symbol' => 'ㅚ', 'hint' => 'ㅟ — на «и», ㅚ — на «э/е».'],
                    ['symbol' => 'ㅞ', 'hint' => 'ㅟ — «ви», ㅞ — «ве».'],
                ],
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
                'sound_ipa' => 'ɰi',
                'sound_note' => '«Ый» — ㅡ + ㅣ. В начале слова — «ый», после согласного часто «и».',
                'sample_syllable' => '의',
                'sample_romanization' => 'ui',
                'family_symbols' => ['ㅡ', 'ㅢ', 'ㅣ'],
                'family_note' => 'ㅢ = ㅡ + ㅣ.',
                'confusion' => [
                    ['symbol' => 'ㅟ', 'hint' => 'ㅢ начинается с «ы», ㅟ — с «у».'],
                    ['symbol' => 'ㅣ', 'hint' => 'ㅢ — двухгласный, ㅣ — один звук.'],
                ],
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
                'sound_ipa' => 'wʌ',
                'sound_note' => '«Во» — скольжение от «у» к ㅓ (неогублённое «о»).',
                'sample_syllable' => '워',
                'sample_romanization' => 'wo',
                'family_symbols' => ['ㅜ', 'ㅝ', 'ㅞ', 'ㅟ'],
                'family_note' => 'ㅝ = ㅜ + ㅓ.',
                'confusion' => [
                    ['symbol' => 'ㅘ', 'hint' => 'ㅝ — на ㅓ, ㅘ — на ㅏ.'],
                    ['symbol' => 'ㅞ', 'hint' => 'ㅝ — «во», ㅞ — «ве».'],
                ],
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
                'sound_ipa' => 'we',
                'sound_note' => '«Ве» — скольжение от «у» к «э».',
                'sample_syllable' => '웨',
                'sample_romanization' => 'we',
                'family_symbols' => ['ㅜ', 'ㅝ', 'ㅞ', 'ㅟ'],
                'family_note' => 'ㅞ = ㅜ + ㅔ.',
                'confusion' => [
                    ['symbol' => 'ㅚ', 'hint' => 'В речи часто совпадают, на письме различай.'],
                    ['symbol' => 'ㅙ', 'hint' => 'ㅞ и ㅙ звучат почти одинаково.'],
                ],
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
                'sound_ipa' => $letter['sound_ipa'],
                'sound_note' => $letter['sound_note'],
                'sample_syllable' => $letter['sample_syllable'],
                'sample_romanization' => $letter['sample_romanization'],
                'family_symbols' => $letter['family_symbols'],
                'family_note' => $letter['family_note'],
                'confusion' => $letter['confusion'],
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