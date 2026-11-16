<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_phrases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->foreignId('phrase_id')
                ->constrained('phrases')
                ->cascadeOnDelete();

            $table->unsignedInteger('mistakes_count')->default(0);
            $table->unsignedInteger('correct_streak')->default(0);
            $table->unsignedInteger('interval_days')->default(0);
            $table->timestamp('next_review_at')->nullable();

            $table->timestamps();

            $table->unique(['user_id', 'phrase_id']);
            $table->index(['user_id', 'next_review_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_phrases');
    }
};