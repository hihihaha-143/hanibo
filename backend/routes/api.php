<?php

use Illuminate\Support\Facades\Route;
use App\Models\Tip;
use App\Http\Controllers\Api\CourseItemController;
use App\Http\Controllers\Api\CourseItemWordController;
use App\Http\Controllers\Api\CourseItemGrammarController;
use App\Http\Controllers\Api\DailyQuizController;
use App\Http\Controllers\Api\DailyWordController;
use App\Http\Controllers\Api\DailyPhraseController;
use App\Http\Controllers\Api\DailyPhraseQuizController;
use App\Http\Controllers\Api\DictionaryController;
use App\Http\Controllers\Api\PhrasesController;
use App\Http\Controllers\Api\GrammarRuleController;
use App\Http\Controllers\Api\UserGrammarController;
use App\Http\Controllers\Api\MiniGame\AudioChooseController;
use App\Http\Controllers\Api\MiniGame\CorrectSpellingController;
use App\Http\Controllers\Api\MiniGame\MatchController;
use App\Http\Controllers\Api\MiniGame\Phrase\PhraseAudioChooseController;
use App\Http\Controllers\Api\MiniGame\Phrase\PhraseCorrectSpellingController;
use App\Http\Controllers\Api\MiniGame\Phrase\PhraseMatchController;
use App\Http\Controllers\Api\MiniGame\Phrase\PhraseOrderController;
use App\Http\Controllers\Api\MiniGame\Phrase\PhraseSpeedController;
use App\Http\Controllers\Api\MiniGame\Phrase\PhraseTrueFalseController;
use App\Http\Controllers\Api\MiniGame\RewardController;
use App\Http\Controllers\Api\MiniGame\SpeedController;
use App\Http\Controllers\Api\MiniGame\SyllableGapController;
use App\Http\Controllers\Api\MiniGame\SyllableOrderController;
use App\Http\Controllers\Api\MiniGame\TextInputController;
use App\Http\Controllers\Api\MiniGame\TrueFalseController;
use App\Http\Controllers\Api\TopicController;
use App\Http\Controllers\Api\UserWordController;
use App\Http\Controllers\Api\UserPhraseController;
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

    // --- Phrases (словарь фраз) ---
    Route::get('/phrases', [PhrasesController::class, 'index']);

    // --- Daily Word ---
    Route::get('/daily-word', [DailyWordController::class, 'show']);

    // --- Daily Quiz ---
    Route::get('/daily-quiz', [DailyQuizController::class, 'show']);

    // --- Daily Phrase ---
    Route::get('/daily-phrase', [DailyPhraseController::class, 'show']);

    // --- Daily Phrase Quiz ---
    Route::get('/daily-phrase-quiz', [DailyPhraseQuizController::class, 'show']);

    // --- UserWord (SRS-прогресс слов) ---
    Route::post('/user-words/start', [UserWordController::class, 'start']);
    Route::post('/user-words/progress', [UserWordController::class, 'progress']);
    Route::delete('/user-words/{wordId}', [UserWordController::class, 'destroy']);

    // --- UserPhrase (SRS-прогресс фраз) ---
    Route::post('/user-phrases/start', [UserPhraseController::class, 'start']);
    Route::post('/user-phrases/progress', [UserPhraseController::class, 'progress']);
    Route::delete('/user-phrases/{phraseId}', [UserPhraseController::class, 'destroy']);

    // --- Grammar (словарь грамматики + SRS) ---
    Route::get('/grammar-rules', [GrammarRuleController::class, 'index']);
    Route::get('/grammar-rules/filters', [GrammarRuleController::class, 'filters']);
    Route::get('/grammar-rules/{grammarRule}', [GrammarRuleController::class, 'show']);

    Route::get('/user/grammar-rules', [UserGrammarController::class, 'index']);
    Route::post('/user/grammar-rules/{grammarRule}/start', [UserGrammarController::class, 'start']);
    Route::post('/user/grammar-rules/{grammarRule}/review', [UserGrammarController::class, 'review']);
    Route::delete('/user/grammar-rules/{grammarRule}/reset', [UserGrammarController::class, 'reset']);

    // --- MiniGames (слова) ---
    Route::prefix('minigames')->group(function () {
        Route::get('/true-false', [TrueFalseController::class, 'show']);
        Route::get('/audio-choose', [AudioChooseController::class, 'show']);
        Route::get('/match', [MatchController::class, 'show']);
        Route::get('/syllable-gap', [SyllableGapController::class, 'show']);
        Route::get('/syllable-order', [SyllableOrderController::class, 'show']);
        Route::get('/speed', [SpeedController::class, 'show']);
        Route::get('/correct-spelling', [CorrectSpellingController::class, 'show']);
        Route::get('/text-input', [TextInputController::class, 'show']);
        Route::post('/reward', [RewardController::class, 'store']);

        // --- MiniGames (фразы) ---
        Route::prefix('phrase')->group(function () {
            Route::get('/true-false', [PhraseTrueFalseController::class, 'show']);
            Route::get('/audio-choose', [PhraseAudioChooseController::class, 'show']);
            Route::get('/match', [PhraseMatchController::class, 'show']);
            Route::get('/speed', [PhraseSpeedController::class, 'show']);
            Route::get('/correct-spelling', [PhraseCorrectSpellingController::class, 'show']);
            Route::get('/order', [PhraseOrderController::class, 'show']);
        });
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