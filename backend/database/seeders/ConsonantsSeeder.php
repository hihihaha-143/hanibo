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