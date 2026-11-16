import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ArrowLeft } from "lucide-react";
import {
  getPhraseCorrectSpelling,
  postReward,
  type PhraseCorrectSpellingQuestion,
} from "../../../api/minigames";
import { updateUserPhraseProgress } from "../../../api/dictionary";
import { useAuth } from "../../../context/useAuth";

const TOTAL_QUESTIONS = 10;
const NEXT_DELAY = 1000;

type Phase = "playing" | "result" | "loading";

interface AnswerRecord {
  correct: boolean;
}

interface PhraseCorrectSpellingGameProps {
  onClose: () => void;
}

export function PhraseCorrectSpellingGame({
  onClose,
}: PhraseCorrectSpellingGameProps) {
  const { refreshUser } = useAuth();

  const [phase, setPhase] = useState<Phase>("loading");
  const [question, setQuestion] =
    useState<PhraseCorrectSpellingQuestion | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [reward, setReward] = useState<number | null>(null);

  const loadQuestion = useCallback(() => {
    setSelected(null);
    setAnswered(false);

    getPhraseCorrectSpelling()
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

  const handleSelect = useCallback(
    (i: number) => {
      if (!question || answered) return;

      setSelected(i);
      setAnswered(true);

      const isCorrect = i === question.correct_index;
      const nextAnswers = [...answers, { correct: isCorrect }];
      setAnswers(nextAnswers);

      updateUserPhraseProgress(question.phrase_id, isCorrect).catch(() => {});

      setTimeout(() => {
        if (nextAnswers.length >= TOTAL_QUESTIONS) {
          finishGame(nextAnswers);
        } else {
          setIndex((idx) => idx + 1);
          loadQuestion();
        }
      }, NEXT_DELAY);
    },
    [question, answered, answers, finishGame, loadQuestion],
  );

  useHotkeys(
    ["1", "2", "3", "4"],
    (e) => {
      const idx = Number(e.key) - 1;
      if (idx < 4) handleSelect(idx);
    },
    {
      enabled: phase === "playing" && !answered,
      preventDefault: true,
    },
    [handleSelect, phase, answered],
  );

  const restart = useCallback(() => {
    setAnswers([]);
    setIndex(0);
    setReward(null);
    setPhase("loading");
    loadQuestion();
  }, [loadQuestion]);

  return (
    <div className="correct-spelling-game">
      <header className="correct-spelling-game__header">
        <button
          type="button"
          className="correct-spelling-game__back"
          onClick={onClose}
        >
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>
        <h2 className="correct-spelling-game__title">Правописание</h2>
        {phase === "playing" && (
          <span className="correct-spelling-game__progress">
            {index + 1} / {TOTAL_QUESTIONS}
          </span>
        )}
      </header>

      {phase === "loading" && (
        <p className="correct-spelling-game__state">Загрузка…</p>
      )}

      {phase === "playing" && question && (
        <div className="correct-spelling-game__body">
          <div className="correct-spelling-game__prompt-wrap">
            <p className="correct-spelling-game__instruction">
              Выберите правильное написание
            </p>
            <p className="correct-spelling-game__translation">
              {question.translation}
            </p>
          </div>

          <div className="correct-spelling-game__variants">
            {question.variants.map((variant, i) => {
              const isCorrect = i === question.correct_index;
              let modifier = "";
              if (answered) {
                if (isCorrect)
                  modifier = "correct-spelling-game__variant--correct";
                else if (i === selected)
                  modifier = "correct-spelling-game__variant--wrong";
              }
              return (
                <button
                  key={i}
                  type="button"
                  className={`correct-spelling-game__variant ${modifier}`}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                >
                  <span className="correct-spelling-game__variant-key">
                    {i + 1}
                  </span>
                  <span className="correct-spelling-game__variant-text">
                    {variant}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === "result" && (
        <div className="correct-spelling-game__result">
          <p className="correct-spelling-game__result-score">
            {answers.filter((a) => a.correct).length} / {answers.length}
          </p>
          <p className="correct-spelling-game__result-percent">
            {answers.length > 0
              ? Math.round(
                  (answers.filter((a) => a.correct).length / answers.length) *
                    100,
                )
              : 0}
            %
          </p>
          {reward !== null && (
            <p className="correct-spelling-game__result-reward">
              {reward > 0 ? `+${reward} черники` : "Без награды"}
            </p>
          )}

          <div className="correct-spelling-game__result-actions">
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
