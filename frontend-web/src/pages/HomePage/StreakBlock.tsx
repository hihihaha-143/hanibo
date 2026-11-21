import { Link } from "react-router-dom";
import { Check, Flame, Snowflake, Trophy } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import {
  STREAK_MILESTONES,
  STREAK_MILESTONE_PREVIEW,
  STREAK_MILESTONE_REWARD_LABEL,
} from "../../lib/streakMilestones";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function pluralDays(value: number): string {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дня";
  return "дней";
}

export default function StreakBlock() {
  const { user } = useAuth();

  if (!user) return null;

  const current = user.streak_current ?? 0;
  const best = user.streak_best ?? 0;
  const freezes = user.streak_freezes ?? 0;
  const claimed = Math.max(user.streak_milestone_claimed ?? 0, 0);

  const today = startOfDay(new Date());
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const lastStreakDay = user.streak_last_date
    ? startOfDay(new Date(user.streak_last_date))
    : null;

  const streakStart = lastStreakDay ? new Date(lastStreakDay) : null;
  if (streakStart && current > 0) {
    streakStart.setDate(streakStart.getDate() - (current - 1));
  }

  const week = WEEKDAYS.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    const isToday = sameDay(date, today);
    const isFuture = date.getTime() > today.getTime();
    const inStreak =
      Boolean(streakStart && lastStreakDay) &&
      date.getTime() >= streakStart!.getTime() &&
      date.getTime() <= lastStreakDay!.getTime();
    const done = inStreak && !isFuture;
    const frozen = isToday && Boolean(user.streak_frozen_today) && !done;

    return { label, date, isToday, isFuture, done, frozen };
  });

  const dailyGoal = user.daily_exp_goal || 1;
  const expToday = user.exp_today ?? 0;
  const goalPercent = Math.min(
    100,
    Math.max(0, Math.round((expToday / dailyGoal) * 100)),
  );
  const goalReached = expToday >= dailyGoal;

  const nextMilestone =
    STREAK_MILESTONES.find((milestone) => milestone > claimed) ?? null;
  const previousMilestone =
    [...STREAK_MILESTONES]
      .reverse()
      .find((milestone) => milestone <= claimed) ?? 0;

  const milestonePercent = nextMilestone
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((current - previousMilestone) /
              (nextMilestone - previousMilestone)) *
              100,
          ),
        ),
      )
    : 100;

  const daysToReward = nextMilestone
    ? Math.max(0, nextMilestone - current)
    : 0;

  return (
    <section className="streak-block" aria-label="Серия дней">
      <div className="streak-block__top">
        <span className="streak-block__flame" aria-hidden="true">
          <Flame size={28} />
        </span>

        <div className="streak-block__title-wrap">
          <span className="streak-block__eyebrow">Серия</span>
          <p className="streak-block__count">
            {current} <span>{pluralDays(current)}</span>
          </p>
        </div>

        <div className="streak-block__badges">
          <span className="streak-block__badge" title="Заморозки">
            <Snowflake size={14} aria-hidden="true" />
            {freezes}
          </span>
          <span className="streak-block__badge" title="Лучшая серия">
            <Trophy size={14} aria-hidden="true" />
            {best}
          </span>
        </div>
      </div>

      <div className="streak-block__week" role="list" aria-label="Дни недели">
        {week.map((day) => {
          const className =
            "streak-block__day" +
            (day.isToday ? " streak-block__day--today" : "") +
            (day.done ? " streak-block__day--done" : "") +
            (day.frozen ? " streak-block__day--frozen" : "") +
            (day.isFuture ? " streak-block__day--future" : "");

          return (
            <div
              key={day.label}
              className={className}
              role="listitem"
              aria-label={`${day.label}, ${day.done ? "выполнено" : day.frozen ? "заморозка" : "нет отметки"}`}
            >
              <span className="streak-block__day-name">{day.label}</span>
              <span className="streak-block__day-dot" aria-hidden="true">
                {day.done ? (
                  <Check size={14} strokeWidth={3} />
                ) : day.frozen ? (
                  <Snowflake size={14} />
                ) : null}
              </span>
            </div>
          );
        })}
      </div>

      <div className="streak-block__goal">
        <div className="streak-block__goal-head">
          <span>Опыт сегодня</span>
          <strong>
            {expToday} / {dailyGoal}
          </strong>
        </div>
        <div
          className="streak-block__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={goalPercent}
          aria-label="Дневная цель по опыту"
        >
          <span style={{ width: `${goalPercent}%` }} />
        </div>
        <div className="streak-block__goal-foot">
          <span>
            {goalReached
              ? "Цель выполнена"
              : `Ещё ${dailyGoal - expToday} опыта`}
          </span>
          <span>{goalPercent}%</span>
        </div>
      </div>

      <div className="streak-block__milestones">
        <div className="streak-block__milestones-head">
          <span>Награды</span>
          {nextMilestone ? (
            <span className="streak-block__next">
              {daysToReward > 0
                ? `До подарка ${daysToReward} ${pluralDays(daysToReward)}`
                : "Подарок уже заработан"}
            </span>
          ) : (
            <span className="streak-block__next">Все милстоуны пройдены</span>
          )}
        </div>

        <div className="streak-block__milestone-list">
          {STREAK_MILESTONE_PREVIEW.map((milestone) => {
            const isDone = milestone <= claimed;
            const isNext = milestone === nextMilestone;
            return (
              <span
                key={milestone}
                className={
                  "streak-block__milestone" +
                  (isDone ? " streak-block__milestone--done" : "") +
                  (isNext ? " streak-block__milestone--next" : "")
                }
                title={`${milestone} дней — ${STREAK_MILESTONE_REWARD_LABEL}`}
              >
                {milestone}
              </span>
            );
          })}
        </div>

        {nextMilestone && (
          <div className="streak-block__reward">
            <span>
              {nextMilestone} {pluralDays(nextMilestone)}
            </span>
            <strong>
              <Snowflake size={14} aria-hidden="true" />
              {STREAK_MILESTONE_REWARD_LABEL}
            </strong>
          </div>
        )}

        <div className="streak-block__milestone-bar" aria-hidden="true">
          <span style={{ width: `${milestonePercent}%` }} />
        </div>
      </div>

      <Link
        to="/practice"
        className="btn btn--accent btn--block streak-block__cta"
      >
        Продолжить
      </Link>
    </section>
  );
}
