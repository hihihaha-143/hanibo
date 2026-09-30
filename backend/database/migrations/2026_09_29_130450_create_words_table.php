<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('words', function (Blueprint $table) {
            $table->id();
            $table->string('hangul');
            $table->string('translation');
            $table->foreignId('part_of_speech_id')
                ->nullable()
                ->constrained('parts_of_speech')
                ->nullOnDelete();
            $table->foreignId('level_id')
                ->nullable()
                ->constrained('levels')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('words');
    }
};