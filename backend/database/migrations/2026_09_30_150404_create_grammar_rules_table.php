<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grammar_rules', function (Blueprint $table) {
            $table->id();
            $table->text('title');
            $table->text('construction');
            $table->foreignId('form_id')
                ->nullable()
                ->constrained('forms')
                ->cascadeOnDelete();
            $table->foreignId('level_id')
                ->nullable()
                ->constrained('levels')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grammar_rules');
    }
};