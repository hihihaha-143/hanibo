<?php

use Illuminate\Support\Facades\Route;
use App\Models\Tip;
use App\Models\CourseItem;

// --- Ping (проверка связи) ---
Route::get('/ping', function () {
    return response()->json([
        'message' => 'pong',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// --- Tips (советы/факты) ---
Route::get('/tips/random', function () {
    $tip = Tip::inRandomOrder()->first();

    if (!$tip) {
        return response()->json(['message' => 'No tips yet'], 404);
    }

    return response()->json([
        'type' => $tip->type,
        'content' => $tip->content,
    ]);
});

// --- Course (курс) ---
Route::get('/course/items', function () {
    $items = CourseItem::orderBy('order')->get(['id', 'type', 'order', 'title']);

    return response()->json($items);
});