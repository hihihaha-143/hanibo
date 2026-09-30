<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GrammarRuleResource;
use App\Models\CourseItem;
use Illuminate\Http\JsonResponse;

class CourseItemGrammarController extends Controller
{
    public function index(CourseItem $courseItem): JsonResponse
    {
        $grammar = $courseItem->grammarRules()
            ->with([
                'form',
                'level',
                'phrases.tokens.word',
                'phrases.tokens.grammarRule',
            ])
            ->get();

        return response()->json([
            'course_item' => [
                'id' => $courseItem->id,
                'type' => $courseItem->type,
                'title' => $courseItem->title,
                'order' => $courseItem->order,
            ],
            'grammar' => GrammarRuleResource::collection($grammar),
        ]);
    }
}