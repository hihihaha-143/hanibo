import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BookOpen,
  Clapperboard,
  Flame,
  GraduationCap,
  Library,
  MessageCircle,
  Settings,
  Snowflake,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useAchievements } from "../../context/useAchievements";
import { getCourseItems } from "../../api/course";
import { getAlphabet } from "../../api/alphabet";
import { calculateCourseStatuses } from "../../utils/courseStatus";
import { getTestProgress, PASS_THRESHOLD } from "../../utils/progress";
import { calculateLanguageLevel } from "../../utils/languageLevel";
import { getProgress, getSavedPhrases } from "../BreakdownsPage/breakdownStorage";
import { readRecent } from "../../lib/libraryRecent";
import { getUserAvatarUrl, resolveShopImage } from "../../lib/shopImages";
import AchievementIcon from "../../components/AchievementIcon/AchievementIcon";
import ChipsBlock from "../../components/ChipsBlock/ChipsBlock";
import NotificationBell from "../../components/NotificationBell/NotificationBell";
import SettingsPage from "../SettingsPage/SettingsPage";

interface CourseSummary {
  lessonsTotal: number;
  lessonsCompleted: number;
  testsTotal: number;
  testsCompleted: number;
  averageTest: number;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

const PROFILE_TABS = [
  { id: "profile", label: "Профиль" },
  { id: "settings", label: "Настройки" },
];

type ProfileTab = "profile" | "settings";

export default function ProfilePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: ProfileTab =
    searchParams.get("tab") === "settings" ? "settings" : "profile";
  const {
    categories,
    loading: achievementsLoading,
    refresh: refreshAchievements,
  } = useAchievements();
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [alphabetMastered, setAlphabetMastered] = useState<number | null>(null);

  useEffect(() => {
    void refreshAchievements();
  }, [refreshAchievements]);

