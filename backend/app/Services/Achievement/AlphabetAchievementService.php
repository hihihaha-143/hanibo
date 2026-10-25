<?php

namespace App\Services\Achievement;

use App\Models\Achievement\Achievement;
use App\Models\Achievement\Title;
use App\Models\Achievement\UserAchievement;
use App\Models\Achievement\UserTitle;
use App\Models\AlphabetLetter;
use App\Models\AlphabetProgress;
use App\Models\User;

class AlphabetAchievementService
{
    public function checkAfterSingle(User $user, AlphabetLetter $letter, array $result): array
    {
        $toUnlock = [];

        if (!$this->hasAnyAchievement($user)) {
            $toUnlock[] = 'first_test';
        }

        if ($result['reached_max']) {
            $toUnlock[] = 'first_letter';
        }

        if ($result['percent'] === 100) {
            $toUnlock[] = 'perfect_letter';
        }

        if ($result['correct'] === 0 && $result['total'] > 0) {
            $toUnlock[] = 'all_wrong';
        }

        $this->checkTestsCount($user, $toUnlock);

        $progress = AlphabetProgress::where('user_id', $user->id)
            ->where('letter_id', $letter->id)
            ->first();
        if ($progress) {
            if ($progress->attempts >= 10) $toUnlock[] = 'attempts_10';
            if ($progress->attempts >= 50) $toUnlock[] = 'attempts_50';
            if ($progress->attempts >= 20) $toUnlock[] = 'one_letter_fan';
            if ($progress->mistakes >= 10) $toUnlock[] = 'mistakes_10';
            if ($progress->mistakes >= 50) $toUnlock[] = 'mistakes_50';
        }

        $this->checkTotalMistakes($user, $toUnlock);
        $this->checkTimeOfDay($toUnlock);
        $this->checkCategoriesMastered($user, $toUnlock);

        return $this->unlock($user, $toUnlock);
    }

    public function checkAfterGroup(User $user, string $category, array $lettersResult, array $groupResult): array
    {
        $toUnlock = [];

        if (!$this->hasAnyAchievement($user)) {
            $toUnlock[] = 'first_test';
        }

        if ($groupResult['percent'] === 100) {
            $toUnlock[] = 'first_group';
            $toUnlock[] = 'perfect_group';
        }

        if ($category === 'all' && $groupResult['percent'] === 100) {
            $toUnlock[] = 'perfect_all';
        }

        if ($category === 'all') {
            $toUnlock[] = 'first_all';
        }

        $reachedCount = count(array_filter($lettersResult, fn ($l) => $l['reached_max']));
        if ($reachedCount >= 1) $toUnlock[] = 'first_letter';
        if ($reachedCount >= 2) $toUnlock[] = 'double_confetti';
        if ($reachedCount >= 3) $toUnlock[] = 'triple_confetti';

        if ($groupResult['percent'] === 0 && count($lettersResult) > 0) {
            $toUnlock[] = 'all_wrong';
        }

        $this->checkTestsCount($user, $toUnlock);

        foreach ($lettersResult as $l) {
            if ($l['attempts'] >= 10) $toUnlock[] = 'attempts_10';
            if ($l['attempts'] >= 50) $toUnlock[] = 'attempts_50';
            if ($l['attempts'] >= 20) $toUnlock[] = 'one_letter_fan';
            if ($l['mistakes'] >= 10) $toUnlock[] = 'mistakes_10';
            if ($l['mistakes'] >= 50) $toUnlock[] = 'mistakes_50';
        }

        $this->checkTotalMistakes($user, $toUnlock);
        $this->checkTimeOfDay($toUnlock);
        $this->checkCategoriesMastered($user, $toUnlock);

        return $this->unlock($user, $toUnlock);
    }

    private function hasAnyAchievement(User $user): bool
    {
        return UserAchievement::where('user_id', $user->id)->exists();
    }

