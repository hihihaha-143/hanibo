<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use Illuminate\Http\JsonResponse;

class TopicController extends Controller
{
    public function index(): JsonResponse
    {
        $topics = Topic::query()
            ->orderBy('order')
            ->orderBy('title')
            ->get(['id', 'title']);

        return response()->json($topics);
    }
}