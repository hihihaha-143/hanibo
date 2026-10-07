<?php

use Illuminate\Support\Facades\Route;
use App\Models\Tip;
use App\Http\Controllers\Api\CourseItemController;
use App\Http\Controllers\Api\CourseItemWordController;
use App\Http\Controllers\Api\CourseItemGrammarController;

Route::get('/course-items/{courseItem}/grammar', [CourseItemGrammarController::class, 'index']);
Route::get('/course-items/{courseItem}/words', [CourseItemWordController::class, 'index']);

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
Route::get('/course/items', [CourseItemController::class, 'index']);
Route::get('/course/items/{id}', [CourseItemController::class, 'show']);
Route::get('/course-tests/{id}/data', [CourseItemController::class, 'testData']);