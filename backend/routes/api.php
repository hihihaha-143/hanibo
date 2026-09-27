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

Route::get('/course/items/{id}', function (int $id) {
    $item = CourseItem::with('extra')->find($id);

    if (!$item) {
        return response()->json(['message' => 'Not found'], 404);
    }

    $next = CourseItem::where('order', '>', $item->order)
        ->orderBy('order')
        ->first(['id', 'type', 'title']);

    $prev = CourseItem::where('order', '<', $item->order)
        ->orderByDesc('order')
        ->first(['id', 'type', 'title']);

    return response()->json([
        'id'     => $item->id,
        'type'   => $item->type,
        'order'  => $item->order,
        'title'  => $item->title,
        'extra'  => $item->extra ? [
            'title'   => $item->extra->title,
            'content' => $item->extra->content,
        ] : null,
        'next'   => $next ? ['id' => $next->id, 'type' => $next->type, 'title' => $next->title] : null,
        'prev'   => $prev ? ['id' => $prev->id, 'type' => $prev->type, 'title' => $prev->title] : null,
    ]);
});