<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlphabetLetterResource;
use App\Models\AlphabetLetter;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AlphabetController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $letters = AlphabetLetter::query()
            ->with(['examples' => fn ($q) => $q->orderBy('sort_order')])
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get();

        return AlphabetLetterResource::collection($letters);
    }
}