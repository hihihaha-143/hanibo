<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_grammar_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->foreignId('grammar_rule_id')
                ->constrained('grammar_rules')
                ->cascadeOnDelete();
            $table->enum('status', ['new', 'learning', 'learned', 'review'])
                ->default('learning');
            $table->unsignedInteger('interval_days')->default(0);
            $table->timestamp('next_review_at')->nullable();
            $table->unsignedInteger('correct_streak')->default(0);
            $table->unsignedInteger('mistakes_count')->default(0);
            $table->timestamp('started_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'grammar_rule_id']);
            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'next_review_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_grammar_rules');
    }
};