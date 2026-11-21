import { useCallback, useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { getGrammarRules, type GrammarRule } from "../../../api/grammar";
import { apiClient } from "../../../api/client";
import { useAuth } from "../../../context/useAuth";

const ROUNDS = 10;
const NEXT_DELAY = 900;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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

interface RuleToConstructionGameProps {
  onClose: () => void;
}

export function RuleToConstructionGame({
  onClose,
}: RuleToConstructionGameProps) {
  const { refreshUser } = useAuth();
  const [pool, setPool] = useState<GrammarRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [restartKey, setRestartKey] = useState(0);

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [done, setDone] = useState(false);
  const [reward, setReward] = useState<{
    reward: number;
    percent: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getGrammarRules({ tab: "all", per_page: 200 })
      .then((res) => {
        if (!cancelled) setPool(res.data);
      })
      .catch(() => {
        if (!cancelled) setPool([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [restartKey]);

  const startRound = useCallback(() => {
    setSelected(null);
    setAnswered(false);
    setQuestion(buildQuestion(pool));
  }, [pool]);

  useEffect(() => {
    if (!loading && pool.length > 0 && !done) startRound();
  }, [loading, pool.length, startRound, done]);

  const handleSelect = useCallback(
    (index: number) => {
      if (!question || answered) return;
      setSelected(index);
      setAnswered(true);

      const isCorrect = index === question.correctIndex;
      const nextScore = isCorrect ? score + 1 : score;
      if (isCorrect) setScore(nextScore);

      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          setDone(true);
          apiClient
            .post<{ reward: number; percent: number }>("/minigames/reward", {
              correct: nextScore,
              total: ROUNDS,
            })
            .then((res) => {
              setReward(res.data);
              return refreshUser();
            })
            .catch(() => {});
        } else {
          setRound((r) => r + 1);
          startRound();
        }
      }, NEXT_DELAY);
    },
    [question, answered, round, score, refreshUser, startRound],
  );

  const restart = () => {
    setRound(0);
    setScore(0);
    setDone(false);
    setReward(null);
    setQuestion(null);
    setSelected(null);
    setAnswered(false);
    setRestartKey((k) => k + 1);
  };

  return (
    <div className="rule-to-construction-game">
      <div className="rule-to-construction-game__header">
        <button
          type="button"
          className="rule-to-construction-game__back"
          onClick={onClose}
        >
          <ChevronLeft size={16} />
          <span>Назад</span>
        </button>
        <span className="rule-to-construction-game__title">
          Правило → конструкция
        </span>
        {!done && (
          <span className="rule-to-construction-game__progress">
            {Math.min(round + 1, ROUNDS)} / {ROUNDS}
          </span>
        )}
      </div>

      {loading && <p className="rule-to-construction-game__state">Загрузка…</p>}

      {!loading && pool.length < 4 && (
        <p className="rule-to-construction-game__state">
          Нужно минимум 4 правила для игры.
        </p>
      )}

      {!loading && done && (
        <div className="rule-to-construction-game__result">
          <p className="rule-to-construction-game__result-score">
            {score} / {ROUNDS}
          </p>
          <p className="rule-to-construction-game__result-percent">
            {reward ? `${reward.percent}%` : ""}
          </p>
          {reward && (
            <span className="rule-to-construction-game__result-reward">
              +{reward.reward} черники
            </span>
          )}
          <div className="rule-to-construction-game__result-actions">
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={onClose}
            >
              К списку
            </button>
            <button
              type="button"
              className="btn btn--accent btn--sm"
              onClick={restart}
            >
              Ещё раз
            </button>
          </div>
        </div>
      )}

      {!loading && !done && question && (
        <div className="rule-to-construction-game__body">
          <p className="rule-to-construction-game__instruction">
            Выбери конструкцию для правила
          </p>
          <div className="rule-to-construction-game__prompt-wrap">
            <p className="rule-to-construction-game__prompt">
              {question.target.title}
            </p>
          </div>

          <div className="rule-to-construction-game__variants">
            {question.variants.map((v, i) => {
              const isSelected = selected === i;
              const isCorrect = i === question.correctIndex;
              const cls =
                "rule-to-construction-game__variant" +
                (answered && isCorrect
                  ? " rule-to-construction-game__variant--correct"
                  : "") +
                (answered && isSelected && !isCorrect
                  ? " rule-to-construction-game__variant--wrong"
                  : "");
              return (
                <button
                  key={v + i}
                  type="button"
                  className={cls}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                >
                  <span className="rule-to-construction-game__variant-key">
                    {i + 1}
                  </span>
                  <span className="rule-to-construction-game__variant-text">
                    {v}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
