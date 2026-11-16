import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ArrowLeft, Check, X } from "lucide-react";
import {
  getPhraseTrueFalse,
  postReward,
  type PhraseTrueFalseQuestion,
} from "../../../api/minigames";
import { updateUserPhraseProgress } from "../../../api/dictionary";
import { useAuth } from "../../../context/useAuth";

const TOTAL_QUESTIONS = 10;
const NEXT_DELAY = 700;

type Phase = "playing" | "result" | "loading";

interface AnswerRecord {
  correct: boolean;
}

interface PhraseTrueFalseGameProps {
  onClose: () => void;
}

export function PhraseTrueFalseGame({ onClose }: PhraseTrueFalseGameProps) {
  const { refreshUser } = useAuth();

  const [phase, setPhase] = useState<Phase>("loading");
  const [question, setQuestion] = useState<PhraseTrueFalseQuestion | null>(
    null,
  );
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [reward, setReward] = useState<number | null>(null);

  const loadQuestion = useCallback(() => {
    setPicked(null);
    getPhraseTrueFalse()
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

  const handleAnswer = useCallback(
    (userSaysTrue: boolean) => {
      if (!question || picked !== null) return;

      setPicked(userSaysTrue);

      const isCorrect = userSaysTrue === question.is_correct;
      const nextAnswers = [...answers, { correct: isCorrect }];
      setAnswers(nextAnswers);

      updateUserPhraseProgress(question.phrase_id, isCorrect).catch(() => {});

      setTimeout(() => {
        if (nextAnswers.length >= TOTAL_QUESTIONS) {
          finishGame(nextAnswers);
        } else {
          setIndex((i) => i + 1);
          loadQuestion();
        }
      }, NEXT_DELAY);
    },
    [question, picked, answers, finishGame, loadQuestion],
  );

  useHotkeys(
    ["1"],
    () => handleAnswer(true),
    { enabled: phase === "playing" && picked === null, preventDefault: true },
    [handleAnswer, phase, picked],
  );

  useHotkeys(
    ["2"],
    () => handleAnswer(false),
    { enabled: phase === "playing" && picked === null, preventDefault: true },
    [handleAnswer, phase, picked],
  );

  const restart = useCallback(() => {
    setAnswers([]);
    setIndex(0);
    setReward(null);
    setPhase("loading");
    loadQuestion();
  }, [loadQuestion]);

  return (
    <div className="true-false-game">
      <header className="true-false-game__header">
        <button
          type="button"
          className="true-false-game__back"
          onClick={onClose}
        >
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>
        <h2 className="true-false-game__title">Правда или ложь</h2>
        {phase === "playing" && (
          <span className="true-false-game__progress">
            {index + 1} / {TOTAL_QUESTIONS}
          </span>
        )}
      </header>

      {phase === "loading" && (
        <p className="true-false-game__state">Загрузка…</p>
      )}

      {phase === "playing" && question && (
        <div className="true-false-game__body">
          <div className="true-false-game__pair">
            <p className="true-false-game__hangul">{question.hangul}</p>
            <p className="true-false-game__dash">—</p>
            <p className="true-false-game__translation">
              {question.translation}
            </p>
          </div>

          <div className="true-false-game__actions">
            <button
              type="button"
              className={
                "btn btn--lg true-false-game__btn" +
                (picked === true
                  ? question.is_correct
                    ? " btn--success"
                    : " btn--danger"
                  : " btn--outline")
              }
              onClick={() => handleAnswer(true)}
              disabled={picked !== null}
            >
              <Check size={18} /> Верно{" "}
              <span className="true-false-game__key">1</span>
            </button>

            <button
              type="button"
              className={
                "btn btn--lg true-false-game__btn" +
                (picked === false
                  ? !question.is_correct
                    ? " btn--success"
                    : " btn--danger"
                  : " btn--outline")
              }
              onClick={() => handleAnswer(false)}
              disabled={picked !== null}
            >
              <X size={18} /> Неверно{" "}
              <span className="true-false-game__key">2</span>
            </button>
          </div>
        </div>
      )}

      {phase === "result" && (
        <div className="true-false-game__result">
          <p className="true-false-game__result-score">
            {answers.filter((a) => a.correct).length} / {answers.length}
          </p>
          <p className="true-false-game__result-percent">
            {answers.length > 0
              ? Math.round(
                  (answers.filter((a) => a.correct).length / answers.length) *
                    100,
                )
              : 0}
            %
          </p>
          {reward !== null && (
            <p className="true-false-game__result-reward">
              {reward > 0 ? `+${reward} черники` : "Без награды"}
            </p>
          )}

          <div className="true-false-game__result-actions">
            <button type="button" className="btn btn--accent" onClick={restart}>
              Ещё раз
            </button>
            <button
              type="button"
              className="btn btn--outline"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
