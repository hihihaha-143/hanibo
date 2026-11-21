import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCourseItemGrammar,
  getCourseItemWords,
  getCourseItems,
  type CourseItemWord,
  type GrammarRule,
  type PhraseGrammarRule,
} from "../../api/course";
import { getDictionary } from "../../api/dictionary";
import { getGrammarRules } from "../../api/grammar";
import { calculateCourseStatuses } from "../../utils/courseStatus";
import {
  generateCourseTest,
  type TestQuestion,
} from "../../utils/testGenerator";
import Test from "../ItemPage/LessonView/Test/Test";
import StateBlock from "../../components/StateBlock/StateBlock";

interface CourseTrainingPageProps {
  mode: "review" | "errors";
}

interface Content {
  words: CourseItemWord[];
  grammar: GrammarRule[];
  pool: PhraseGrammarRule[];
  emptyReason: string | null;
}

const REVIEW_LESSONS = 4;

async function loadLessonContent(lessonIds: number[]): Promise<Content> {
  const responses = await Promise.all(
    lessonIds.map(async (id) => {
      const [words, grammar] = await Promise.all([
        getCourseItemWords(id),
        getCourseItemGrammar(id),
      ]);
      return {
        words: words.words,
        grammar: grammar.grammar,
        pool: grammar.pool,
      };
    }),
  );

  const wordMap = new Map<number, CourseItemWord>();
  const grammarMap = new Map<number, GrammarRule>();
  const poolMap = new Map<number, PhraseGrammarRule>();

  for (const response of responses) {
    for (const word of response.words) wordMap.set(word.id, word);
    for (const rule of response.grammar) grammarMap.set(rule.id, rule);
    for (const rule of response.pool) poolMap.set(rule.id, rule);
  }

  return {
    words: [...wordMap.values()],
    grammar: [...grammarMap.values()],
    pool: [...poolMap.values()],
    emptyReason: null,
  };
}

export default function CourseTrainingPage({ mode }: CourseTrainingPageProps) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<TestQuestion[] | null>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isReview = mode === "review";

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    setQuestions(null);

    try {
      const items = await getCourseItems();
      const statuses = calculateCourseStatuses(items);
      const startedLessons = statuses
        .filter(
          (entry) =>
            entry.item.type === "lesson" &&
            (entry.status === "partial" || entry.status === "complete"),
        )
        .map((entry) => entry.item.id);

      if (startedLessons.length === 0) {
        setContent({
          words: [],
          grammar: [],
          pool: [],
          emptyReason: isReview
            ? "Повторение появится после первого пройденного урока."
            : "Пока нет ошибок: пройдите урок или тренировку.",
        });
        return;
      }

      const lessonIds = isReview
        ? startedLessons.slice(-REVIEW_LESSONS)
        : startedLessons;

      const base = await loadLessonContent(lessonIds);

      if (!isReview) {
        const [dictionary, grammar] = await Promise.all([
          getDictionary({ tab: "all", per_page: 200 }),
          getGrammarRules({ tab: "all", per_page: 200 }),
        ]);

        const mistakeWordIds = new Set(
          dictionary.data
            .filter((word) => (word.progress?.mistakes_count ?? 0) > 0)
            .map((word) => word.id),
        );
        const mistakeGrammarIds = new Set(
          grammar.data
            .filter((rule) => (rule.mistakes_count ?? 0) > 0)
            .map((rule) => rule.id),
        );

        base.words = base.words.filter((word) =>
          mistakeWordIds.has(word.id),
        );
        base.grammar = base.grammar.filter((rule) =>
          mistakeGrammarIds.has(rule.id),
        );

        if (base.words.length === 0 && base.grammar.length === 0) {
          base.emptyReason =
            "Ошибок в словах и грамматике пока нет. Ошибки из фраз появятся в следующей версии.";
        }
      }

      setContent(base);

      if (base.emptyReason) {
        setQuestions([]);
      } else {
        setQuestions(generateCourseTest(base.words, base.grammar, base.pool));
      }
    } catch (e) {
      console.error("Не удалось собрать тренировку курса:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [isReview]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRepeat = () => {
    if (!content || content.emptyReason) return;
    setQuestions(
      generateCourseTest(content.words, content.grammar, content.pool),
    );
  };

  if (loading) {
    return (
      <div className="page course-training-page">
        <StateBlock variant="loading" text="Собираем задания…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page course-training-page">
        <StateBlock
          variant="error"
          text="Не удалось собрать задания."
          onRetry={load}
        />
      </div>
    );
  }

  if (!content || content.emptyReason || !questions || questions.length === 0) {
    return (
      <div className="page course-training-page">
        <header className="page__header course-training-page__header">
          <h1 className="page__title">
            {isReview ? "Повторение" : "Работа над ошибками"}
          </h1>
        </header>
        <StateBlock
          variant="empty"
          text={
            content?.emptyReason ??
            "Недостаточно материалов для тренировки."
          }
        />
      </div>
    );
  }

  return (
    <div className="page course-training-page">
      <header className="page__header course-training-page__header">
        <h1 className="page__title">
          {isReview ? "Повторение" : "Работа над ошибками"}
        </h1>
        <p className="course-training-page__subtitle">
          {isReview
            ? "Задания по последним пройденным урокам."
            : "Задания по словам и грамматике, где были ошибки."}
        </p>
      </header>

      <Test
        questions={questions}
        onFinish={() => {}}
        onRepeat={handleRepeat}
        onBack={() => navigate("/course")}
        backLabel="К курсу"
      />
    </div>
  );
}
