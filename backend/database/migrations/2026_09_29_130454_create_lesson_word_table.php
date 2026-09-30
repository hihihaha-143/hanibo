<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lesson_word', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_item_id')
                ->constrained('course_items')
                ->cascadeOnDelete();
            $table->foreignId('word_id')
                ->constrained('words')
                ->cascadeOnDelete();
            $table->integer('order')->default(0);
            $table->unique(['course_item_id', 'word_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_word');
    }
};