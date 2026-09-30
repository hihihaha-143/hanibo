<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('phrase_word', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phrase_id')
                ->constrained('phrases')
                ->cascadeOnDelete();
            $table->foreignId('word_id')
                ->constrained('words')
                ->cascadeOnDelete();
            $table->unique(['phrase_id', 'word_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phrase_word');
    }
};