<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Achievement\AchievementCategory;
use App\Models\Achievement\UserAchievement;
use App\Services\Achievement\AchievementSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $unlocked = UserAchievement::where('user_id', $user->id)
            ->get()
            ->keyBy('achievement_id');

        $categories = AchievementCategory::with([
            'achievements' => fn ($query) => $query->orderBy('sort_order')->orderBy('id'),
        ])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(function (AchievementCategory $category) use ($unlocked) {
                $achievements = $category->achievements
                    ->values()
                    ->map(function ($achievement) use ($unlocked) {
                        $entry = $unlocked->get($achievement->id);

                        $isUnlocked = $entry !== null;
                        $isSecret = $achievement->is_hidden && !$isUnlocked;

                        return [
                            'id' => $achievement->id,
                            'code' => $achievement->code,
                            'title' => $isSecret ? 'Секретное достижение' : $achievement->title,
                            'description' => $isSecret
                                ? 'Условие скрыто. Но оно того стоит.'
                                : $achievement->description,
                            'icon' => $isSecret ? 'lock' : $achievement->icon,
                            'image' => $achievement->image,
                            'category_id' => $achievement->category_id,
                            'is_hidden' => $achievement->is_hidden,
                            'sort_order' => $achievement->sort_order,
                            'blueberry_reward' => $achievement->blueberry_reward,
                            'unlocked' => $entry !== null,
                            'unlocked_at' => $entry?->unlocked_at?->toIso8601String(),
                        ];
                    });

                return [
                    'id' => $category->id,
                    'code' => $category->code,
                    'title' => $category->title,
                    'achievements' => $achievements,
                ];
            });

        return response()->json(['data' => $categories]);
    }

    public function sync(
        Request $request,
        AchievementSyncService $service,
    ): JsonResponse {
        $data = $request->validate([
            'course_lessons_completed' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'course_tests_completed' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'course_tests_perfect' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'course_review_completed' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'course_errors_completed' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'breakdowns_started' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'breakdowns_completed' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'breakdown_phrases_saved' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'library_books_opened' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'profile_visited' => ['sometimes', 'boolean'],
            'settings_visited' => ['sometimes', 'boolean'],
            'profile_visits' => ['sometimes', 'integer', 'min:0', 'max:100000'],
        ]);

        $user = $request->user();
        $unlocked = $service->sync($user, $data);

        return response()->json([
            'unlocked_achievements' => $unlocked,
            'user' => new UserResource($user->refresh()),
        ]);
    }
}
