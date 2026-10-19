<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlphabetLetterResource;
use App\Models\AlphabetLetter;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class AlphabetController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $user = Auth::guard('sanctum')->user();

        $letters = AlphabetLetter::query()
            ->with([
                'examples' => fn ($q) => $q->orderBy('sort_order'),
                'progress' => function ($q) use ($user) {
                    if ($user) {
                        $q->where('user_id', $user->id);
                    } else {
                        $q->whereRaw('1 = 0');
                    }
                },
            ])
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get();

        return AlphabetLetterResource::collection($letters);
    }
}