<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_test_lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_test_id')
                ->constrained('course_items')
                ->cascadeOnDelete();
            $table->foreignId('course_lesson_id')
                ->constrained('course_items')
                ->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['course_test_id', 'course_lesson_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_test_lessons');
    }
};
