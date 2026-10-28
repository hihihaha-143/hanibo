<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('selected_status_id')->nullable()->after('selected_title_id')
                ->constrained('shop_items')->nullOnDelete();
            $table->foreignId('selected_avatar_id')->nullable()->after('selected_status_id')
                ->constrained('shop_items')->nullOnDelete();
            $table->foreignId('selected_frame_id')->nullable()->after('selected_avatar_id')
                ->constrained('shop_items')->nullOnDelete();
            $table->foreignId('selected_banner_id')->nullable()->after('selected_frame_id')
                ->constrained('shop_items')->nullOnDelete();
            $table->foreignId('selected_nickname_color_id')->nullable()->after('selected_banner_id')
                ->constrained('shop_items')->nullOnDelete();
            $table->foreignId('selected_medal_id')->nullable()->after('selected_nickname_color_id')
                ->constrained('shop_items')->nullOnDelete();
            $table->json('selected_icon_ids')->nullable()->after('selected_medal_id');
            $table->timestamp('exp_boost_until')->nullable()->after('selected_icon_ids');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('selected_status_id');
            $table->dropConstrainedForeignId('selected_avatar_id');
            $table->dropConstrainedForeignId('selected_frame_id');
            $table->dropConstrainedForeignId('selected_banner_id');
            $table->dropConstrainedForeignId('selected_nickname_color_id');
            $table->dropConstrainedForeignId('selected_medal_id');
            $table->dropColumn(['selected_icon_ids', 'exp_boost_until']);
        });
    }
};