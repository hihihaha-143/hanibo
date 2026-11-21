<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_course_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_item_id')->constrained('course_items')->cascadeOnDelete();
            $table->unsignedTinyInteger('words_percent')->default(0);
            $table->unsignedTinyInteger('grammar_percent')->default(0);
            $table->unsignedTinyInteger('final_percent')->default(0);
            $table->unsignedTinyInteger('test_percent')->default(0);
            $table->unsignedTinyInteger('lesson_reward_tier')->default(0);
            $table->unsignedTinyInteger('test_reward_tier')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'course_item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_course_progress');
    }
};
