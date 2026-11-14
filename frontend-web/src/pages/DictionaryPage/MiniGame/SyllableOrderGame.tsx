import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  getSyllableOrder,
  postReward,
  type SyllableOrderQuestion,
} from "../../../api/minigames";
import { updateUserWordProgress } from "../../../api/dictionary";
import { useAuth } from "../../../context/useAuth";

const TOTAL_QUESTIONS = 10;
const NEXT_DELAY = 1200;

type Phase = "playing" | "result" | "loading";

interface AnswerRecord {
  correct: boolean;
}

interface SyllableOrderGameProps {
  onClose: () => void;
}

export function SyllableOrderGame({ onClose }: SyllableOrderGameProps) {
  const { refreshUser } = useAuth();

  const [phase, setPhase] = useState<Phase>("loading");
  const [question, setQuestion] = useState<SyllableOrderQuestion | null>(null);
  const [index, setIndex] = useState(0);
  const [pool, setPool] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [reward, setReward] = useState<number | null>(null);

  const loadQuestion = useCallback(() => {
    setPool([]);
    setPicked([]);
    setAnswered(false);
    setIsCorrect(null);

    getSyllableOrder()
      .then((q) => {
        setQuestion(q);
        setPool([...q.syllables]);
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

  const checkAndNext = useCallback(
    (assembled: string[], word: SyllableOrderQuestion) => {
      const correct = assembled.join("") === word.hangul;
      setIsCorrect(correct);
      setAnswered(true);

      const nextAnswers = [...answers, { correct }];
      setAnswers(nextAnswers);

      updateUserWordProgress(word.word_id, correct).catch(() => {});

      setTimeout(() => {
        if (nextAnswers.length >= TOTAL_QUESTIONS) {
          finishGame(nextAnswers);
        } else {
          setIndex((i) => i + 1);
          loadQuestion();
        }
      }, NEXT_DELAY);
    },
    [answers, finishGame, loadQuestion],
  );

  const handlePickFromPool = (i: number) => {
    if (answered || !question) return;
    const syllable = pool[i];
    const nextPool = pool.filter((_, idx) => idx !== i);
    const nextPicked = [...picked, syllable];

    setPool(nextPool);
    setPicked(nextPicked);

    if (nextPool.length === 0) {
      checkAndNext(nextPicked, question);
    }
  };

  const handlePickFromAssembled = (i: number) => {
    if (answered) return;
    const syllable = picked[i];
    setPicked(picked.filter((_, idx) => idx !== i));
    setPool([...pool, syllable]);
  };

  const restart = useCallback(() => {
    setAnswers([]);
    setIndex(0);
    setReward(null);
    setPhase("loading");
    loadQuestion();
  }, [loadQuestion]);

  return (
    <div className="syllable-order-game">
      <header className="syllable-order-game__header">
        <button
          type="button"
          className="syllable-order-game__back"
          onClick={onClose}
        >
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>
        <h2 className="syllable-order-game__title">Слог за слогом</h2>
        {phase === "playing" && (
          <span className="syllable-order-game__progress">
            {index + 1} / {TOTAL_QUESTIONS}
          </span>
        )}
      </header>

      {phase === "loading" && (
        <p className="syllable-order-game__state">Загрузка…</p>
      )}

      {phase === "playing" && question && (
        <div className="syllable-order-game__body">
          <p className="syllable-order-game__translation">
            {question.translation}
          </p>

          <div
            className={
              "syllable-order-game__assembled" +
              (answered
                ? isCorrect
                  ? " syllable-order-game__assembled--correct"
                  : " syllable-order-game__assembled--wrong"
                : "")
            }
          >
            {picked.length === 0 ? (
              <span className="syllable-order-game__placeholder">
                Собери слово из слогов
              </span>
            ) : (
              picked.map((syl, i) => (
                <button
                  key={`p-${i}-${syl}`}
                  type="button"
                  className="syllable-order-game__syllable syllable-order-game__syllable--picked"
                  onClick={() => handlePickFromAssembled(i)}
                  disabled={answered}
                >
                  {syl}
                </button>
              ))
            )}
          </div>

          <div className="syllable-order-game__pool">
            {pool.map((syl, i) => (
              <button
                key={`pool-${i}-${syl}`}
                type="button"
                className="syllable-order-game__syllable"
                onClick={() => handlePickFromPool(i)}
                disabled={answered}
              >
                {syl}
              </button>
            ))}
          </div>

          {answered && (
            <p className="syllable-order-game__answer">
              Правильно: <strong>{question.hangul}</strong>
            </p>
          )}
        </div>
      )}

      {phase === "result" && (
        <div className="syllable-order-game__result">
          <p className="syllable-order-game__result-score">
            {answers.filter((a) => a.correct).length} / {answers.length}
          </p>
          <p className="syllable-order-game__result-percent">
            {answers.length > 0
              ? Math.round(
                  (answers.filter((a) => a.correct).length / answers.length) *
                    100,
                )
              : 0}
            %
          </p>
          {reward !== null && (
            <p className="syllable-order-game__result-reward">
              {reward > 0 ? `+${reward} черники` : "Без награды"}
            </p>
          )}

          <div className="syllable-order-game__result-actions">
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
