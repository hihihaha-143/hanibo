<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grammar_examples', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grammar_rule_id')
                ->constrained('grammar_rules')
                ->cascadeOnDelete();
            $table->text('hangul');
            $table->text('translation');
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grammar_examples');
    }
};