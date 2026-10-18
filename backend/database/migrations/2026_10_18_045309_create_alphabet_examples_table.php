<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alphabet_examples', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')
                ->constrained('alphabet_letters')
                ->cascadeOnDelete();
            $table->string('word');
            $table->string('romanization')->nullable();
            $table->string('meaning');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['letter_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alphabet_examples');
    }
};