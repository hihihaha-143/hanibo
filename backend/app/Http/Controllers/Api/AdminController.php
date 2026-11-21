<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement\Achievement;
use App\Models\CourseItem;
use App\Models\Form;
use App\Models\GrammarRule;
use App\Models\Level;
use App\Models\LibraryItem;
use App\Models\Tip;
use App\Models\User;
use App\Models\UserCourseProgress;
use App\Models\UserGrammarRule;
use App\Models\UserPhrase;
use App\Models\UserWord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'users' => User::count(),
            'admins' => User::where('role', 'admin')->count(),
            'course_items' => CourseItem::count(),
            'words' => \App\Models\Word::count(),
            'phrases' => \App\Models\Phrase::count(),
            'grammar_rules' => GrammarRule::count(),
            'library_items' => LibraryItem::count(),
            'tips' => Tip::count(),
            'achievements' => Achievement::count(),
            'shop_items' => \App\Models\Shop\ShopItem::count(),
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));
        $query = User::query()
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($nested) use ($search) {
                    $nested->where('nickname', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('id');

        $page = $query->paginate(20);

        return response()->json([
            'data' => $page->getCollection()->map(fn (User $user) => [
                'id' => $user->id,
                'nickname' => $user->nickname,
                'email' => $user->email,
                'role' => $user->role,
                'language_level' => $user->language_level,
                'exp' => $user->exp,
                'blueberry' => $user->blueberry,
                'strawberry' => $user->strawberry,
                'streak_current' => $user->streak_current,
                'created_at' => $user->created_at?->toIso8601String(),
            ]),
            'meta' => [
                'current_page' => $page->currentPage(),
                'last_page' => $page->lastPage(),
                'total' => $page->total(),
            ],
        ]);
    }

    public function updateUser(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'role' => ['required', 'in:user,admin'],
        ]);

        if ($request->user()->id === $user->id && $data['role'] !== 'admin') {
            return response()->json([
                'message' => 'Нельзя снять права администратора с самого себя.',
            ], 422);
        }

        $user->role = $data['role'];
        $user->save();

        return response()->json(['data' => [
            'id' => $user->id,
            'nickname' => $user->nickname,
            'email' => $user->email,
            'role' => $user->role,
        ]]);
    }

    public function resetUserProgress(User $user): JsonResponse
    {
        DB::transaction(function () use ($user) {
            UserWord::where('user_id', $user->id)->delete();
            UserPhrase::where('user_id', $user->id)->delete();
            UserGrammarRule::where('user_id', $user->id)->delete();
            UserCourseProgress::where('user_id', $user->id)->delete();
            DB::table('user_achievements')->where('user_id', $user->id)->delete();
            DB::table('alphabet_progress')->where('user_id', $user->id)->delete();
            $user->forceFill([
                'blueberry' => 0,
                'strawberry' => 0,
                'exp' => 0,
                'exp_today' => 0,
                'streak_current' => 0,
                'streak_best' => 0,
            ])->save();
        });

        return response()->json(['message' => 'Прогресс пользователя сброшен.']);
    }

    public function grammarRules(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));
        $rules = GrammarRule::with(['level', 'form'])
            ->when($search !== '', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('construction', 'like', "%{$search}%");
            })
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json([
            'data' => $rules->getCollection()->map(fn (GrammarRule $rule) => [
                'id' => $rule->id,
                'title' => $rule->title,
                'construction' => $rule->construction,
                'level_id' => $rule->level_id,
                'level' => $rule->level?->title,
                'form_id' => $rule->form_id,
                'form' => $rule->form?->title,
            ]),
            'meta' => [
                'current_page' => $rules->currentPage(),
                'last_page' => $rules->lastPage(),
                'total' => $rules->total(),
            ],
            'levels' => Level::orderBy('order')->get(['id', 'title']),
            'forms' => Form::orderBy('order')->get(['id', 'title']),
        ]);
    }

    public function storeGrammarRule(Request $request): JsonResponse
    {
        $data = $this->validateGrammarRule($request);
        $rule = GrammarRule::create($data);

        return response()->json(['data' => $rule], 201);
    }

    public function updateGrammarRule(Request $request, GrammarRule $grammarRule): JsonResponse
    {
        $data = $this->validateGrammarRule($request);
        $grammarRule->update($data);

        return response()->json(['data' => $grammarRule]);
    }

    public function destroyGrammarRule(GrammarRule $grammarRule): JsonResponse
    {
        $grammarRule->delete();
        return response()->json(['deleted' => true]);
    }

    private function validateGrammarRule(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:2000'],
            'construction' => ['required', 'string', 'max:2000'],
            'level_id' => ['nullable', 'integer', 'exists:levels,id'],
            'form_id' => ['nullable', 'integer', 'exists:forms,id'],
        ]);
    }

    public function libraryItems(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));
        $items = LibraryItem::query()
            ->when($search !== '', fn ($q) => $q->where('title', 'like', "%{$search}%"))
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json([
            'data' => $items->getCollection(),
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'total' => $items->total(),
            ],
        ]);
    }

    public function storeLibraryItem(Request $request): JsonResponse
    {
        $item = LibraryItem::create($this->validateLibraryItem($request));
        return response()->json(['data' => $item], 201);
    }

    public function updateLibraryItem(Request $request, LibraryItem $libraryItem): JsonResponse
    {
        $libraryItem->update($this->validateLibraryItem($request));
        return response()->json(['data' => $libraryItem]);
    }

    public function destroyLibraryItem(LibraryItem $libraryItem): JsonResponse
    {
        if ($libraryItem->file_path) {
            Storage::delete($libraryItem->file_path);
        }
        $libraryItem->delete();
        return response()->json(['deleted' => true]);
    }

    private function validateLibraryItem(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'author' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'in:' . implode(',', LibraryItem::TYPES)],
            'description' => ['nullable', 'string'],
            'cover_path' => ['nullable', 'string', 'max:255'],
            'file_path' => ['nullable', 'string', 'max:255'],
            'level' => ['nullable', 'string', 'max:32'],
            'language' => ['nullable', 'in:ko,ru,mixed'],
            'pages' => ['nullable', 'integer', 'min:0'],
            'year' => ['nullable', 'integer', 'min:0', 'max:2100'],
        ]);
    }

    public function tips(Request $request): JsonResponse
    {
        $type = $request->query('type');
        $tips = Tip::query()
            ->when(in_array($type, ['advice', 'fact'], true), fn ($q) => $q->where('type', $type))
            ->orderByDesc('id')
            ->paginate(30);

        return response()->json([
            'data' => $tips->getCollection(),
            'meta' => [
                'current_page' => $tips->currentPage(),
                'last_page' => $tips->lastPage(),
                'total' => $tips->total(),
            ],
        ]);
    }

    public function storeTip(Request $request): JsonResponse
    {
        $tip = Tip::create($this->validateTip($request));
        return response()->json(['data' => $tip], 201);
    }

    public function updateTip(Request $request, Tip $tip): JsonResponse
    {
        $tip->update($this->validateTip($request));
        return response()->json(['data' => $tip]);
    }

    public function destroyTip(Tip $tip): JsonResponse
    {
        $tip->delete();
        return response()->json(['deleted' => true]);
    }

    private function validateTip(Request $request): array
    {
        return $request->validate([
            'type' => ['required', 'in:advice,fact'],
            'content' => ['required', 'string', 'max:5000'],
        ]);
    }

    public function courseItems(): JsonResponse
    {
        return response()->json([
            'data' => CourseItem::orderBy('order')->get(['id', 'type', 'order', 'title', 'level_id']),
            'levels' => Level::orderBy('order')->get(['id', 'title']),
        ]);
    }

    public function updateCourseItem(Request $request, CourseItem $courseItem): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'order' => ['required', 'integer', 'min:1', 'unique:course_items,order,' . $courseItem->id],
            'level_id' => ['nullable', 'integer', 'exists:levels,id'],
        ]);

        $courseItem->update($data);
        return response()->json(['data' => $courseItem]);
    }

    public function achievements(): JsonResponse
    {
        return response()->json([
            'data' => Achievement::with('category')
                ->orderBy('category_id')
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    public function logs(): JsonResponse
    {
        $path = storage_path('logs/laravel.log');
        if (!is_file($path)) {
            return response()->json(['data' => []]);
        }

        $lines = array_slice(file($path, FILE_IGNORE_NEW_LINES) ?: [], -200);
        return response()->json(['data' => array_reverse($lines)]);
    }
}
