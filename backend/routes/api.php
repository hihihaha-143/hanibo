<?php

use Illuminate\Support\Facades\Route;
use App\Models\Tip;
use App\Http\Controllers\Api\CourseItemController;
use App\Http\Controllers\Api\CourseItemWordController;
use App\Http\Controllers\Api\CourseItemGrammarController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\LibraryItemController;

Route::get('/library/items', [LibraryItemController::class, 'index']);
Route::get('/library/items/{libraryItem}', [LibraryItemController::class, 'show']);
Route::get('/library/items/{libraryItem}/file', [LibraryItemController::class, 'file']);
Route::get('/alphabet', [\App\Http\Controllers\Api\AlphabetController::class, 'index']);

// --- Auth ---
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
});

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