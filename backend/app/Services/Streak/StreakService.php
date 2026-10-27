<?php

namespace App\Services\Streak;

use App\Models\User;
use Carbon\Carbon;

class StreakService
{
    public function addExp(User $user, int $amount): array
    {
        $tz = $user->timezone ?: 'UTC';
        $today = Carbon::now($tz)->toDateString();

        if ($user->exp_today_date === null || $user->exp_today_date->toDateString() !== $today) {
            $user->exp_today = 0;
            $user->exp_today_date = $today;
        }

        if ($amount > 0) {
            $user->exp += $amount;
            $user->exp_today += $amount;
        }

        $goalReached = $user->exp_today >= $user->daily_exp_goal;

        $lastStreakDate = $user->streak_last_date
            ? $user->streak_last_date->toDateString()
            : null;

        $alreadyExtendedToday = $lastStreakDate === $today;

        $freezeUsed = false;
        $freezesUsed = 0;
        $streakReset = false;

        if ($goalReached && !$alreadyExtendedToday) {
            [$freezeUsed, $freezesUsed, $streakReset] = $this->extendStreak(
                $user,
                $lastStreakDate,
                $today,
                $tz,
            );

            if ($freezeUsed) {
                $user->streak_frozen_date = $today;
            }
        }

        if ($user->isDirty()) {
            $user->save();
        }

        return $this->snapshot($user, $freezeUsed, $freezesUsed, $streakReset);
    }

    public function refreshStreak(User $user): array
    {
        $tz = $user->timezone ?: 'UTC';
        $today = Carbon::now($tz)->toDateString();
        $yesterday = Carbon::now($tz)->subDay()->toDateString();

        $result = [
            'freeze_used' => false,
            'freezes_used' => 0,
            'streak_reset' => false,
        ];

        if ($user->streak_last_date === null) {
            return $result;
        }

        $lastDate = $user->streak_last_date->toDateString();

        if ($lastDate === $today || $lastDate === $yesterday) {
            return $result;
        }

        $lastCarbon = Carbon::parse($lastDate, $tz);
        $todayCarbon = Carbon::parse($today, $tz);
        $missedDays = (int) $lastCarbon->diffInDays($todayCarbon) - 1;

        if ($missedDays <= 0) {
            return $result;
        }

        $freezes = $user->streak_freezes ?? 0;

        if ($freezes >= $missedDays) {
            $user->streak_freezes = $freezes - $missedDays;
            $user->streak_last_date = $yesterday;
            $user->streak_frozen_date = $today;
            $user->save();

            $result['freeze_used'] = true;
            $result['freezes_used'] = $missedDays;

            return $result;
        }

        if (($user->streak_current ?? 0) > 0) {
            $user->streak_current = 0;
            $user->streak_rewards_claimed = 0;
            $user->streak_last_date = null;
            $user->save();

            $result['streak_reset'] = true;
        }

        return $result;
    }

    private function extendStreak(
        User $user,
        ?string $lastStreakDate,
        string $today,
        string $tz,
    ): array {
        if ($lastStreakDate === null) {
            $user->streak_current = 1;
            $user->streak_last_date = $today;
            $this->updateBest($user);
            $this->rewardFreeze($user);
            $this->rewardBerries($user);

            return [false, 0, false];
        }

        $yesterday = Carbon::now($tz)->subDay()->toDateString();

        if ($lastStreakDate === $yesterday) {
            $user->streak_current = ($user->streak_current ?? 0) + 1;
            $user->streak_last_date = $today;
            $this->updateBest($user);
            $this->rewardFreeze($user);
            $this->rewardBerries($user);

            return [false, 0, false];
        }

        $lastDate = Carbon::parse($lastStreakDate, $tz);
        $todayDate = Carbon::parse($today, $tz);
        $missedDays = max(0, (int) $lastDate->diffInDays($todayDate) - 1);

        $freezes = $user->streak_freezes ?? 0;

        if ($missedDays > 0 && $freezes >= $missedDays) {
            $user->streak_freezes = $freezes - $missedDays;
            $user->streak_last_date = $today;

            return [true, $missedDays, false];
        }

        $resetHappened = ($user->streak_current ?? 0) > 0;

        $user->streak_current = 1;
        $user->streak_rewards_claimed = 0;
        $user->streak_last_date = $today;
        $this->updateBest($user);

        return [false, 0, $resetHappened];
    }

    private function updateBest(User $user): void
    {
        $best = $user->streak_best ?? 0;
        if (($user->streak_current ?? 0) > $best) {
            $user->streak_best = $user->streak_current;
        }
    }

    private function rewardFreeze(User $user): void
    {
        $current = $user->streak_current ?? 0;

        if ($current > 0 && $current % 7 === 0) {
            $user->streak_freezes = ($user->streak_freezes ?? 0) + 1;
        }
    }

    private function rewardBerries(User $user): void
    {
        $current = $user->streak_current ?? 0;

        if ($current <= 0 || $current % 5 !== 0) {
            return;
        }

        $claimed = $user->streak_rewards_claimed ?? 0;

        if ($current <= $claimed) {
            return;
        }

        $amount = intdiv($current, 5);

        $user->strawberry = ($user->strawberry ?? 0) + $amount;
        $user->blueberry = ($user->blueberry ?? 0) + $amount;
        $user->streak_rewards_claimed = $current;
    }

    private function snapshot(
        User $user,
        bool $freezeUsed = false,
        int $freezesUsed = 0,
        bool $streakReset = false,
    ): array {
        $tz = $user->timezone ?: 'UTC';
        $today = Carbon::now($tz)->toDateString();

        return [
            'streak_current' => $user->streak_current ?? 0,
            'streak_best' => $user->streak_best ?? 0,
            'exp_today' => $user->exp_today ?? 0,
            'daily_exp_goal' => $user->daily_exp_goal ?? 150,
            'goal_reached' => ($user->exp_today ?? 0) >= ($user->daily_exp_goal ?? 150),
            'streak_extended_today' => $user->streak_last_date
                && $user->streak_last_date->toDateString() === $today,
            'streak_frozen_today' => $user->streak_frozen_date
                && $user->streak_frozen_date->toDateString() === $today,
            'streak_freezes' => $user->streak_freezes ?? 0,
            'freeze_used' => $freezeUsed,
            'freezes_used' => $freezesUsed,
            'streak_reset' => $streakReset,
        ];
    }
}