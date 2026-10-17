import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCourseTestData,
  type CourseItemDetails,
  type CourseItemWord,
  type GrammarRule,
  type PhraseGrammarRule,
} from "../../../api/course";
import {
  generateCourseTest,
  type TestQuestion,
} from "../../../utils/testGenerator";
import { setTestPercent } from "../../../utils/progress";
import Test from "../LessonView/Test/Test";
import StateBlock from "../../../components/StateBlock/StateBlock";

interface CourseTestViewProps {
  item: CourseItemDetails;
}

export default function CourseTestView({ item }: CourseTestViewProps) {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<TestQuestion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [rawWords, setRawWords] = useState<CourseItemWord[]>([]);
  const [rawGrammar, setRawGrammar] = useState<GrammarRule[]>([]);
  const [rawPool, setRawPool] = useState<PhraseGrammarRule[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await getCourseTestData(item.id);

        if (cancelled) return;

        setRawWords(data.words);
        setRawGrammar(data.grammar);
        setRawPool(data.pool);

        setQuestions(generateCourseTest(data.words, data.grammar, data.pool));
      } catch (e) {
        console.error("Не удалось загрузить тест курса:", e);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [item.id]);

  const handleFinish = (correct: number, total: number, _isPassed: boolean) => {
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    setTestPercent(item.id, percent);
  };

  const handleRepeat = useCallback(() => {
    if (rawWords.length === 0 && rawGrammar.length === 0) return;
    setQuestions(generateCourseTest(rawWords, rawGrammar, rawPool));
  }, [rawWords, rawGrammar, rawPool]);

  const handleBack = () => {
    navigate("/course");
  };

  const handleNext = () => {
    if (item.next) {
      navigate(`/course/item/${item.next.id}`);
    }
  };

  if (loading) {
    return <StateBlock variant="loading" />;
  }

  if (error) {
    return <StateBlock variant="error" />;
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="item-page item-page--locked">
        <p>Тест пока недоступен.</p>
        <Link to="/course" className="item-page__back">
          ← Назад к курсу
        </Link>
      </div>
    );
  }

  return (
    <Test
      questions={questions}
      onFinish={handleFinish}
      onRepeat={handleRepeat}
      onBack={handleBack}
      backLabel="В курс"
      onNext={item.next ? handleNext : undefined}
      nextLabel={item.next ? item.next.title : undefined}
    />
  );
}
