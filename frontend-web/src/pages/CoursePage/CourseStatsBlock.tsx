import { useCallback, useEffect, useMemo, useState } from "react";
import { Flame, GraduationCap, Snowflake, Sparkles } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { getCourseItems, type CourseItem } from "../../api/course";
import {
  calculateCourseStatuses,
  type ItemWithStatus,
} from "../../utils/courseStatus";
import { getTestProgress, PASS_THRESHOLD } from "../../utils/progress";
import { calculateLanguageLevel } from "../../utils/languageLevel";
import StateBlock from "../../components/StateBlock/StateBlock";
import { Link } from "react-router-dom";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card course-stats__stat">
      <span className="course-stats__stat-label">{label}</span>
      <strong className="course-stats__stat-value">{value}</strong>
      {hint && <span className="course-stats__stat-hint">{hint}</span>}
    </div>
  );
}

export default function CourseStatsBlock() {
  const { user } = useAuth();
  const [items, setItems] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setItems(await getCourseItems());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) load();
    else setLoading(false);
  }, [user, load]);

  const statuses = useMemo<ItemWithStatus[]>(
    () => calculateCourseStatuses(items),
    [items],
  );

  const stats = useMemo(() => {
    const lessons = statuses.filter((entry) => entry.item.type === "lesson");
    const tests = statuses.filter((entry) => entry.item.type === "test");
    const completedLessons = lessons.filter(
      (entry) => entry.status === "complete",
    ).length;
    const testScores = tests
      .map((entry) => getTestProgress(entry.item.id).percent)
      .filter((percent) => percent > 0);
    const averageTestPercent = testScores.length
      ? Math.round(
          testScores.reduce((sum, percent) => sum + percent, 0) /
            testScores.length,
        )
      : 0;
    const completedTests = tests.filter(
      (entry) => getTestProgress(entry.item.id).percent >= PASS_THRESHOLD,
    ).length;

    const level = calculateLanguageLevel({
      learnedWords: user?.words_learned ?? 0,
      learnedPhrases: user?.phrases_learned ?? 0,
      learnedGrammar: user?.grammar_learned ?? 0,
      completedLessons,
      completedTests,
      averageTestPercent,
    });

    return {
      lessonsTotal: lessons.length,
      completedLessons,
      testsTotal: tests.length,
      completedTests,
      averageTestPercent,
      level,
      coursePercent:
        lessons.length > 0
          ? Math.round((completedLessons / lessons.length) * 100)
          : 0,
    };
  }, [statuses, user]);

  if (!user) {
    return (
      <div className="course-tab-empty">
        <Sparkles size={28} aria-hidden="true" />
        <p>Войдите, чтобы увидеть личную статистику и уровень языка.</p>
        <Link to="/login" className="btn btn--accent">
          Войти
        </Link>
      </div>
    );
  }

  if (loading) return <StateBlock variant="loading" />;
  if (error) return <StateBlock variant="error" onRetry={load} />;

  return (
    <div className="course-stats">
      <section className="card course-stats__level">
        <div className="course-stats__level-head">
          <div>
            <span className="course-stats__eyebrow">Уровень языка</span>
            <p className="course-stats__level-title">
              <strong>{stats.level.code}</strong>
              <span>{stats.level.label}</span>
            </p>
          </div>
          <GraduationCap size={34} aria-hidden="true" />
        </div>

        <div className="course-stats__bar" aria-hidden="true">
          <span style={{ width: `${stats.level.progress}%` }} />
        </div>

        <p className="course-stats__level-hint">
          {stats.level.next
            ? `До ${stats.level.next.code} · ${stats.level.next.label}: ${Math.max(
                0,
                stats.level.next.min - stats.level.score,
              )} баллов прогресса`
            : "Максимальный уровень по текущей шкале"}
        </p>
        <p className="course-stats__formula">
          Считается по изученным словам, фразам, грамматике, урокам и тестам.
        </p>
      </section>

      <div className="course-stats__grid">
        <StatCard
          label="Уроки"
          value={`${stats.completedLessons} / ${stats.lessonsTotal}`}
          hint={`${stats.coursePercent}% курса`}
        />
        <StatCard
          label="Тесты"
          value={`${stats.completedTests} / ${stats.testsTotal}`}
          hint={`Порог ${PASS_THRESHOLD}%`}
        />
        <StatCard
          label="Средний тест"
          value={stats.averageTestPercent ? `${stats.averageTestPercent}%` : "—"}
          hint="По пройденным тестам"
        />
        <StatCard
          label="Изучено"
          value={
            (user.words_learned ?? 0) +
            (user.phrases_learned ?? 0) +
            (user.grammar_learned ?? 0)
          }
          hint={`${user.words_learned ?? 0} слов · ${user.phrases_learned ?? 0} фраз · ${user.grammar_learned ?? 0} правил`}
        />
      </div>

      <section className="card course-stats__streak">
        <div>
          <span className="course-stats__eyebrow">Серия</span>
          <strong>
            <Flame size={18} aria-hidden="true" />
            {user.streak_current ?? 0} дней
          </strong>
          <span className="course-stats__stat-hint">
            Рекорд: {user.streak_best ?? 0}
          </span>
        </div>
        <div>
          <span className="course-stats__eyebrow">Заморозки</span>
          <strong>
            <Snowflake size={18} aria-hidden="true" />
            {user.streak_freezes ?? 0}
          </strong>
          <span className="course-stats__stat-hint">
            Автоматически сохраняют серию
          </span>
        </div>
      </section>
    </div>
  );
}
