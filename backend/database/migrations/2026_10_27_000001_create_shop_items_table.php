<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_items', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', [
                'title',
                'status',
                'avatar',
                'frame',
                'banner',
                'nickname_color',
                'icon',
                'medal',
                'buff',
            ]);
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('price');
            $table->enum('currency', ['blueberry', 'strawberry'])->default('blueberry');
            $table->string('image')->nullable();
            $table->string('color', 7)->nullable();
            $table->string('text')->nullable();
            $table->boolean('is_hidden')->default(false);
            $table->boolean('is_purchasable')->default(true);
            $table->unsignedTinyInteger('max_active')->default(1);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('type');
            $table->index(['is_purchasable', 'is_hidden']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_items');
    }
}; 