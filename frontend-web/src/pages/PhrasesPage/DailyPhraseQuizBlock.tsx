import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  getDailyPhraseQuiz,
  updateUserPhraseProgress,
  type DailyPhraseQuizResponse,
} from "../../api/dictionary";
import { useAuth } from "../../context/useAuth";
import type { TestQuestionChoose } from "../../utils/testGenerator";
import ChooseQuestion from "../ItemPage/LessonView/Test/ChooseQuestion";

const NEXT_DELAY = 1200;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuestion(data: DailyPhraseQuizResponse): TestQuestionChoose {
  const koToRu = Math.random() < 0.5;
  const allPhrases = [data.target, ...data.distractors];

  if (koToRu) {
    const shuffled = shuffle(allPhrases);
    return {
      type: "choose",
      id: `daily-phrase-${data.target.id}-ko-to-ru`,
      instruction: "Выберите перевод",
      prompt: data.target.hangul,
      promptAudio: data.target.hangul,
      variants: shuffled.map((p) => p.translation),
      correctIndices: [shuffled.findIndex((p) => p.id === data.target.id)],
    };
  }

  const shuffled = shuffle(allPhrases);
  return {
    type: "choose",
    id: `daily-phrase-${data.target.id}-ru-to-ko`,
    instruction: "Выберите, как это по-корейски",
    prompt: data.target.translation,
    promptAudio: null,
    variants: shuffled.map((p) => p.hangul),
    correctIndices: [shuffled.findIndex((p) => p.id === data.target.id)],
  };
}

interface DailyPhraseQuizBlockProps {
  disabled?: boolean;
  onAnswered?: () => void;
}

export function DailyPhraseQuizBlock({
  disabled = false,
  onAnswered,
}: DailyPhraseQuizBlockProps) {
  const { refreshUser } = useAuth();
  const [question, setQuestion] = useState<TestQuestionChoose | null>(null);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNext = useCallback(() => {
    setLoading(true);
    setSelected(null);
    setAnswered(false);

    getDailyPhraseQuiz()
      .then((data) => {
        setQuestion(buildQuestion(data));
        setTargetId(data.target.id);
      })
      .catch(() => {
        setQuestion(null);
        setTargetId(null);
      })
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

      const isCorrect = question.correctIndices.includes(index);

      if (isCorrect) {
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((best) => (next > best ? next : best));
          return next;
        });
      } else {
        setStreak(0);
      }

      if (targetId !== null) {
        updateUserPhraseProgress(targetId, isCorrect)
          .then(() => refreshUser())
          .then(() => onAnswered?.())
          .catch(() => {});
      }

      setTimeout(() => {
        loadNext();
      }, NEXT_DELAY);
    },
    [question, answered, targetId, loadNext, refreshUser, disabled, onAnswered],
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
          Недостаточно фраз для тренировки
        </p>
      )}

      {question && (
        <ChooseQuestion
          question={question}
          selectedIndex={selected}
          answered={answered}
          onSelect={handleSelect}
        />
      )}
    </aside>
  );
}
