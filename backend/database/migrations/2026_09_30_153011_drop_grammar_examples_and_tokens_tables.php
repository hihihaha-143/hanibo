<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('grammar_example_tokens');
        Schema::dropIfExists('grammar_examples');
    }

    public function down(): void
    {
        // откат невозможен, данные не восстановятся
    }
};