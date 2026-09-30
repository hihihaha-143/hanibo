<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grammar_phrase', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grammar_rule_id')
                ->constrained('grammar_rules')
                ->cascadeOnDelete();
            $table->foreignId('phrase_id')
                ->constrained('phrases')
                ->cascadeOnDelete();
            $table->unique(['grammar_rule_id', 'phrase_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grammar_phrase');
    }
};