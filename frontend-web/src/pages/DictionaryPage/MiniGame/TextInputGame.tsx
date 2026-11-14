import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  getTextInput,
  postReward,
  type TextInputQuestion,
} from "../../../api/minigames";
import { updateUserWordProgress } from "../../../api/dictionary";
import { useAuth } from "../../../context/useAuth";
import { checkTextAnswer } from "../../../utils/test/shared";

const TOTAL_QUESTIONS = 10;
const NEXT_DELAY = 1500;

type Phase = "playing" | "result" | "loading";

interface AnswerRecord {
  correct: boolean;
}

interface TextInputGameProps {
  onClose: () => void;
}

export function TextInputGame({ onClose }: TextInputGameProps) {
  const { refreshUser } = useAuth();

  const [phase, setPhase] = useState<Phase>("loading");
  const [question, setQuestion] = useState<TextInputQuestion | null>(null);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [reward, setReward] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const loadQuestion = useCallback(() => {
    setValue("");
    setAnswered(false);
    setIsCorrect(null);

    getTextInput()
      .then((q) => {
        setQuestion(q);
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

  useEffect(() => {
    if (phase === "playing" && question && !answered) {
      inputRef.current?.focus();
    }
  }, [phase, question, answered]);

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

  const handleSubmit = useCallback(() => {
    if (!question || answered || value.trim() === "") return;

    const correct = checkTextAnswer(value, question.hangul);
    setAnswered(true);
    setIsCorrect(correct);

    const nextAnswers = [...answers, { correct }];
    setAnswers(nextAnswers);

    updateUserWordProgress(question.word_id, correct).catch(() => {});

    setTimeout(() => {
      if (nextAnswers.length >= TOTAL_QUESTIONS) {
        finishGame(nextAnswers);
      } else {
        setIndex((i) => i + 1);
        loadQuestion();
      }
    }, NEXT_DELAY);
  }, [question, answered, value, answers, finishGame, loadQuestion]);

  const restart = useCallback(() => {
    setAnswers([]);
    setIndex(0);
    setReward(null);
    setPhase("loading");
    loadQuestion();
  }, [loadQuestion]);

  return (
    <div className="text-input-game">
      <header className="text-input-game__header">
        <button
          type="button"
          className="text-input-game__back"
          onClick={onClose}
        >
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>
        <h2 className="text-input-game__title">Ввод слова</h2>
        {phase === "playing" && (
          <span className="text-input-game__progress">
            {index + 1} / {TOTAL_QUESTIONS}
          </span>
        )}
      </header>

      {phase === "loading" && (
        <p className="text-input-game__state">Загрузка…</p>
      )}

      {phase === "playing" && question && (
        <div className="text-input-game__body">
          <div className="text-input-game__prompt-wrap">
            <p className="text-input-game__instruction">Напишите по-корейски</p>
            <p className="text-input-game__translation">
              {question.translation}
            </p>
          </div>

          <form
            className="text-input-game__form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите хангыль…"
              className={
                "text-input-game__input" +
                (answered
                  ? isCorrect
                    ? " text-input-game__input--correct"
                    : " text-input-game__input--wrong"
                  : "")
              }
              disabled={answered}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <button
              type="submit"
              className="btn btn--accent text-input-game__submit"
              disabled={answered || value.trim() === ""}
            >
              Проверить
            </button>
          </form>

          {answered && (
            <p
              className={
                "text-input-game__answer" +
                (isCorrect
                  ? " text-input-game__answer--correct"
                  : " text-input-game__answer--wrong")
              }
            >
              {isCorrect ? "Верно!" : "Правильно:"}{" "}
              <strong>{question.hangul}</strong>
            </p>
          )}
        </div>
      )}

      {phase === "result" && (
        <div className="text-input-game__result">
          <p className="text-input-game__result-score">
            {answers.filter((a) => a.correct).length} / {answers.length}
          </p>
          <p className="text-input-game__result-percent">
            {answers.length > 0
              ? Math.round(
                  (answers.filter((a) => a.correct).length / answers.length) *
                    100,
                )
              : 0}
            %
          </p>
          {reward !== null && (
            <p className="text-input-game__result-reward">
              {reward > 0 ? `+${reward} черники` : "Без награды"}
            </p>
          )}

          <div className="text-input-game__result-actions">
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
