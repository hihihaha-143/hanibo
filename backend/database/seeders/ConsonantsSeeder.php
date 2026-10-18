<?php

namespace Database\Seeders;

use App\Models\AlphabetLetter;
use Illuminate\Database\Seeder;

class ConsonantsSeeder extends Seeder
{
    public function run(): void
    {
        $consonants = [
            [
                'symbol' => 'ㄱ',
                'romanization' => 'к/г',
                'sound_ipa' => 'k',
                'sound_note' => 'В начале слова — «к» с лёгким придыханием. Между гласными — звонкий «г»: 가 «ка», но 아가 «ага».',
                'sample_syllable' => '가',
                'sample_romanization' => 'ga',
                'family_symbols' => ['ㄱ', 'ㄲ', 'ㅋ'],
                'family_note' => 'ㄱ — базовая, ㄲ — напряжённая, ㅋ — придыхательная. Все три — «к»-семейство.',
                'confusion' => [
                    ['symbol' => 'ㄴ', 'hint' => 'Похожа по форме, но горизонталь идёт в другую сторону — «н».'],
                    ['symbol' => 'ㅋ', 'hint' => 'Та же основа, но с дополнительной чертой сверху — «к» с придыханием.'],
                ],
                'examples' => [
                    ['word' => '가다', 'romanization' => 'када', 'meaning' => 'идти'],
                    ['word' => '고기', 'romanization' => 'коги', 'meaning' => 'мясо'],
                    ['word' => '구두', 'romanization' => 'куду', 'meaning' => 'туфли'],
                    ['word' => '가방', 'romanization' => 'кабан', 'meaning' => 'сумка'],
                ],
            ],
            [
                'symbol' => 'ㄴ',
                'romanization' => 'н',
                'sound_ipa' => 'n',
                'sound_note' => '«Н», как в русском «нос».',
                'sample_syllable' => '나',
                'sample_romanization' => 'na',
                'family_symbols' => ['ㄴ', 'ㄷ', 'ㄹ'],
                'family_note' => 'ㄴ, ㄷ, ㄹ — «альвеолярные»: язык у верхних зубов.',
                'confusion' => [
                    ['symbol' => 'ㄱ', 'hint' => 'ㄴ — угол вправо-вниз, ㄱ — вправо-вверх.'],
                    ['symbol' => 'ㄷ', 'hint' => 'ㄷ — с горизонтальной линией сверху, ㄴ — без неё.'],
                ],
                'examples' => [
                    ['word' => '나', 'romanization' => 'на', 'meaning' => 'я'],
                    ['word' => '나무', 'romanization' => 'наму', 'meaning' => 'дерево'],
                    ['word' => '눈', 'romanization' => 'нун', 'meaning' => 'глаз / снег'],
                    ['word' => '노래', 'romanization' => 'норэ', 'meaning' => 'песня'],
                    ['word' => '나라', 'romanization' => 'нара', 'meaning' => 'страна'],
                ],
            ],
            [
                'symbol' => 'ㄷ',
                'romanization' => 'т/д',
                'sound_ipa' => 't',
                'sound_note' => 'В начале — «т», между гласными — «д»: 다 «та», но 사다 «сада».',
                'sample_syllable' => '다',
                'sample_romanization' => 'da',
                'family_symbols' => ['ㄷ', 'ㄸ', 'ㅌ'],
                'family_note' => 'ㄷ — базовая, ㄸ — напряжённая, ㅌ — придыхательная.',
                'confusion' => [
                    ['symbol' => 'ㄴ', 'hint' => 'ㄷ — с верхней чертой, ㄴ — без.'],
                    ['symbol' => 'ㅌ', 'hint' => 'ㅌ — ㄷ с дополнительной чертой (придыхание).'],
                ],
                'examples' => [
                    ['word' => '다리', 'romanization' => 'тари', 'meaning' => 'нога / мост'],
                    ['word' => '도시', 'romanization' => 'тоси', 'meaning' => 'город'],
                    ['word' => '두부', 'romanization' => 'тубу', 'meaning' => 'тофу'],
                    ['word' => '돈', 'romanization' => 'тон', 'meaning' => 'деньги'],
                ],
            ],
            [
                'symbol' => 'ㄹ',
                'romanization' => 'р/ль',
                'sound_ipa' => 'ɾ',
                'sound_note' => 'Одноударный «р» между гласными, «ль» в конце слога: 라 «ра», 물 «муль».',
                'sample_syllable' => '라',
                'sample_romanization' => 'ra',
                'family_symbols' => ['ㄴ', 'ㄷ', 'ㄹ'],
                'family_note' => 'ㄹ — «плавный», единственный в корейском с таким звучанием.',
                'confusion' => [
                    ['symbol' => 'ㄴ', 'hint' => 'ㄹ — изогнутая, ㄴ — угловатая.'],
                    ['symbol' => 'ㅁ', 'hint' => 'Формы разные, звуки разные: «р/ль» vs «м».'],
                ],
                'examples' => [
                    ['word' => '라면', 'romanization' => 'рамён', 'meaning' => 'лапша рамен'],
                    ['word' => '사람', 'romanization' => 'сарам', 'meaning' => 'человек'],
                    ['word' => '머리', 'romanization' => 'мори', 'meaning' => 'голова'],
                    ['word' => '물', 'romanization' => 'муль', 'meaning' => 'вода'],
                    ['word' => '하늘', 'romanization' => 'ханыль', 'meaning' => 'небо'],
                ],
            ],
            [
                'symbol' => 'ㅁ',
                'romanization' => 'м',
                'sound_ipa' => 'm',
                'sound_note' => '«М», как в русском «мама».',
                'sample_syllable' => '마',
                'sample_romanization' => 'ma',
                'family_symbols' => ['ㅁ', 'ㅂ', 'ㅍ'],
                'family_note' => 'ㅁ, ㅂ, ㅍ — губные: звук образуется губами.',
                'confusion' => [
                    ['symbol' => 'ㅂ', 'hint' => 'ㅁ — квадрат, ㅂ — с «рожками» по бокам.'],
                    ['symbol' => 'ㄹ', 'hint' => 'Формы разные, звуки разные.'],
                ],
                'examples' => [
                    ['word' => '머리', 'romanization' => 'мори', 'meaning' => 'голова'],
                    ['word' => '물', 'romanization' => 'муль', 'meaning' => 'вода'],
                    ['word' => '모자', 'romanization' => 'моджа', 'meaning' => 'шапка'],
                    ['word' => '마음', 'romanization' => 'маым', 'meaning' => 'душа, сердце'],
                    ['word' => '문', 'romanization' => 'мун', 'meaning' => 'дверь'],
                ],
            ],
            [
                'symbol' => 'ㅂ',
                'romanization' => 'п/б',
                'sound_ipa' => 'p',
                'sound_note' => 'В начале — «п», между гласными — «б»: 바 «па», но 아바 «аба».',
                'sample_syllable' => '바',
                'sample_romanization' => 'ba',
                'family_symbols' => ['ㅁ', 'ㅂ', 'ㅍ', 'ㅃ'],
                'family_note' => 'ㅂ — базовая, ㅃ — напряжённая, ㅍ — придыхательная.',
                'confusion' => [
                    ['symbol' => 'ㅁ', 'hint' => 'ㅂ — с «рожками», ㅁ — квадрат.'],
                    ['symbol' => 'ㅍ', 'hint' => 'ㅍ — ㅂ с дополнительной чертой (придыхание).'],
                ],
                'examples' => [
                    ['word' => '바다', 'romanization' => 'пада', 'meaning' => 'море'],
                    ['word' => '버스', 'romanization' => 'посу', 'meaning' => 'автобус'],
                    ['word' => '밥', 'romanization' => 'пап', 'meaning' => 'варёный рис / еда'],
                    ['word' => '비', 'romanization' => 'пи', 'meaning' => 'дождь'],
                    ['word' => '배', 'romanization' => 'пэ', 'meaning' => 'груша / живот'],
                ],
            ],
            [
                'symbol' => 'ㅅ',
                'romanization' => 'с/ш',
                'sound_ipa' => 's',
                'sound_note' => '«С»; перед «и» и дифтонгами на «й» — ближе к «щ/ш»: 시 «щи/си».',
                'sample_syllable' => '사',
                'sample_romanization' => 'sa',
                'family_symbols' => ['ㅅ', 'ㅆ', 'ㅈ', 'ㅊ', 'ㅉ'],
                'family_note' => 'ㅅ — базовая, ㅆ — напряжённая; ㅈ/ㅊ/ㅉ — свистяще-шипящие.',
                'confusion' => [
                    ['symbol' => 'ㅆ', 'hint' => 'ㅆ — двойная ㅅ, произносится напряжённее.'],
                    ['symbol' => 'ㅈ', 'hint' => 'ㅈ — с чертой сверху.'],
                ],
                'examples' => [
                    ['word' => '사람', 'romanization' => 'сарам', 'meaning' => 'человек'],
                    ['word' => '사과', 'romanization' => 'сагва', 'meaning' => 'яблоко'],
                    ['word' => '산', 'romanization' => 'сан', 'meaning' => 'гора'],
                    ['word' => '소', 'romanization' => 'со', 'meaning' => 'корова'],
                    ['word' => '손', 'romanization' => 'сон', 'meaning' => 'рука'],
                ],
            ],
            [
                'symbol' => 'ㅇ',
                'romanization' => 'ноль / н',
                'sound_ipa' => 'ŋ',
                'sound_note' => 'В начале слога не читается (нулевая согласная), в конце — «н» (носовой): 아이 «аи», 강 «кан».',
                'sample_syllable' => '아',
                'sample_romanization' => 'a',
                'family_symbols' => ['ㅇ', 'ㅎ'],
                'family_note' => 'ㅇ — «пустая» согласная; ㅎ — с чертой сверху.',
                'confusion' => [
                    ['symbol' => 'ㅎ', 'hint' => 'ㅎ — с двумя чертами сверху (звук «х»).'],
                    ['symbol' => 'ㅁ', 'hint' => 'ㅇ — круг, ㅁ — квадрат.'],
                ],
                'examples' => [
                    ['word' => '아이', 'romanization' => 'аи', 'meaning' => 'ребёнок'],
                    ['word' => '오이', 'romanization' => 'ои', 'meaning' => 'огурец'],
                    ['word' => '우유', 'romanization' => 'ую', 'meaning' => 'молоко'],
                    ['word' => '이름', 'romanization' => 'ирым', 'meaning' => 'имя'],
                    ['word' => '강', 'romanization' => 'кан', 'meaning' => 'река'],
                ],
            ],
            [
                'symbol' => 'ㅈ',
                'romanization' => 'ч/дж',
                'sound_ipa' => 'tɕ',
                'sound_note' => 'В начале — «ч» с лёгким придыханием, между гласными — «дж»: 자 «ча», но 아자 «аджа».',
                'sample_syllable' => '자',
                'sample_romanization' => 'ja',
                'family_symbols' => ['ㅅ', 'ㅈ', 'ㅊ', 'ㅉ'],
                'family_note' => 'ㅈ — базовая, ㅉ — напряжённая, ㅊ — придыхательная.',
                'confusion' => [
                    ['symbol' => 'ㅊ', 'hint' => 'ㅊ — с дополнительной чертой (придыхание).'],
                    ['symbol' => 'ㅅ', 'hint' => 'ㅈ — с чертой сверху, ㅅ — без.'],
                ],
                'examples' => [
                    ['word' => '자', 'romanization' => 'ча', 'meaning' => 'я (вежл.)'],
                    ['word' => '지갑', 'romanization' => 'чигап', 'meaning' => 'кошелёк'],
                    ['word' => '조금', 'romanization' => 'чогым', 'meaning' => 'немного'],
                    ['word' => '종이', 'romanization' => 'чони', 'meaning' => 'бумага'],
                ],
            ],
            [
                'symbol' => 'ㅊ',
                'romanization' => 'чх',
                'sound_ipa' => 'tɕʰ',
                'sound_note' => '«Чх» — «ч» с отчётливым выдохом.',
                'sample_syllable' => '차',
                'sample_romanization' => 'cha',
                'family_symbols' => ['ㅈ', 'ㅊ', 'ㅉ'],
                'family_note' => 'ㅊ — придыхательная пара к ㅈ.',
                'confusion' => [
                    ['symbol' => 'ㅈ', 'hint' => 'ㅊ — с дополнительной чертой.'],
                    ['symbol' => 'ㅌ', 'hint' => 'Формы разные: ㅊ — «чх», ㅌ — «тх».'],
                ],
                'examples' => [
                    ['word' => '차', 'romanization' => 'чха', 'meaning' => 'чай / машина'],
                    ['word' => '책', 'romanization' => 'чхэк', 'meaning' => 'книга'],
                    ['word' => '친구', 'romanization' => 'чхингу', 'meaning' => 'друг'],
                    ['word' => '초', 'romanization' => 'чхо', 'meaning' => 'свеча / уксус'],
                ],
            ],
            [
                'symbol' => 'ㅋ',
                'romanization' => 'кх',
                'sound_ipa' => 'kʰ',
                'sound_note' => '«Кх» — «к» с отчётливым выдохом.',
                'sample_syllable' => '카',
                'sample_romanization' => 'ka',
                'family_symbols' => ['ㄱ', 'ㄲ', 'ㅋ'],
                'family_note' => 'ㅋ — придыхательная пара к ㄱ.',
                'confusion' => [
                    ['symbol' => 'ㄱ', 'hint' => 'ㅋ — ㄱ с дополнительной чертой.'],
                    ['symbol' => 'ㅌ', 'hint' => 'Формы разные: ㅋ — «кх», ㅌ — «тх».'],
                ],
                'examples' => [
                    ['word' => '코', 'romanization' => 'кхо', 'meaning' => 'нос'],
                    ['word' => '커피', 'romanization' => 'кхопхи', 'meaning' => 'кофе'],
                    ['word' => '크다', 'romanization' => 'кхыда', 'meaning' => 'быть большим'],
                    ['word' => '키', 'romanization' => 'кхи', 'meaning' => 'рост / ключ'],
                ],
            ],
            [
                'symbol' => 'ㅌ',
                'romanization' => 'тх',
                'sound_ipa' => 'tʰ',
                'sound_note' => '«Тх» — «т» с отчётливым выдохом.',
                'sample_syllable' => '타',
                'sample_romanization' => 'ta',
                'family_symbols' => ['ㄷ', 'ㄸ', 'ㅌ'],
                'family_note' => 'ㅌ — придыхательная пара к ㄷ.',
                'confusion' => [
                    ['symbol' => 'ㄷ', 'hint' => 'ㅌ — ㄷ с дополнительной чертой.'],
                    ['symbol' => 'ㅊ', 'hint' => 'Формы разные: ㅌ — «тх», ㅊ — «чх».'],
                ],
                'examples' => [
                    ['word' => '토끼', 'romanization' => 'тхокки', 'meaning' => 'кролик'],
                    ['word' => '투', 'romanization' => 'тху', 'meaning' => 'буква «тху»'],
                    ['word' => '타다', 'romanization' => 'тхада', 'meaning' => 'ехать / сгорать'],
                    ['word' => '특히', 'romanization' => 'тхыкхи', 'meaning' => 'особенно'],
                ],
            ],
            [
                'symbol' => 'ㅍ',
                'romanization' => 'пх',
                'sound_ipa' => 'pʰ',
                'sound_note' => '«Пх» — «п» с отчётливым выдохом.',
                'sample_syllable' => '파',
                'sample_romanization' => 'pa',
                'family_symbols' => ['ㅁ', 'ㅂ', 'ㅍ', 'ㅃ'],
                'family_note' => 'ㅍ — придыхательная пара к ㅂ.',
                'confusion' => [
                    ['symbol' => 'ㅂ', 'hint' => 'ㅍ — ㅂ с дополнительной чертой.'],
                    ['symbol' => 'ㅁ', 'hint' => 'Формы разные: ㅍ — «пх», ㅁ — «м».'],
                ],
                'examples' => [
                    ['word' => '피', 'romanization' => 'пхи', 'meaning' => 'кровь'],
                    ['word' => '피자', 'romanization' => 'пхиджа', 'meaning' => 'пицца'],
                    ['word' => '파', 'romanization' => 'пха', 'meaning' => 'зелёный лук'],
                    ['word' => '포도', 'romanization' => 'пходо', 'meaning' => 'виноград'],
                ],
            ],
            [
                'symbol' => 'ㅎ',
                'romanization' => 'х',
                'sound_ipa' => 'h',
                'sound_note' => '«Х», как в русском «хор». Между гласными часто ослабляется.',
                'sample_syllable' => '하',
                'sample_romanization' => 'ha',
                'family_symbols' => ['ㅇ', 'ㅎ'],
                'family_note' => 'ㅎ — гортанный, связан с нулевой ㅇ.',
                'confusion' => [
                    ['symbol' => 'ㅇ', 'hint' => 'ㅎ — с чертами сверху, ㅇ — пустой круг.'],
                    ['symbol' => 'ㄱ', 'hint' => 'Формы разные: ㅎ — «х», ㄱ — «к/г».'],
                ],
                'examples' => [
                    ['word' => '하늘', 'romanization' => 'ханыль', 'meaning' => 'небо'],
                    ['word' => '학교', 'romanization' => 'хаккё', 'meaning' => 'школа'],
                    ['word' => '한국', 'romanization' => 'хангук', 'meaning' => 'Корея'],
                    ['word' => '하나', 'romanization' => 'хана', 'meaning' => 'один'],
                ],
            ],
            [
                'symbol' => 'ㄲ',
                'romanization' => 'кк',
                'sound_ipa' => 'k͈',
                'sound_note' => 'Напряжённая «к»: произносится с усилием, без придыхания. Не «кх»!',
                'sample_syllable' => '까',
                'sample_romanization' => 'kka',
                'family_symbols' => ['ㄱ', 'ㄲ', 'ㅋ'],
                'family_note' => 'ㄲ — двойная ㄱ, напряжённая.',
                'confusion' => [
                    ['symbol' => 'ㄱ', 'hint' => 'ㄲ — удвоенная ㄱ.'],
                    ['symbol' => 'ㅋ', 'hint' => 'ㄲ — без выдоха, ㅋ — с выдохом.'],
                ],
                'examples' => [
                    ['word' => '꽃', 'romanization' => 'ккот', 'meaning' => 'цветок'],
                    ['word' => '까치', 'romanization' => 'ккачхи', 'meaning' => 'сорока'],
                    ['word' => '꿀', 'romanization' => 'ккуль', 'meaning' => 'мёд'],
                    ['word' => '끝', 'romanization' => 'ккыт', 'meaning' => 'конец'],
                ],
            ],
            [
                'symbol' => 'ㄸ',
                'romanization' => 'тт',
                'sound_ipa' => 't͈',
                'sound_note' => 'Напряжённая «т», без придыхания.',
                'sample_syllable' => '따',
                'sample_romanization' => 'tta',
                'family_symbols' => ['ㄷ', 'ㄸ', 'ㅌ'],
                'family_note' => 'ㄸ — двойная ㄷ, напряжённая.',
                'confusion' => [
                    ['symbol' => 'ㄷ', 'hint' => 'ㄸ — удвоенная ㄷ.'],
                    ['symbol' => 'ㅌ', 'hint' => 'ㄸ — без выдоха, ㅌ — с выдохом.'],
                ],
                'examples' => [
                    ['word' => '딸', 'romanization' => 'тталь', 'meaning' => 'дочь'],
                    ['word' => '떡', 'romanization' => 'тток', 'meaning' => 'ток (рисовые пирожки)'],
                    ['word' => '땅', 'romanization' => 'ттан', 'meaning' => 'земля'],
                    ['word' => '따뜻하다', 'romanization' => 'ттаттытхада', 'meaning' => 'быть тёплым'],
                ],
            ],
            [
                'symbol' => 'ㅃ',
                'romanization' => 'пп',
                'sound_ipa' => 'p͈',
                'sound_note' => 'Напряжённая «п», без придыхания.',
                'sample_syllable' => '빠',
                'sample_romanization' => 'ppa',
                'family_symbols' => ['ㅂ', 'ㅃ', 'ㅍ'],
                'family_note' => 'ㅃ — двойная ㅂ, напряжённая.',
                'confusion' => [
                    ['symbol' => 'ㅂ', 'hint' => 'ㅃ — удвоенная ㅂ.'],
                    ['symbol' => 'ㅍ', 'hint' => 'ㅃ — без выдоха, ㅍ — с выдохом.'],
                ],
                'examples' => [
                    ['word' => '빵', 'romanization' => 'ппан', 'meaning' => 'хлеб'],
                    ['word' => '뼈', 'romanization' => 'ппё', 'meaning' => 'кость'],
                    ['word' => '뿌리', 'romanization' => 'ппури', 'meaning' => 'корень'],
                    ['word' => '빨리', 'romanization' => 'ппалли', 'meaning' => 'быстро'],
                ],
            ],
            [
                'symbol' => 'ㅆ',
                'romanization' => 'сс',
                'sound_ipa' => 's͈',
                'sound_note' => 'Напряжённая «с», без придыхания.',
                'sample_syllable' => '싸',
                'sample_romanization' => 'ssa',
                'family_symbols' => ['ㅅ', 'ㅆ', 'ㅉ'],
                'family_note' => 'ㅆ — двойная ㅅ, напряжённая.',
                'confusion' => [
                    ['symbol' => 'ㅅ', 'hint' => 'ㅆ — удвоенная ㅅ.'],
                    ['symbol' => 'ㅉ', 'hint' => 'ㅆ — «сс», ㅉ — «чч».'],
                ],
                'examples' => [
                    ['word' => '쌀', 'romanization' => 'ссаль', 'meaning' => 'сырой рис'],
                    ['word' => '쓰다', 'romanization' => 'ссыда', 'meaning' => 'писать / горький'],
                    ['word' => '씨', 'romanization' => 'сси', 'meaning' => 'семя'],
                    ['word' => '싸다', 'romanization' => 'ссада', 'meaning' => 'быть дешёвым'],
                ],
            ],
            [
                'symbol' => 'ㅉ',
                'romanization' => 'чч',
                'sound_ipa' => 'tɕ͈',
                'sound_note' => 'Напряжённая «ч», без придыхания.',
                'sample_syllable' => '짜',
                'sample_romanization' => 'jja',
                'family_symbols' => ['ㅈ', 'ㅉ', 'ㅊ'],
                'family_note' => 'ㅉ — двойная ㅈ, напряжённая.',
                'confusion' => [
                    ['symbol' => 'ㅈ', 'hint' => 'ㅉ — удвоенная ㅈ.'],
                    ['symbol' => 'ㅊ', 'hint' => 'ㅉ — без выдоха, ㅊ — с выдохом.'],
                ],
                'examples' => [
                    ['word' => '짜다', 'romanization' => 'ччада', 'meaning' => 'быть солёным'],
                    ['word' => '쪽', 'romanization' => 'ччок', 'meaning' => 'сторона'],
                    ['word' => '찌개', 'romanization' => 'ччигэ', 'meaning' => 'тушёное блюдо'],
                    ['word' => '짧다', 'romanization' => 'ччальпта', 'meaning' => 'быть коротким'],
                ],
            ],
        ];

        $sortOrder = 0;

        foreach ($consonants as $letter) {
            $sortOrder++;

            $model = AlphabetLetter::create([
                'symbol' => $letter['symbol'],
                'romanization' => $letter['romanization'],
                'category' => 'consonant',
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