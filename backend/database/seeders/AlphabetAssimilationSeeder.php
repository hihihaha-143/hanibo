<?php

namespace Database\Seeders;

use App\Models\AlphabetLetter;
use Illuminate\Database\Seeder;

class AlphabetAssimilationSeeder extends Seeder
{
    public function run(): void
    {
        $rules = [
            [
                'symbol' => '한국말',
                'romanization' => '한궁말',
                'description' => 'Назализация: ㄱ, ㄷ, ㅂ перед ㄴ, ㅁ читаются как ㅇ, ㄴ, ㅁ.',
                'sound_ipa' => 'ha̠nɡuŋma̠ɭ',
                'sound_note' => 'ㄱ в конце слога 한국 перед ㄴ в 말 превращается в ㅇ: [한궁말].',
                'sample_syllable' => '한국말',
                'sample_romanization' => '한궁말',
                'family_symbols' => ['ㄱ', 'ㄴ', 'ㅁ', 'ㅇ'],
                'family_note' => 'Правило назализации касается пар ㄱ+ㄴ, ㄷ+ㄴ, ㅂ+ㄴ, ㄱ+ㅁ, ㄷ+ㅁ, ㅂ+ㅁ.',
                'confusion' => [
                    ['symbol' => '한국말', 'hint' => 'Как пишется, но не как читается.'],
                    ['symbol' => '한궁말', 'hint' => 'Как читается по правилу назализации.'],
                ],
                'examples' => [
                    ['word' => '먹는', 'romanization' => '멍는', 'meaning' => 'есть (причастие)'],
                    ['word' => '십만', 'romanization' => '심만', 'meaning' => 'сто тысяч'],
                    ['word' => '국물', 'romanization' => '궁물', 'meaning' => 'бульон'],
                    ['word' => '앞문', 'romanization' => '암문', 'meaning' => 'передняя дверь'],
                ],
            ],
            [
                'symbol' => '신라',
                'romanization' => '실라',
                'description' => 'Латерализация: ㄴ + ㄹ или ㄹ + ㄴ читаются как ㄹㄹ.',
                'sound_ipa' => 'ɕilla̠',
                'sound_note' => 'ㄴ в 신 перед ㄹ в 라 превращается в ㄹ, и оба звука читаются как [ㄹㄹ].',
                'sample_syllable' => '신라',
                'sample_romanization' => '실라',
                'family_symbols' => ['ㄴ', 'ㄹ'],
                'family_note' => 'Правило работает в обе стороны: ㄴ+ㄹ и ㄹ+ㄴ.',
                'confusion' => [
                    ['symbol' => '신라', 'hint' => 'Как пишется.'],
                    ['symbol' => '실라', 'hint' => 'Как читается по правилу латерализации.'],
                ],
                'examples' => [
                    ['word' => '연락', 'romanization' => '열락', 'meaning' => 'связь, контакт'],
                    ['word' => '설날', 'romanization' => '설랄', 'meaning' => 'Новый год по лунному календарю'],
                    ['word' => '물난리', 'romanization' => '물랄리', 'meaning' => 'наводнение'],
                    ['word' => '칼날', 'romanization' => '칼랄', 'meaning' => 'лезвие'],
                ],
            ],
            [
                'symbol' => '독립',
                'romanization' => '독닙',
                'description' => 'ㄹ после ㄱ, ㅂ, ㅇ, ㅁ читается как ㄴ.',
                'sound_ipa' => 'to̞ŋnip̚',
                'sound_note' => 'ㄹ в 립 после ㅂ в 독 превращается в ㄴ: [독닙].',
                'sample_syllable' => '독립',
                'sample_romanization' => '독닙',
                'family_symbols' => ['ㄱ', 'ㅂ', 'ㅇ', 'ㅁ', 'ㄹ'],
                'family_note' => 'ㄹ после ㄱ, ㅂ, ㅇ, ㅁ становится ㄴ.',
                'confusion' => [
                    ['symbol' => '독립', 'hint' => 'Как пишется.'],
                    ['symbol' => '독닙', 'hint' => 'Как читается по правилу.'],
                ],
                'examples' => [
                    ['word' => '심리', 'romanization' => '심니', 'meaning' => 'психология'],
                    ['word' => '협력', 'romanization' => '협녁', 'meaning' => 'сотрудничество'],
                    ['word' => '대통령', 'romanization' => '대통녕', 'meaning' => 'президент'],
                    ['word' => '백로', 'romanization' => '백노', 'meaning' => 'белая цапля'],
                ],
            ],
            [
                'symbol' => '굳이',
                'romanization' => '구지',
                'description' => 'Палатализация: ㄷ, ㅌ перед 이 читаются как ㅈ, ㅊ.',
                'sound_ipa' => 'kudʑi',
                'sound_note' => 'ㄷ в 굳 перед 이 превращается в ㅈ: [구지].',
                'sample_syllable' => '굳이',
                'sample_romanization' => '구지',
                'family_symbols' => ['ㄷ', 'ㅌ', 'ㅈ', 'ㅊ'],
                'family_note' => 'Правило работает, когда ㄷ/ㅌ стоят перед слогом 이.',
                'confusion' => [
                    ['symbol' => '굳이', 'hint' => 'Как пишется.'],
                    ['symbol' => '구지', 'hint' => 'Как читается по правилу палатализации.'],
                ],
                'examples' => [
                    ['word' => '같이', 'romanization' => '가치', 'meaning' => 'вместе'],
                    ['word' => '붙이다', 'romanization' => '부치다', 'meaning' => 'приклеивать'],
                    ['word' => '닫히다', 'romanization' => '다치다', 'meaning' => 'закрываться'],
                    ['word' => '맏이', 'romanization' => '마지', 'meaning' => 'старший ребёнок'],
                ],
            ],
            [
                'symbol' => '좋다',
                'romanization' => '조타',
                'description' => 'Ассимиляция ㅎ: ㅎ + ㄱ/ㄷ/ㅈ читаются как ㅋ/ㅌ/ㅊ.',
                'sound_ipa' => 'tɕo̞tʰa̠',
                'sound_note' => 'ㅎ в 좋 перед ㄷ в 다 сливается и даёт ㅌ: [조타].',
                'sample_syllable' => '좋다',
                'sample_romanization' => '조타',
                'family_symbols' => ['ㅎ', 'ㄱ', 'ㄷ', 'ㅈ'],
                'family_note' => 'ㅎ перед ㄱ, ㄷ, ㅈ даёт придыхательный ㅋ, ㅌ, ㅊ.',
                'confusion' => [
                    ['symbol' => '좋다', 'hint' => 'Как пишется.'],
                    ['symbol' => '조타', 'hint' => 'Как читается по правилу ассимиляции ㅎ.'],
                ],
                'examples' => [
                    ['word' => '놓고', 'romanization' => '노코', 'meaning' => 'класть и...'],
                    ['word' => '많다', 'romanization' => '만타', 'meaning' => 'быть многим'],
                    ['word' => '괜찮다', 'romanization' => '괜찬타', 'meaning' => 'быть нормальным'],
                    ['word' => '싫다', 'romanization' => '실타', 'meaning' => 'не нравиться'],
                ],
            ],
        ];

        foreach ($rules as $index => $rule) {
            $letter = AlphabetLetter::updateOrCreate(
                [
                    'symbol' => $rule['symbol'],
                    'category' => 'assimilation',
                ],
                [
                    'romanization' => $rule['romanization'],
                    'description' => $rule['description'],
                    'sound_ipa' => $rule['sound_ipa'],
                    'sound_note' => $rule['sound_note'],
                    'sample_syllable' => $rule['sample_syllable'],
                    'sample_romanization' => $rule['sample_romanization'],
                    'family_symbols' => $rule['family_symbols'],
                    'family_note' => $rule['family_note'],
                    'confusion' => $rule['confusion'],
                    'sort_order' => $index,
                ],
            );

            $letter->examples()->delete();

            foreach ($rule['examples'] as $exIndex => $example) {
                $letter->examples()->create([
                    'word' => $example['word'],
                    'romanization' => $example['romanization'],
                    'meaning' => $example['meaning'],
                    'sort_order' => $exIndex,
                ]);
            }
        }
    }
}