<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LibraryItemResource;
use App\Models\LibraryItem;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LibraryItemController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $items = LibraryItem::orderByDesc('created_at')->get();

        return LibraryItemResource::collection($items);
    }
}