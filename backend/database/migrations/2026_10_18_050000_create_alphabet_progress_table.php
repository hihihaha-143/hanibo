<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alphabet_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->foreignId('letter_id')
                ->constrained('alphabet_letters')
                ->cascadeOnDelete();
            $table->unsignedTinyInteger('score')->default(0);
            $table->unsignedInteger('attempts')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'letter_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alphabet_progress');
    }
};