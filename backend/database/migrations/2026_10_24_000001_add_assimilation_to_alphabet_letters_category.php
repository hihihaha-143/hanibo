<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE alphabet_letters
            MODIFY COLUMN category ENUM('vowel', 'diphthong', 'consonant', 'assimilation')
            NOT NULL
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE alphabet_letters
            MODIFY COLUMN category ENUM('vowel', 'diphthong', 'consonant')
            NOT NULL
        ");
    }
};