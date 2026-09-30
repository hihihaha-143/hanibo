<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WordResource;
use App\Models\CourseItem;
use Illuminate\Http\JsonResponse;

class CourseItemWordController extends Controller
{
    public function index(CourseItem $courseItem): JsonResponse
    {
        $words = $courseItem->words()
            ->with([
                'partOfSpeech',
                'level',
                'topics',
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
            'words' => WordResource::collection($words),
        ]);
    }
}