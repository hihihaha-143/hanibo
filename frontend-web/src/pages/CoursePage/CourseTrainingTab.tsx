import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, ArrowRight, LogIn, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getCourseItems } from "../../api/course";
import { getDictionary, getPhrases } from "../../api/dictionary";
import { getGrammarRules } from "../../api/grammar";
import { calculateCourseStatuses } from "../../utils/courseStatus";
import StateBlock from "../../components/StateBlock/StateBlock";

interface TrainingStats {
  startedLessons: number;
  mistakeWords: number;
  mistakeGrammar: number;
  mistakePhrases: number;
}

function plural(value: number, one: string, few: string, many: string): string {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export default function CourseTrainingTab() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TrainingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const items = await getCourseItems();
      const statuses = calculateCourseStatuses(items);
      const startedLessons = statuses.filter(
        (entry) =>
          entry.item.type === "lesson" &&
          (entry.status === "partial" || entry.status === "complete"),
      ).length;

      if (!user) {
        setStats({
          startedLessons,
          mistakeWords: 0,
          mistakeGrammar: 0,
          mistakePhrases: 0,
        });
        return;
      }

      const [dictionary, phrases, grammar] = await Promise.all([
        getDictionary({ tab: "all", per_page: 100 }),
        getPhrases({ tab: "all", per_page: 100 }),
        getGrammarRules({ tab: "all", per_page: 200 }),
      ]);

      setStats({
        startedLessons,
        mistakeWords: dictionary.data.filter(
          (word) => (word.progress?.mistakes_count ?? 0) > 0,
        ).length,
        mistakePhrases: phrases.data.filter(
          (phrase) => (phrase.progress?.mistakes_count ?? 0) > 0,
        ).length,
        mistakeGrammar: grammar.data.filter(
          (rule) => (rule.mistakes_count ?? 0) > 0,
        ).length,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <StateBlock variant="loading" />;
  if (error || !stats) {
    return <StateBlock variant="error" onRetry={load} />;
  }

  const reviewAvailable = stats.startedLessons > 0;
  const errorsAvailable =
    Boolean(user) && stats.mistakeWords + stats.mistakeGrammar > 0;

  const reviewMeta = reviewAvailable
    ? `${stats.startedLessons} ${plural(
        stats.startedLessons,
        "урок",
        "урока",
        "уроков",
      )} с прогрессом`
    : "Сначала пройди хотя бы один урок";

  const mistakesMeta = user
    ? `${stats.mistakeWords} ${plural(
        stats.mistakeWords,
        "слово",
        "слова",
        "слов",
      )} · ${stats.mistakeGrammar} ${plural(
        stats.mistakeGrammar,
        "правило",
        "правила",
        "правил",
      )} с ошибками`
    : "Войди, чтобы собирать ошибки";

  return (
    <div className="course-training-tab">
      <p className="course-training-tab__intro">
        Короткие персональные тренировки. Контент собирается из пройденных
        уроков и твоих ошибок, поэтому со временем он меняется.
      </p>

      <div className="course-training-tab__grid">
        <TrainingCard
          to="/course/review"
          available={reviewAvailable}
          icon={<RotateCcw size={22} />}
          tone="review"
          title="Повторение"
          description="Слова и грамматика из последних пройденных уроков."
          meta={reviewMeta}
        />

        <TrainingCard
          to="/course/errors"
          available={errorsAvailable}
          icon={<AlertTriangle size={22} />}
          tone="errors"
          title="Работа над ошибками"
          description="Слова и грамматика, где были ошибки в тренировках и тестах."
          meta={mistakesMeta}
          disabledText={
            !user
              ? "Войди, чтобы собрать ошибки"
              : "Ошибок пока нет — так держать"
          }
          action={
            !user ? (
              <Link to="/login" className="btn btn--ghost btn--sm">
                <LogIn size={14} />
                Войти
              </Link>
            ) : undefined
          }
        />
      </div>

      {stats.mistakePhrases > 0 && (
        <p className="course-training-tab__note">
          Ещё {stats.mistakePhrases}{" "}
          {plural(stats.mistakePhrases, "фраза", "фразы", "фраз")} с ошибками
          видны в «Моём словаре». Фразовые ошибки пока не входят в тренажёр.
        </p>
      )}
    </div>
  );
}

function TrainingCard({
  to,
  available,
  icon,
  tone,
  title,
  description,
  meta,
  disabledText,
  action,
}: {
  to: string;
  available: boolean;
  icon: ReactNode;
  tone: "review" | "errors";
  title: string;
  description: string;
  meta: string;
  disabledText?: string;
  action?: ReactNode;
}) {
  const content = (
    <>
      <span className={`course-training-tab__icon course-training-tab__icon--${tone}`}>
        {icon}
      </span>
      <span className="course-training-tab__body">
        <strong>{title}</strong>
        <span>{description}</span>
        <span className="course-training-tab__meta">
          {available ? meta : (disabledText ?? meta)}
        </span>
      </span>
      {available ? (
        <ArrowRight size={18} className="course-training-tab__arrow" />
      ) : (
        action
      )}
    </>
  );

  if (!available) {
    return (
      <div className="card course-training-tab__card course-training-tab__card--disabled">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`card course-training-tab__card course-training-tab__card--${tone}`}
    >
      {content}
    </Link>
  );
}
