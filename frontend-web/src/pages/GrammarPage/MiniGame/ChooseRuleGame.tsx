import { useCallback, useEffect, useMemo, useState } from "react";
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
  const variants = shuffle([target, ...distractors]).map((r) => r.title);
  const correctIndex = variants.indexOf(target.title);
  return { target, variants, correctIndex };
}

interface ChooseRuleGameProps {
  onClose: () => void;
}

export function ChooseRuleGame({ onClose }: ChooseRuleGameProps) {
  const { refreshUser } = useAuth();
  const [pool, setPool] = useState<GrammarRule[]>([]);
  const [loading, setLoading] = useState(true);

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [done, setDone] = useState(false);

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
  }, []);

  const startRound = useCallback(() => {
    setSelected(null);
    setAnswered(false);
    setQuestion(buildQuestion(pool));
  }, [pool]);

  useEffect(() => {
    if (!loading && pool.length > 0) startRound();
  }, [loading, pool.length, startRound]);

  const handleSelect = useCallback(
    (index: number) => {
      if (!question || answered) return;
      setSelected(index);
      setAnswered(true);

      const isCorrect = index === question.correctIndex;
      if (isCorrect) setScore((s) => s + 1);

      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          setDone(true);
          apiClient
            .post("/minigames/reward", { game: "grammar-choose-rule", score })
            .then(() => refreshUser())
            .catch(() => {});
        } else {
          setRound((r) => r + 1);
          startRound();
        }
      }, NEXT_DELAY);
    },
    [question, answered, round, score, refreshUser, startRound],
  );

  const progressLabel = useMemo(
    () => `${Math.min(round + 1, ROUNDS)} / ${ROUNDS}`,
    [round],
  );

  if (loading) {
    return (
      <div className="choose-rule-game choose-rule-game--state">
        <p className="choose-rule-game__state-text">Загрузка…</p>
      </div>
    );
  }

  if (pool.length < 4) {
    return (
      <div className="choose-rule-game choose-rule-game--state">
        <p className="choose-rule-game__state-text">
          Нужно минимум 4 правила для игры.
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="choose-rule-game choose-rule-game--result">
        <p className="choose-rule-game__result-title">Результат</p>
        <p className="choose-rule-game__result-score">
          {score} из {ROUNDS}
        </p>
        <button type="button" className="btn btn--accent" onClick={onClose}>
          Закрыть
        </button>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="choose-rule-game">
      <div className="choose-rule-game__head">
        <span className="choose-rule-game__progress">{progressLabel}</span>
        <span className="choose-rule-game__score">Счёт: {score}</span>
      </div>

      <p className="choose-rule-game__instruction">
        Выбери правило для конструкции
      </p>

      <p className="choose-rule-game__prompt">
        {question.target.construction}
      </p>

      <div className="choose-rule-game__variants">
        {question.variants.map((v, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correctIndex;
          const cls =
            "choose-rule-game__variant" +
            (answered && isCorrect
              ? " choose-rule-game__variant--correct"
              : "") +
            (answered && isSelected && !isCorrect
              ? " choose-rule-game__variant--wrong"
              : "");
          return (
            <button
              key={v + i}
              type="button"
              className={cls}
              onClick={() => handleSelect(i)}
              disabled={answered}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}
