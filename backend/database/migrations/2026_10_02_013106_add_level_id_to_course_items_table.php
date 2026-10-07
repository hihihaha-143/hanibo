<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('course_items', function (Blueprint $table) {
            $table->foreignId('level_id')
                ->nullable()
                ->after('order')
                ->constrained('levels')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('course_items', function (Blueprint $table) {
            $table->dropForeign(['level_id']);
            $table->dropColumn('level_id');
        });
    }
};