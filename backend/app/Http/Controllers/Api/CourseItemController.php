<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseItem;
use Illuminate\Http\JsonResponse;

class CourseItemController extends Controller
{
    public function index(): JsonResponse
    {
        $items = CourseItem::orderBy('order')->get(['id', 'type', 'order', 'title']);

        return response()->json($items);
    }

    public function show(int $id): JsonResponse
    {
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

        $nextLesson = CourseItem::where('type', 'lesson')
            ->where('order', '>', $item->order)
            ->orderBy('order')
            ->first(['id', 'type', 'title']);

        $prevLesson = CourseItem::where('type', 'lesson')
            ->where('order', '<', $item->order)
            ->orderByDesc('order')
            ->first(['id', 'type', 'title']);

        $lessonIds = [];
        if ($item->type === 'test') {
            $lessonIds = $item->testLessons()->pluck('course_items.id')->all();
        }

        return response()->json([
            'id'          => $item->id,
            'type'        => $item->type,
            'order'       => $item->order,
            'title'       => $item->title,
            'extra'       => $item->extra ? [
                'title'   => $item->extra->title,
                'content' => $item->extra->content,
            ] : null,
            'next'        => $next ? ['id' => $next->id, 'type' => $next->type, 'title' => $next->title] : null,
            'prev'        => $prev ? ['id' => $prev->id, 'type' => $prev->type, 'title' => $prev->title] : null,
            'next_lesson' => $nextLesson ? ['id' => $nextLesson->id, 'type' => $nextLesson->type, 'title' => $nextLesson->title] : null,
            'prev_lesson' => $prevLesson ? ['id' => $prevLesson->id, 'type' => $prevLesson->type, 'title' => $prevLesson->title] : null,
            'lesson_ids'  => $lessonIds,
        ]);
    }

        public function testData(int $id): JsonResponse
    {
        $item = CourseItem::find($id);

        if (!$item || $item->type !== 'test') {
            return response()->json(['message' => 'Not found'], 404);
        }

        $lessonIds = $item->testLessons()->pluck('course_items.id')->all();

        $words = [];
        $grammar = [];
        $pool = [];

        if (!empty($lessonIds)) {
            $lessons = CourseItem::whereIn('id', $lessonIds)->get();

            $allWordIds = [];
            $allGrammarIds = [];

            foreach ($lessons as $lesson) {
                foreach ($lesson->words()->pluck('words.id')->all() as $wid) {
                    $allWordIds[$wid] = true;
                }
                foreach ($lesson->grammarRules()->pluck('grammar_rules.id')->all() as $gid) {
                    $allGrammarIds[$gid] = true;
                }
            }

            $allWordIds = array_keys($allWordIds);
            $allGrammarIds = array_keys($allGrammarIds);

            if (!empty($allWordIds)) {
                $words = \App\Models\Word::whereIn('id', $allWordIds)
                    ->with([
                        'partOfSpeech',
                        'level',
                        'topics',
                        'phrases.tokens.word',
                        'phrases.tokens.grammarRule',
                    ])
                    ->get();
                $words = \App\Http\Resources\WordResource::collection($words)->resolve();
            }

            if (!empty($allGrammarIds)) {
                $grammarRules = \App\Models\GrammarRule::whereIn('id', $allGrammarIds)
                    ->with([
                        'form',
                        'level',
                        'phrases.tokens.word',
                        'phrases.tokens.grammarRule',
                        'phrases.grammarRules',
                    ])
                    ->get();

                $grammar = \App\Http\Resources\GrammarRuleResource::collection($grammarRules)->resolve();

                // Пул — грамматика того же уровня, что и уроки, но не из этой группы
                $levelIds = $lessons->pluck('level_id')->filter()->unique()->all();
                if (!empty($levelIds)) {
                    $poolRules = \App\Models\GrammarRule::whereIn('level_id', $levelIds)
                        ->whereNotIn('id', $allGrammarIds)
                        ->orderBy('id')
                        ->get();
                    $pool = \App\Http\Resources\GrammarRuleResource::collection($poolRules)->resolve();
                }
            }
        }

        return response()->json([
            'course_item' => [
                'id'    => $item->id,
                'type'  => $item->type,
                'title' => $item->title,
                'order' => $item->order,
            ],
            'words'   => $words,
            'grammar' => $grammar,
            'pool'    => $pool,
            'lesson_ids' => $lessonIds,
        ]);
    }
}