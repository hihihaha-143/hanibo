<?php

use Illuminate\Support\Facades\Route;
use App\Models\Tip;
use App\Http\Controllers\Api\CourseItemController;
use App\Http\Controllers\Api\CourseItemWordController;
use App\Http\Controllers\Api\CourseItemGrammarController;
use App\Http\Controllers\Api\DailyQuizController;
use App\Http\Controllers\Api\DailyWordController;
use App\Http\Controllers\Api\DictionaryController;
use App\Http\Controllers\Api\MiniGame\AudioChooseController;
use App\Http\Controllers\Api\MiniGame\RewardController;
use App\Http\Controllers\Api\MiniGame\TrueFalseController;
use App\Http\Controllers\Api\TopicController;
use App\Http\Controllers\Api\UserWordController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\LibraryItemController;
use App\Http\Controllers\AlphabetProgressController;
use App\Http\Controllers\AlphabetGroupProgressController;
use App\Http\Controllers\Shop\ShopController;

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
    Route::post('/auth/timezone', [AuthController::class, 'updateTimezone']);

    // ВАЖНО: group/progress должен идти ВЫШЕ {letter}/progress
    Route::post('/alphabet/group/progress', [AlphabetGroupProgressController::class, 'store']);
    Route::post('/alphabet/{letter}/progress', [AlphabetProgressController::class, 'store']);

    // --- Shop ---
    Route::get('/shop/items', [ShopController::class, 'index']);
    Route::get('/shop/inventory', [ShopController::class, 'inventory']);
    Route::post('/shop/items/{item}/buy', [ShopController::class, 'buy']);
    Route::post('/shop/items/{item}/equip', [ShopController::class, 'equip']);
    Route::post('/shop/items/{item}/unequip', [ShopController::class, 'unequip']);
    Route::post('/shop/items/{item}/activate', [ShopController::class, 'activate']);

    // --- Dictionary ---
    Route::get('/dictionary', [DictionaryController::class, 'index']);
    Route::get('/topics', [TopicController::class, 'index']);

    // --- Daily Word ---
    Route::get('/daily-word', [DailyWordController::class, 'show']);

    // --- Daily Quiz ---
    Route::get('/daily-quiz', [DailyQuizController::class, 'show']);

    // --- UserWord (SRS-прогресс слов) ---
    Route::post('/user-words/start', [UserWordController::class, 'start']);
    Route::post('/user-words/progress', [UserWordController::class, 'progress']);
    Route::delete('/user-words/{wordId}', [UserWordController::class, 'destroy']);

    // --- MiniGames ---
    Route::prefix('minigames')->group(function () {
        Route::get('/true-false', [TrueFalseController::class, 'show']);
        Route::get('/audio-choose', [AudioChooseController::class, 'show']);
        Route::post('/reward', [RewardController::class, 'store']);
    });
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