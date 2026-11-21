import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  getGrammarRules,
  reviewGrammarRule,
  type GrammarRule,
} from "../../api/grammar";
import { useAuth } from "../../context/useAuth";

const NEXT_DELAY = 1200;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface DailyGrammarQuizBlockProps {
  disabled?: boolean;
  onAnswered?: () => void;
}

interface Question {
  target: GrammarRule;
  variants: string[];
  correctIndex: number;
}

function buildQuestion(all: GrammarRule[]): Question | null {
  if (all.length < 4) return null;
  const shuffled = shuffle(all);
  const target = shuffled[0];
  const distractors = shuffled.slice(1, 4);

  const variants = shuffle([target, ...distractors]).map((r) => r.construction);
  const correctIndex = variants.indexOf(target.construction);

  return { target, variants, correctIndex };
}

export function DailyGrammarQuizBlock({
  disabled = false,
  onAnswered,
}: DailyGrammarQuizBlockProps) {
  const { refreshUser } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNext = useCallback(() => {
    setLoading(true);
    setSelected(null);
    setAnswered(false);
    getGrammarRules({ tab: "all", per_page: 200 })
      .then((res) => setQuestion(buildQuestion(res.data)))
      .catch(() => setQuestion(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadNext();
  }, [loadNext]);

  const handleSelect = useCallback(
    (index: number) => {
      if (!question || answered || disabled) return;
      setSelected(index);
      setAnswered(true);

      const isCorrect = index === question.correctIndex;
      if (isCorrect) {
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((best) => (next > best ? next : best));
          return next;
        });
      } else {
        setStreak(0);
      }

      reviewGrammarRule(question.target.id, isCorrect)
        .then(() => refreshUser())
        .then(() => onAnswered?.())
        .catch(() => {});

      setTimeout(() => loadNext(), NEXT_DELAY);
    },
    [question, answered, disabled, loadNext, refreshUser, onAnswered],
  );

  useHotkeys(
    ["1", "2", "3", "4"],
    (e) => {
      const idx = Number(e.key) - 1;
      if (idx < 4) handleSelect(idx);
    },
    {
      enabled: !!question && !answered && !disabled,
      preventDefault: true,
    },
    [question, answered, handleSelect, disabled],
  );

  return (
    <aside className="daily-quiz-block">
      <div className="daily-quiz-block__head">
        <span className="daily-quiz-block__title">Тренировка</span>
        <span className="daily-quiz-block__streak">
          Серия: {streak}
          {bestStreak > streak && (
            <span className="daily-quiz-block__best">
              {" "}
              · рекорд {bestStreak}
            </span>
          )}
        </span>
      </div>

      {loading && !question && (
        <p className="daily-quiz-block__state">Загрузка…</p>
      )}

      {!loading && !question && (
        <p className="daily-quiz-block__state">
          Недостаточно правил для тренировки
        </p>
      )}

      {question && (
        <div className="choose-question">
          <p className="choose-question__instruction">
            Выберите конструкцию для правила
          </p>
          <div className="choose-question__prompt">
            <span className="choose-question__prompt-text">
              {question.target.title}
            </span>
          </div>
          <div className="choose-question__variants">
            {question.variants.map((v, i) => {
              const isSelected = selected === i;
              const isCorrect = i === question.correctIndex;
              const cls =
                "choose-question__variant" +
                (answered && isCorrect
                  ? " choose-question__variant--correct"
                  : "") +
                (answered && isSelected && !isCorrect
                  ? " choose-question__variant--wrong"
                  : "");
              return (
                <button
                  key={v + i}
                  type="button"
                  className={cls}
                  onClick={() => handleSelect(i)}
                  disabled={answered || disabled}
                >
                  <span className="choose-question__variant-key">{i + 1}</span>
                  <span>{v}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
