<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('phrase_topic', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phrase_id')
                ->constrained('phrases')
                ->cascadeOnDelete();
            $table->foreignId('topic_id')
                ->constrained('topics')
                ->cascadeOnDelete();
            $table->unique(['phrase_id', 'topic_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phrase_topic');
    }
};