    private function checkTestsCount(User $user, array &$toUnlock): void
    {
        $totalAttempts = AlphabetProgress::where('user_id', $user->id)->sum('attempts');
        if ($totalAttempts >= 10) $toUnlock[] = 'tests_10';
        if ($totalAttempts >= 50) $toUnlock[] = 'tests_50';
        if ($totalAttempts >= 100) $toUnlock[] = 'tests_100';
        if ($totalAttempts >= 500) $toUnlock[] = 'tests_500';
    }

    private function checkTotalMistakes(User $user, array &$toUnlock): void
    {
        $totalMistakes = AlphabetProgress::where('user_id', $user->id)->sum('mistakes');
        if ($totalMistakes >= 100) $toUnlock[] = 'mistake_100';
        if ($totalMistakes >= 1000) $toUnlock[] = 'mistake_1000';
    }

    private function checkTimeOfDay(array &$toUnlock): void
    {
        $hour = (int) now()->format('G');
        if ($hour >= 0 && $hour < 5) $toUnlock[] = 'night_owl';
        if ($hour >= 5 && $hour < 8) $toUnlock[] = 'early_bird';
    }

    private function checkCategoriesMastered(User $user, array &$toUnlock): void
    {
        $categories = [
            'vowel' => 'all_vowels',
            'consonant' => 'all_consonants',
            'diphthong' => 'all_diphthongs',
            'assimilation' => 'all_assimilation',
        ];

        foreach ($categories as $cat => $code) {
            $total = AlphabetLetter::where('category', $cat)->count();
            if ($total === 0) continue;

            $mastered = AlphabetProgress::where('user_id', $user->id)
                ->whereHas('letter', fn ($q) => $q->where('category', $cat))
                ->where('score', '>=', 10)
                ->count();

            if ($mastered >= $total) {
                $toUnlock[] = $code;
            }
        }

        $totalAll = AlphabetLetter::count();
        if ($totalAll > 0) {
            $masteredAll = AlphabetProgress::where('user_id', $user->id)
                ->where('score', '>=', 10)
                ->count();
            if ($masteredAll >= $totalAll) {
                $toUnlock[] = 'all_alphabet';
            }
        }
    }

    /**
     * @param string[] $codes
     * @return array<int, array<string, mixed>>
     */
    private function unlock(User $user, array $codes): array
    {
        $codes = array_unique(array_filter($codes));
        if (empty($codes)) return [];

        $achievements = Achievement::whereIn('code', $codes)->get();

        $alreadyUnlocked = UserAchievement::where('user_id', $user->id)
            ->whereIn('achievement_id', $achievements->pluck('id'))
            ->pluck('achievement_id')
            ->toArray();

        $newlyUnlocked = [];

        foreach ($achievements as $achievement) {
            if (in_array($achievement->id, $alreadyUnlocked)) continue;

            UserAchievement::create([
                'user_id' => $user->id,
                'achievement_id' => $achievement->id,
                'unlocked_at' => now(),
            ]);

            if ($achievement->blueberry_reward > 0) {
                $user->increment('blueberry', $achievement->blueberry_reward);
            }

            $bonusTitle = null;

            if ($achievement->code === 'all_alphabet') {
                $bonusTitle = $this->grantTitle($user, 'know_alphabet');
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
                'bonus_title' => $bonusTitle,
            ];
        }

        $user->refresh();

        return $newlyUnlocked;
    }

    /**
     * @return array{id:int, code:string, title:string}|null
     */
    private function grantTitle(User $user, string $code): ?array
    {
        $title = Title::where('code', $code)->first();
        if (!$title) return null;

        $exists = UserTitle::where('user_id', $user->id)
            ->where('title_id', $title->id)
            ->exists();

        if (!$exists) {
            UserTitle::create([
                'user_id' => $user->id,
                'title_id' => $title->id,
                'unlocked_at' => now(),
            ]);
        }

        if (!$user->selected_title_id) {
            $user->selected_title_id = $title->id;
            $user->save();
        }

        return [
            'id' => $title->id,
            'code' => $title->code,
            'title' => $title->title,
        ];
    }
}