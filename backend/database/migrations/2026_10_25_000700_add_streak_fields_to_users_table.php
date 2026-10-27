<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('timezone')->default('UTC')->after('avatar');
            $table->unsignedInteger('daily_exp_goal')->default(150)->after('timezone');
            $table->unsignedInteger('exp_today')->default(0)->after('daily_exp_goal');
            $table->date('exp_today_date')->nullable()->after('exp_today');
            $table->unsignedInteger('streak_freezes')->default(0)->after('streak_last_date');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'timezone',
                'daily_exp_goal',
                'exp_today',
                'exp_today_date',
                'streak_freezes',
            ]);
        });
    }
};