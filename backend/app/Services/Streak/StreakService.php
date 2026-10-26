<?php

namespace App\Services\Streak;

use App\Models\User;
use Carbon\Carbon;

class StreakService
{
    /**
     * Начисляет опыт пользователю и обновляет стрик.
     * Возвращает информацию о стрике для ответа фронту.
     *
     * @return array{streak_current:int, streak_best:int, exp_today:int, daily_exp_goal:int, goal_reached:bool}
     */
    public function addExp(User $user, int $amount): array
    {
        if ($amount <= 0) {
            return $this->snapshot($user);
        }

        $tz = $user->timezone ?: 'UTC';
        $today = Carbon::now($tz)->toDateString();

        // --- сброс exp_today при смене дня ---
        if ($user->exp_today_date === null || $user->exp_today_date->toDateString() !== $today) {
            $user->exp_today = 0;
            $user->exp_today_date = $today;
        }

        $user->exp += $amount;
        $user->exp_today += $amount;

        $goalReached = $user->exp_today >= $user->daily_exp_goal;

        $lastStreakDate = $user->streak_last_date
            ? $user->streak_last_date->toDateString()
            : null;

        // Стрик уже продлён сегодня?
        $alreadyExtendedToday = $lastStreakDate === $today;

        if ($goalReached && !$alreadyExtendedToday) {
            if ($lastStreakDate === null) {
                // первый день вообще
                $user->streak_current = 1;
            } else {
                $lastDate = Carbon::parse($lastStreakDate, $tz);
                $todayDate = Carbon::parse($today, $tz);

                if ($lastDate->greaterThanOrEqualTo($todayDate)) {
                    // защита от «даты в будущем» (смена таймзоны, ручная правка):
                    // считаем, что сегодня ещё не продлевали — сбрасываем в 1.
                    $user->streak_current = 1;
                } else {
                    $yesterday = Carbon::now($tz)->subDay()->toDateString();

                    if ($lastStreakDate === $yesterday) {
                        // вчера был активен — продолжаем
                        $user->streak_current = ($user->streak_current ?? 0) + 1;
                    } else {
                        // пропуск: считаем, сколько дней пропущено (>= 1)
                        $missedDays = max(1, (int) $lastDate->diffInDays($todayDate) - 1);

                        $freezes = $user->streak_freezes ?? 0;

                        if ($freezes >= $missedDays) {
                            // заморозки спасают — стрик сохраняется
                            $user->streak_freezes = $freezes - $missedDays;
                        } else {
                            // сбрасываем стрик (но новый старт с 1)
                            $user->streak_current = 1;
                            $user->streak_freezes = 0;
                        }
                    }
                }
            }

            $user->streak_last_date = $today;

            $best = $user->streak_best ?? 0;
            if (($user->streak_current ?? 0) > $best) {
                $user->streak_best = $user->streak_current;
            }
        }

        if ($user->isDirty()) {
            $user->save();
        }

        return $this->snapshot($user);
    }

    /**
     * @return array{streak_current:int, streak_best:int, exp_today:int, daily_exp_goal:int, goal_reached:bool}
     */
    private function snapshot(User $user): array
    {
        return [
            'streak_current' => $user->streak_current ?? 0,
            'streak_best' => $user->streak_best ?? 0,
            'exp_today' => $user->exp_today ?? 0,
            'daily_exp_goal' => $user->daily_exp_goal ?? 150,
            'goal_reached' => ($user->exp_today ?? 0) >= ($user->daily_exp_goal ?? 150),
        ];
    }
}