<?php

namespace Database\Seeders;

use App\Models\Achievement\Title;
use Illuminate\Database\Seeder;

class TitleSeeder extends Seeder
{
    public function run(): void
    {
        $titles = [
            [
                'code' => 'know_alphabet',
                'title' => 'Знаю алфавит',
                'description' => 'Все 45 записей алфавита на 10/10.',
                'is_hidden' => false,
                'is_purchasable' => false,
                'price' => 0,
                'sort_order' => 10,
            ],
        ];

        foreach ($titles as $item) {
            Title::updateOrCreate(
                ['code' => $item['code']],
                [
                    'title' => $item['title'],
                    'description' => $item['description'],
                    'is_hidden' => $item['is_hidden'],
                    'is_purchasable' => $item['is_purchasable'],
                    'price' => $item['price'],
                    'sort_order' => $item['sort_order'],
                ],
            );
        }
    }
}