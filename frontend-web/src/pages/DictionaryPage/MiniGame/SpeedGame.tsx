import { useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ArrowLeft, Timer } from "lucide-react";
import {
  getSpeed,
  postReward,
  type AudioChooseWord,
} from "../../../api/minigames";
import { updateUserWordProgress } from "../../../api/dictionary";
import { useAuth } from "../../../context/useAuth";

const TOTAL_QUESTIONS = 10;
const QUESTION_TIME_MS = 3000;
const NEXT_DELAY = 700;

type Phase = "playing" | "result" | "loading";

interface AnswerRecord {
  correct: boolean;
}

interface QuestionState {
  target: AudioChooseWord;
  variants: AudioChooseWord[];
  correctIndex: number;
}

interface SpeedGameProps {
  onClose: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function SpeedGame({ onClose }: SpeedGameProps) {
  const { refreshUser } = useAuth();

  const [phase, setPhase] = useState<Phase>("loading");
  const [question, setQuestion] = useState<QuestionState | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [reward, setReward] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME_MS);

  const timerRef = useRef<number | null>(null);
  const answeredRef = useRef(false);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const loadQuestion = useCallback(() => {
    setSelected(null);
    setAnswered(false);
    answeredRef.current = false;
    setTimeLeft(QUESTION_TIME_MS);

    getSpeed()
      .then((data) => {
        const all = shuffle([data.target, ...data.distractors]);
        const correctIndex = all.findIndex((w) => w.id === data.target.id);
        setQuestion({ target: data.target, variants: all, correctIndex });
        setPhase("playing");
      })
      .catch(() => {
        setQuestion(null);
        setPhase("result");
      });
  }, []);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  const finishGame = useCallback(
    async (allAnswers: AnswerRecord[]) => {
      setPhase("result");
      const correct = allAnswers.filter((a) => a.correct).length;

      try {
        const res = await postReward(correct, allAnswers.length);
        setReward(res.reward);
        await refreshUser();
      } catch {
        setReward(0);
      }
    },
    [refreshUser],
  );

  const proceedToNext = useCallback(
    (nextAnswers: AnswerRecord[]) => {
      setTimeout(() => {
        if (nextAnswers.length >= TOTAL_QUESTIONS) {
          finishGame(nextAnswers);
        } else {
          setIndex((i) => i + 1);
          loadQuestion();
        }
      }, NEXT_DELAY);
    },
    [finishGame, loadQuestion],
  );

  const handleAnswer = useCallback(
    (chosenIndex: number | null) => {
      if (!question || answeredRef.current) return;
      answeredRef.current = true;
      stopTimer();

      setAnswered(true);
      if (chosenIndex !== null) setSelected(chosenIndex);

      const isCorrect =
        chosenIndex !== null && chosenIndex === question.correctIndex;

      const nextAnswers = [...answers, { correct: isCorrect }];
      setAnswers(nextAnswers);

      updateUserWordProgress(question.target.id, isCorrect).catch(() => {});

      proceedToNext(nextAnswers);
    },
    [question, answers, stopTimer, proceedToNext],
  );

  // Таймер на вопрос
  useEffect(() => {
    if (phase !== "playing" || !question || answeredRef.current) return;

    stopTimer();
    const startedAt = Date.now();

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const remaining = QUESTION_TIME_MS - elapsed;

      if (remaining <= 0) {
        stopTimer();
        setTimeLeft(0);
        handleAnswer(null); // таймаут — считается ошибкой
      } else {
        setTimeLeft(remaining);
      }
    }, 50);

    return () => {
      stopTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, phase]);

  useHotkeys(
    ["1", "2", "3", "4"],
    (e) => {
      const idx = Number(e.key) - 1;
      if (idx < 4) handleAnswer(idx);
    },
    {
      enabled: phase === "playing" && !answered,
      preventDefault: true,
    },
    [handleAnswer, phase, answered],
  );

  const restart = useCallback(() => {
    setAnswers([]);
    setIndex(0);
    setReward(null);
    setPhase("loading");
    loadQuestion();
  }, [loadQuestion]);

  const timePercent = (timeLeft / QUESTION_TIME_MS) * 100;
  const timerColor =
    timeLeft > QUESTION_TIME_MS * 0.5
      ? "var(--color-success)"
      : timeLeft > QUESTION_TIME_MS * 0.25
        ? "var(--color-warning)"
        : "var(--color-error)";

  return (
    <div className="speed-game">
      <header className="speed-game__header">
        <button type="button" className="speed-game__back" onClick={onClose}>
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>
        <h2 className="speed-game__title">Скорость</h2>
        {phase === "playing" && (
          <span className="speed-game__progress">
            {index + 1} / {TOTAL_QUESTIONS}
          </span>
        )}
      </header>

      {phase === "loading" && <p className="speed-game__state">Загрузка…</p>}

      {phase === "playing" && question && (
        <div className="speed-game__body">
          <div className="speed-game__timer">
            <div className="speed-game__timer-icon">
              <Timer size={18} />
            </div>
            <div className="speed-game__timer-bar">
              <div
                className="speed-game__timer-fill"
                style={{
                  width: `${timePercent}%`,
                  backgroundColor: timerColor,
                }}
              />
            </div>
          </div>

          <div className="speed-game__prompt-wrap">
            <p className="speed-game__hangul">{question.target.hangul}</p>
          </div>

          <div className="speed-game__variants">
            {question.variants.map((variant, i) => {
              const isCorrect = i === question.correctIndex;
              let modifier = "";
              if (answered) {
                if (isCorrect) modifier = "speed-game__variant--correct";
                else if (i === selected)
                  modifier = "speed-game__variant--wrong";
              }
              return (
                <button
                  key={variant.id}
                  type="button"
                  className={`speed-game__variant ${modifier}`}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                >
                  <span className="speed-game__variant-key">{i + 1}</span>
                  <span className="speed-game__variant-text">
                    {variant.translation}
                  </span>
                </button>
              );
            })}
          </div>

          {answered && selected === null && (
            <p className="speed-game__timeout">Время вышло!</p>
          )}
        </div>
      )}

      {phase === "result" && (
        <div className="speed-game__result">
          <p className="speed-game__result-score">
            {answers.filter((a) => a.correct).length} / {answers.length}
          </p>
          <p className="speed-game__result-percent">
            {answers.length > 0
              ? Math.round(
                  (answers.filter((a) => a.correct).length / answers.length) *
                    100,
                )
              : 0}
            %
          </p>
          {reward !== null && (
            <p className="speed-game__result-reward">
              {reward > 0 ? `+${reward} черники` : "Без награды"}
            </p>
          )}

          <div className="speed-game__result-actions">
            <button type="button" className="btn btn--accent" onClick={restart}>
              Ещё раз
            </button>
            <button
              type="button"
              className="btn btn--outline"
              onClick={onClose}
            >
              К списку игр
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
