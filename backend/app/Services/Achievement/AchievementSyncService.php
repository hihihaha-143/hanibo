<?php

namespace App\Services\Achievement;

use App\Models\Achievement\Achievement;
use App\Models\Achievement\UserAchievement;
use App\Models\Shop\UserItem;
use App\Models\User;
use App\Models\UserGrammarRule;
use App\Models\UserPhrase;
use App\Models\UserWord;

class AchievementSyncService
{
    /**
     * Проверяет прогресс по всем разделам и выдаёт новые достижения.
     *
     * Часть прогресса (курс, разборы, библиотека) хранится на клиенте,
     * поэтому приходит в payload. Серверные данные (SRS, магазин, streak)
     * считаются здесь.
     *
     * @param array<string, mixed> $data
     * @return array<int, array<string, mixed>>
     */
    public function sync(User $user, array $data): array
    {
        $codes = [];

        $lessons = $this->clampInt($data['course_lessons_completed'] ?? 0);
        $tests = $this->clampInt($data['course_tests_completed'] ?? 0);
        $perfectTests = $this->clampInt($data['course_tests_perfect'] ?? 0);
        $review = $this->clampInt($data['course_review_completed'] ?? 0);
        $errors = $this->clampInt($data['course_errors_completed'] ?? 0);
        $breakdownsStarted = $this->clampInt($data['breakdowns_started'] ?? 0);
        $breakdownsCompleted = $this->clampInt($data['breakdowns_completed'] ?? 0);
        $breakdownPhrases = $this->clampInt($data['breakdown_phrases_saved'] ?? 0);
        $libraryBooks = $this->clampInt($data['library_books_opened'] ?? 0);
        $profileVisits = $this->clampInt($data['profile_visits'] ?? 0);

        if ($lessons >= 1) $codes[] = 'course_first_lesson';
        if ($lessons >= 5) $codes[] = 'course_5_lessons';
        if ($lessons >= 10) $codes[] = 'course_10_lessons';
        if ($tests >= 1) $codes[] = 'course_first_test';
        if ($perfectTests >= 1) $codes[] = 'course_test_perfect';
        if ($review >= 1) $codes[] = 'course_review';
        if ($errors >= 1) $codes[] = 'course_errors';

        $words = UserWord::where('user_id', $user->id)->count();
        $phrases = UserPhrase::where('user_id', $user->id)->count();
        $grammar = UserGrammarRule::where('user_id', $user->id)->count();

        if ($words >= 1) $codes[] = 'practice_first_word';
        if ($words >= 10) $codes[] = 'practice_words_10';
        if ($words >= 100) $codes[] = 'practice_100_words';
        if ($phrases >= 10) $codes[] = 'practice_phrases_10';
        if ($grammar >= 5) $codes[] = 'practice_grammar_5';

        if ($breakdownsStarted >= 1) $codes[] = 'breakdown_first';
        if ($breakdownsStarted >= 3) $codes[] = 'breakdown_3';
        if ($breakdownsCompleted >= 1) $codes[] = 'breakdown_complete';
        if ($breakdownPhrases >= 5) $codes[] = 'breakdown_phrases_5';
        if ($breakdownPhrases >= 25) $codes[] = 'breakdown_phrases_25';

        if ($libraryBooks >= 1) $codes[] = 'library_first';
        if ($libraryBooks >= 3) $codes[] = 'library_3';
        if ($libraryBooks >= 10) $codes[] = 'library_10';

        $shopItems = UserItem::where('user_id', $user->id)->count();
        if ($shopItems >= 1) $codes[] = 'shop_first_purchase';
        if ($shopItems >= 5) $codes[] = 'shop_5_purchases';

        if (!empty($data['profile_visited'])) $codes[] = 'profile_first';
        if ($user->streak_best >= 7) $codes[] = 'streak_7';
        if ($user->streak_best >= 30) $codes[] = 'streak_30';
        if ($user->daily_exp_goal > 0 && $user->exp_today >= $user->daily_exp_goal) {
            $codes[] = 'daily_goal';
        }

        if (!empty($data['settings_visited'])) $codes[] = 'secret_settings';
        if ($profileVisits >= 10) $codes[] = 'secret_profile_10';
        if ($breakdownPhrases >= 50) $codes[] = 'secret_phrases_50';

        $hour = (int) now()->format('G');
        $visitedPrivate = !empty($data['settings_visited']) || !empty($data['profile_visited']);
        if ($visitedPrivate && $hour < 5) {
            $codes[] = 'secret_night';
        }

        return $this->unlock($user, $codes);
    }

    private function clampInt(mixed $value): int
    {
        return max(0, min(100000, (int) $value));
    }

    /**
     * @param string[] $codes
     * @return array<int, array<string, mixed>>
     */
    private function unlock(User $user, array $codes): array
    {
        $codes = array_values(array_unique(array_filter($codes)));
        if (empty($codes)) return [];

        $achievements = Achievement::whereIn('code', $codes)
            ->orderBy('sort_order')
            ->get();

        $alreadyUnlocked = UserAchievement::where('user_id', $user->id)
            ->whereIn('achievement_id', $achievements->pluck('id'))
            ->pluck('achievement_id')
            ->all();

        $newlyUnlocked = [];

        foreach ($achievements as $achievement) {
            if (in_array($achievement->id, $alreadyUnlocked, true)) continue;

            UserAchievement::create([
                'user_id' => $user->id,
                'achievement_id' => $achievement->id,
                'unlocked_at' => now(),
            ]);

            if ($achievement->blueberry_reward > 0) {
                $user->increment('blueberry', $achievement->blueberry_reward);
            }

            $newlyUnlocked[] = [
                'id' => $achievement->id,
                'code' => $achievement->code,
                'title' => $achievement->title,
                'description' => $achievement->description,
                'icon' => $achievement->icon,
                'image' => $achievement->image,
                'category_id' => $achievement->category_id,
                'is_hidden' => $achievement->is_hidden,
                'sort_order' => $achievement->sort_order,
                'blueberry_reward' => $achievement->blueberry_reward,
                'bonus_title' => null,
                'reward_shop_item' => null,
                'unlocked_at' => now()->toIso8601String(),
            ];
        }

        if (!empty($newlyUnlocked)) {
            $user->refresh();
        }

        return $newlyUnlocked;
    }
}
