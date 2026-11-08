<?php

namespace Database\Seeders;

use App\Models\Shop\ShopItem;
use Illuminate\Database\Seeder;

class ShopItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            // Титулы (выдаются за достижения, не продаются)
            [
                'code' => 'title_knows_alphabet',
                'type' => ShopItem::TYPE_TITLE,
                'title' => 'Знаю алфавит',
                'description' => 'Титул за полное прохождение алфавита.',
                'price' => 0,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'text' => 'Знаю алфавит',
                'is_hidden' => false,
                'is_purchasable' => false,
                'max_active' => 1,
                'sort_order' => 10,
            ],

            // Надписи
            [
                'code' => 'status_korean_hard',
                'type' => ShopItem::TYPE_STATUS,
                'title' => 'Корейский — сложный',
                'description' => 'Надпись под ником.',
                'price' => 50,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'text' => 'Корейский — сложный',
                'max_active' => 1,
                'sort_order' => 20,
            ],
            [
                'code' => 'status_learning_hangul',
                'type' => ShopItem::TYPE_STATUS,
                'title' => 'Учу хангыль',
                'description' => 'Надпись под ником.',
                'price' => 50,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'text' => 'Учу хангыль',
                'max_active' => 1,
                'sort_order' => 21,
            ],

            // Аватарки
            [
                'code' => 'avatar_cat',
                'type' => ShopItem::TYPE_AVATAR,
                'title' => 'Кот',
                'description' => 'Аватарка с котом.',
                'price' => 150,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'image' => 'avatars/cat',
                'max_active' => 1,
                'sort_order' => 30,
            ],
            [
                'code' => 'avatar_fox',
                'type' => ShopItem::TYPE_AVATAR,
                'title' => 'Лиса',
                'description' => 'Аватарка с лисой.',
                'price' => 150,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'image' => 'avatars/fox',
                'max_active' => 1,
                'sort_order' => 31,
            ],
            [
                'code' => 'avatar_rabbit',
                'type' => ShopItem::TYPE_AVATAR,
                'title' => 'Кролик',
                'description' => 'Аватарка с кроликом.',
                'price' => 200,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'image' => 'avatars/rabbit',
                'max_active' => 1,
                'sort_order' => 32,
            ],

            // Рамки
            [
                'code' => 'frame_gold',
                'type' => ShopItem::TYPE_FRAME,
                'title' => 'Золотая',
                'description' => 'Золотая рамка вокруг аватарки.',
                'price' => 250,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'image' => 'frames/gold',
                'max_active' => 1,
                'sort_order' => 40,
            ],
            [
                'code' => 'frame_snow',
                'type' => ShopItem::TYPE_FRAME,
                'title' => 'Снежная',
                'description' => 'Снежная рамка вокруг аватарки.',
                'price' => 250,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'image' => 'frames/snow',
                'max_active' => 1,
                'sort_order' => 41,
            ],

            // Баннер
            [
                'code' => 'banner_sunset',
                'type' => ShopItem::TYPE_BANNER,
                'title' => 'Закат',
                'description' => 'Баннер с закатом.',
                'price' => 300,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'image' => 'banners/sunset',
                'max_active' => 1,
                'sort_order' => 50,
            ],

            // Цвет ника
            [
                'code' => 'nickname_gold',
                'type' => ShopItem::TYPE_NICKNAME_COLOR,
                'title' => 'Золотой',
                'description' => 'Золотой цвет ника.',
                'price' => 200,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'color' => '#FFD700',
                'max_active' => 1,
                'sort_order' => 60,
            ],
            [
                'code' => 'nickname_blue',
                'type' => ShopItem::TYPE_NICKNAME_COLOR,
                'title' => 'Голубой',
                'description' => 'Голубой цвет ника.',
                'price' => 200,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'color' => '#6EC6FF',
                'max_active' => 1,
                'sort_order' => 61,
            ],

            // Иконки
            [
                'code' => 'icon_fire',
                'type' => ShopItem::TYPE_ICON,
                'title' => 'Огонь',
                'description' => 'Иконка огня рядом с ником.',
                'price' => 100,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'image' => 'icons/fire',
                'max_active' => 3,
                'sort_order' => 70,
            ],
            [
                'code' => 'icon_star',
                'type' => ShopItem::TYPE_ICON,
                'title' => 'Звезда',
                'description' => 'Иконка звезды рядом с ником.',
                'price' => 100,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'image' => 'icons/star',
                'max_active' => 3,
                'sort_order' => 71,
            ],

            // Медали
            [
                'code' => 'medal_novice',
                'type' => ShopItem::TYPE_MEDAL,
                'title' => 'Новичок',
                'description' => 'Медаль новичка.',
                'price' => 80,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'image' => 'medals/novice',
                'max_active' => 1,
                'sort_order' => 80,
            ],
            [
                'code' => 'medal_alphabet_master',
                'type' => ShopItem::TYPE_MEDAL,
                'title' => 'Мастер алфавита',
                'description' => 'Медаль за мастерство в алфавите.',
                'price' => 400,
                'currency' => ShopItem::CURRENCY_BLUEBERRY,
                'image' => 'medals/alphabet-master',
                'max_active' => 1,
                'sort_order' => 81,
            ],

            // Бусты
            [
                'code' => 'buff_exp_x2_1h',
                'type' => ShopItem::TYPE_BUFF,
                'title' => '×2 опыта на 1 час',
                'description' => 'Удваивает получаемый опыт на 1 час.',
                'price' => 50,
                'currency' => ShopItem::CURRENCY_STRAWBERRY,
                'max_active' => 1,
                'sort_order' => 90,
            ],
            [
                'code' => 'buff_streak_freeze',
                'type' => ShopItem::TYPE_BUFF,
                'title' => '+1 заморозка',
                'description' => 'Добавляет одну заморозку стрика.',
                'price' => 30,
                'currency' => ShopItem::CURRENCY_STRAWBERRY,
                'max_active' => 1,
                'sort_order' => 91,
            ],
        ];

        foreach ($items as $item) {
            ShopItem::updateOrCreate(
                ['code' => $item['code']],
                $item,
            );
        }
    }
}