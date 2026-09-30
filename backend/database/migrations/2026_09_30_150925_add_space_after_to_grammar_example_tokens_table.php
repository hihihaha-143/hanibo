<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('grammar_example_tokens', function (Blueprint $table) {
            $table->boolean('space_after')->default(false)->after('text');
        });
    }

    public function down(): void
    {
        Schema::table('grammar_example_tokens', function (Blueprint $table) {
            $table->dropColumn('space_after');
        });
    }
};