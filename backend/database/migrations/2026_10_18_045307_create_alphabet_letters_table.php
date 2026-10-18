<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alphabet_letters', function (Blueprint $table) {
            $table->id();
            $table->string('symbol');
            $table->string('romanization');
            $table->enum('category', ['vowel', 'diphthong', 'consonant']);
            $table->text('description')->nullable();

            $table->string('sound_ipa')->nullable();
            $table->text('sound_note')->nullable();
            $table->string('sample_syllable')->nullable();
            $table->string('sample_romanization')->nullable();

            $table->json('family_symbols')->nullable();
            $table->text('family_note')->nullable();

            $table->json('confusion')->nullable();

            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['symbol', 'category']);
            $table->index(['category', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alphabet_letters');
    }
};