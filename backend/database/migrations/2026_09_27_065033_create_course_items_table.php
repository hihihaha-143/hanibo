<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('course_items', function (Blueprint $table) {
        $table->id();
        $table->enum('type', ['lesson', 'extra', 'test']);
        $table->unsignedInteger('order');
        $table->string('title');
        $table->timestamps();

        $table->unique('order');
    });
}


    public function down(): void
    {
        Schema::dropIfExists('course_items');
    }
};
