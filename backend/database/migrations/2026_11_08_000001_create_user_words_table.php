<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_words', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->foreignId('word_id')
                ->constrained('words')
                ->cascadeOnDelete();

            $table->unsignedInteger('mistakes_count')->default(0);
            $table->unsignedInteger('correct_streak')->default(0);
            $table->unsignedInteger('interval_days')->default(0);
            $table->timestamp('next_review_at')->nullable();

            $table->timestamps();

            $table->unique(['user_id', 'word_id']);
            $table->index(['user_id', 'next_review_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_words');
    }
};