<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('phrase_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phrase_id')
                ->constrained('phrases')
                ->cascadeOnDelete();
            $table->integer('order')->default(0);
            $table->string('text');
            $table->boolean('space_after')->default(false);
            $table->foreignId('word_id')
                ->nullable()
                ->constrained('words')
                ->nullOnDelete();
            $table->foreignId('grammar_rule_id')
                ->nullable()
                ->constrained('grammar_rules')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phrase_tokens');
    }
};