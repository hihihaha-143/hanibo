<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up(): void
{
    Schema::table('course_items', function (Blueprint $table) {
        $table->foreignId('extra_id')
            ->nullable()
            ->after('title')
            ->constrained('extras')
            ->nullOnDelete();
    });
}

public function down(): void
{
    Schema::table('course_items', function (Blueprint $table) {
        $table->dropForeign(['extra_id']);
        $table->dropColumn('extra_id');
    });
}
};