  useEffect(() => {
    let active = true;

    getCourseItems()
      .then((items) => {
        if (!active) return;
        const statuses = calculateCourseStatuses(items);
        const lessons = statuses.filter((entry) => entry.item.type === "lesson");
        const tests = statuses.filter((entry) => entry.item.type === "test");
        const testScores = tests
          .map((entry) => getTestProgress(entry.item.id).percent)
          .filter((percent) => percent > 0);

        setCourse({
          lessonsTotal: lessons.length,
          lessonsCompleted: lessons.filter(
            (entry) => entry.status === "complete",
          ).length,
          testsTotal: tests.length,
          testsCompleted: tests.filter(
            (entry) =>
              getTestProgress(entry.item.id).percent >= PASS_THRESHOLD,
          ).length,
          averageTest: testScores.length
            ? Math.round(
                testScores.reduce((sum, percent) => sum + percent, 0) /
                  testScores.length,
              )
            : 0,
        });
      })
      .catch(() => {
        if (active) setCourse(null);
      });

    getAlphabet()
      .then((letters) => {
        if (active) {
          setAlphabetMastered(
            letters.filter((letter) => letter.progress.score >= 10).length,
          );
        }
      })
      .catch(() => {
        if (active) setAlphabetMastered(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const owner = user ? String(user.id) : "guest";
  const breakdowns = useMemo(() => {
    const progress = Object.values(getProgress(owner));
    return {
      started: progress.filter(
        (entry) => entry.page > 0 || entry.episode > 0 || entry.completed,
      ).length,
      completed: progress.filter((entry) => entry.completed).length,
      phrases: getSavedPhrases(owner).length,
    };
  }, [owner]);

  const level = calculateLanguageLevel({
    learnedWords: user?.words_learned ?? 0,
    learnedPhrases: user?.phrases_learned ?? 0,
    learnedGrammar: user?.grammar_learned ?? 0,
    completedLessons: course?.lessonsCompleted ?? 0,
    completedTests: course?.testsCompleted ?? 0,
    averageTestPercent: course?.averageTest ?? 0,
  });

  const allAchievements = categories.flatMap((category) => category.achievements);
  const unlockedCount = allAchievements.filter((item) => item.unlocked).length;
  const secretCount = allAchievements.filter((item) => item.is_hidden).length;
  const achievementPercent = allAchievements.length
    ? Math.round((unlockedCount / allAchievements.length) * 100)
    : 0;
  const previewAchievements = [
    ...allAchievements.filter((item) => item.unlocked),
    ...allAchievements.filter((item) => !item.unlocked && !item.is_hidden),
  ].slice(0, 6);

  if (!user) {
    return <div className="page profile-page" />;
  }

  const handleTabChange = (tab: string) => {
    const next = new URLSearchParams(searchParams);
    if (tab === "profile") next.delete("tab");
    else next.set("tab", tab);
    setSearchParams(next, { replace: false });
  };

  const avatarUrl = getUserAvatarUrl(user);
  const frameUrl = resolveShopImage(user.selected_frame?.image);
  const bannerUrl = resolveShopImage(user.selected_banner?.image);
  const nicknameColor = user.selected_nickname_color?.color ?? undefined;
  const expPercent = user.daily_exp_goal
    ? Math.min(100, Math.round((user.exp_today / user.daily_exp_goal) * 100))
    : 0;

  return (
    <div className="page profile-page">
      <header className="page__header profile-page__header">
        <div>
          <h1 className="page__title">
            {activeTab === "settings" ? "Настройки" : "Профиль"}
          </h1>
          <p className="profile-page__subtitle">
            {activeTab === "settings"
              ? "Аккаунт, внешний вид, обучение и безопасность"
              : "Статистика, прогресс и достижения"}
          </p>
        </div>
        <NotificationBell />
      </header>

      <ChipsBlock
        tabs={PROFILE_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        layoutId="profile-chip-highlight"
      />

      {activeTab === "settings" ? (
        <SettingsPage embedded />
      ) : (
        <>
      <header
        className="profile-hero"
        style={
          bannerUrl
            ? {
                backgroundImage: `linear-gradient(90deg, rgba(16,18,30,.88), rgba(16,18,30,.45)), url(${bannerUrl})`,
              }
            : undefined
        }
      >
        <div className="profile-hero__avatar-wrap">
          {avatarUrl ? (
            <img
              className="profile-hero__avatar"
              src={avatarUrl}
              alt={user.nickname}
            />
          ) : (
            <span className="profile-hero__avatar profile-hero__avatar--placeholder">
              {user.nickname.charAt(0).toUpperCase()}
            </span>
          )}
          {frameUrl && (
            <img
              className="profile-hero__frame"
              src={frameUrl}
              alt={user.selected_frame?.title ?? "Рамка"}
            />
          )}
        </div>

        <div className="profile-hero__info">
          {user.selected_title && (
            <span className="profile-hero__title">{user.selected_title.title}</span>
          )}
          <h1 style={nicknameColor ? { color: nicknameColor } : undefined}>
            {user.nickname}
          </h1>
          <p className="profile-hero__email">{user.email}</p>
          <Link
            to="/profile?tab=settings"
            className="profile-hero__settings-link"
          >
            <Settings size={14} />
            Настройки
          </Link>
          <div className="profile-hero__badges">
            <span>{level.code} · {level.label}</span>
            {user.selected_status && (
              <span>{user.selected_status.text || user.selected_status.title}</span>
            )}
            <span>с {formatDate(user.created_at)}</span>
          </div>
        </div>

        <div className="profile-hero__goal">
          <span className="profile-hero__goal-label">Цель дня</span>
          <strong>
            {user.exp_today} / {user.daily_exp_goal} XP
          </strong>
          <div className="profile-hero__goal-bar" aria-hidden="true">
            <span style={{ width: `${expPercent}%` }} />
          </div>
          <span className="profile-hero__goal-hint">
            {user.goal_reached ? "Цель выполнена" : "Ещё немного до цели"}
          </span>
        </div>
      </header>

      <section className="profile-stats">
        <StatCard
          icon={<GraduationCap size={20} />}
          label="Уровень языка"
          value={level.code}
          hint={level.label}
        />
        <StatCard
          icon={<Flame size={20} />}
          label="Серия"
          value={`${user.streak_current} дн.`}
          hint={`Рекорд: ${user.streak_best}`}
        />
        <StatCard
          icon={<Trophy size={20} />}
          label="Достижения"
          value={`${unlockedCount}`}
          hint={`${achievementPercent}% от всех`}
        />
        <StatCard
          icon={<Snowflake size={20} />}
          label="Заморозки"
          value={`${user.streak_freezes}`}
          hint="Спасают серию"
        />
      </section>

      <div className="profile-columns">
        <section className="card profile-block">
          <div className="profile-block__head">
            <h2>Знания</h2>
            <Link to="/course?tab=stats" className="profile-block__link">
              Курс
            </Link>
          </div>
          <div className="profile-knowledge">
            <KnowledgeRow label="Слова" learned={user.words_learned} learning={user.words_learning} />
            <KnowledgeRow label="Фразы" learned={user.phrases_learned} learning={user.phrases_learning} />
            <KnowledgeRow label="Грамматика" learned={user.grammar_learned} learning={user.grammar_learning} />
            <div className="profile-knowledge__row">
              <span>Алфавит</span>
              <strong>
                {alphabetMastered === null
                  ? "—"
                  : `${alphabetMastered} / 45`}
              </strong>
              <span className="profile-knowledge__hint">букв на 10/10</span>
            </div>
          </div>
        </section>

        <section className="card profile-block">
          <div className="profile-block__head">
            <h2>Прогресс</h2>
          </div>
          <div className="profile-progress">
            <ProgressRow
              icon={<BookOpen size={17} />}
              label="Курс"
              value={`${course?.lessonsCompleted ?? 0} / ${course?.lessonsTotal ?? 0}`}
              hint={`Пройдено уроков · средний тест ${course?.averageTest ?? 0}%`}
            />
            <ProgressRow
              icon={<Clapperboard size={17} />}
              label="Разборы"
              value={`${breakdowns.completed} / ${breakdowns.started}`}
              hint={`Завершено · ${breakdowns.phrases} фраз сохранено`}
            />
            <ProgressRow
              icon={<Library size={17} />}
              label="Библиотека"
              value={`${readRecent().length}`}
              hint="книг открыто"
            />
            <ProgressRow
              icon={<MessageCircle size={17} />}
              label="Опыт"
              value={`${user.exp}`}
              hint={`${user.blueberry} черники · ${user.strawberry} клубники`}
            />
          </div>
        </section>
      </div>

      <section
        className="profile-achievements"
        id="achievements"
        aria-labelledby="profile-achievements-title"
      >
        <div className="profile-achievements__head">
          <div>
            <h2 id="profile-achievements-title">Достижения</h2>
            <p>
              {unlockedCount} из {allAchievements.length} · {secretCount} секретных
            </p>
          </div>
          <div className="profile-achievements__head-actions">
            <span className="profile-achievements__percent">
              {achievementPercent}%
            </span>
            <Link to="/achievements" className="profile-block__link">
              Все достижения
            </Link>
          </div>
        </div>

        <div className="profile-achievements__bar" aria-hidden="true">
          <span style={{ width: `${achievementPercent}%` }} />
        </div>

        {achievementsLoading ? (
          <p className="profile-achievements__empty">Загружаем достижения…</p>
        ) : previewAchievements.length === 0 ? (
          <p className="profile-achievements__empty">
            Достижения появятся после первого действия.
          </p>
        ) : (
          <div className="profile-achievement-grid profile-achievements__preview">
            {previewAchievements.map((achievement) => (
              <article
                key={achievement.id}
                className={
                  "profile-achievement" +
                  (achievement.unlocked
                    ? " profile-achievement--unlocked"
                    : "")
                }
              >
                <span className="profile-achievement__icon">
                  <AchievementIcon name={achievement.icon} size={20} />
                </span>
                <div className="profile-achievement__body">
                  <strong>{achievement.title}</strong>
                  <p>{achievement.description}</p>
                  <span className="profile-achievement__reward">
                    {achievement.unlocked
                      ? "Получено"
                      : `Награда: +${achievement.blueberry_reward} черники`}
                  </span>
                </div>
                {achievement.unlocked && <CheckCircleIcon />}
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="profile-note">
        <Sparkles size={14} aria-hidden="true" />
        Статистика курса и разборов хранится на этом устройстве; SRS, серия,
        магазин и достижения синхронизируются с аккаунтом.
      </p>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="card profile-stat">
      <span className="profile-stat__icon">{icon}</span>
      <span className="profile-stat__label">{label}</span>
      <strong className="profile-stat__value">{value}</strong>
      <span className="profile-stat__hint">{hint}</span>
    </div>
  );
}

function KnowledgeRow({
  label,
  learned,
  learning,
}: {
  label: string;
  learned: number;
  learning: number;
}) {
  const total = learned + learning;
  const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
  return (
    <div className="profile-knowledge__row">
      <span>{label}</span>
      <strong>{learned}</strong>
      <span className="profile-knowledge__hint">
        изучено · {learning} в процессе
      </span>
      <span className="profile-knowledge__bar" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </span>
    </div>
  );
}

function ProgressRow({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="profile-progress__row">
      <span className="profile-progress__icon">{icon}</span>
      <span className="profile-progress__text">
        <strong>{label}</strong>
        <span>{hint}</span>
      </span>
      <span className="profile-progress__value">{value}</span>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <span className="profile-achievement__check" aria-label="Получено">
      ✓
    </span>
  );
}
