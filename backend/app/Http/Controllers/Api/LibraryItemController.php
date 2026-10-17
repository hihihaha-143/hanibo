<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LibraryItemResource;
use App\Models\LibraryItem;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class LibraryItemController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $items = LibraryItem::orderByDesc('created_at')->get();

        return LibraryItemResource::collection($items);
    }

    public function show(LibraryItem $libraryItem): LibraryItemResource
    {
        return new LibraryItemResource($libraryItem);
    }

    public function file(LibraryItem $libraryItem): BinaryFileResponse
    {
        abort_if(!$libraryItem->file_path, 404);

        $path = public_path($libraryItem->file_path);
        abort_unless(File::exists($path), 404);

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
        ]);
    }
}