import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { getGrammarRules, type GrammarRule } from "../../../api/grammar";
import { apiClient } from "../../../api/client";
import { useAuth } from "../../../context/useAuth";

const PAIRS = 6;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface MatchRuleGameProps {
  onClose: () => void;
}

export function MatchRuleGame({ onClose }: MatchRuleGameProps) {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [restartKey, setRestartKey] = useState(0);

  const [pairs, setPairs] = useState<GrammarRule[]>([]);
  const [leftOrder, setLeftOrder] = useState<number[]>([]);
  const [rightOrder, setRightOrder] = useState<number[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [solved, setSolved] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
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
        if (cancelled) return;
        const picked = shuffle(res.data).slice(0, PAIRS);
        setPairs(picked);
        setLeftOrder(shuffle(picked.map((p) => p.id)));
        setRightOrder(shuffle(picked.map((p) => p.id)));
      })
      .catch(() => {
        if (!cancelled) setPairs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [restartKey]);

  const byId = useMemo(() => {
    const map = new Map<number, GrammarRule>();
    pairs.forEach((p) => map.set(p.id, p));
    return map;
  }, [pairs]);

  const finalize = useCallback(
    (solvedCount: number) => {
      setDone(true);
      const total = pairs.length;
      const correct = Math.max(0, solvedCount - mistakes);
      apiClient
        .post<{ reward: number; percent: number }>("/minigames/reward", {
          correct,
          total,
        })
        .then((res) => {
          setReward(res.data);
          return refreshUser();
        })
        .catch(() => {});
    },
    [pairs.length, mistakes, refreshUser],
  );

  const handleLeft = (id: number) => {
    if (solved.includes(id)) return;
    setSelectedLeft(id);

    if (selectedRight !== null) {
      resolvePair(id, selectedRight);
    }
  };

  const handleRight = (id: number) => {
    if (solved.includes(id)) return;
    setSelectedRight(id);

    if (selectedLeft !== null) {
      resolvePair(selectedLeft, id);
    }
  };

  const resolvePair = (leftId: number, rightId: number) => {
    if (leftId === rightId) {
      const nextSolved = [...solved, leftId];
      setSolved(nextSolved);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (nextSolved.length === pairs.length && pairs.length > 0) {
        finalize(nextSolved.length);
      }
    } else {
      setMistakes((m) => m + 1);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const restart = () => {
    setPairs([]);
    setLeftOrder([]);
    setRightOrder([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setSolved([]);
    setMistakes(0);
    setDone(false);
    setReward(null);
    setRestartKey((k) => k + 1);
  };

  const totalPairs = pairs.length;
  const correctCount = Math.max(0, totalPairs - mistakes);
  const percent =
    totalPairs > 0 ? Math.round((correctCount / totalPairs) * 100) : 0;

  return (
    <div className="match-rule-game">
      <div className="match-rule-game__header">
        <button
          type="button"
          className="match-rule-game__back"
          onClick={onClose}
        >
          <ChevronLeft size={16} />
          <span>Назад</span>
        </button>
        <span className="match-rule-game__title">Соедини пары</span>
        {!done && (
          <span className="match-rule-game__progress">
            {solved.length} / {pairs.length}
          </span>
        )}
      </div>

      {loading && <p className="match-rule-game__state">Загрузка…</p>}

      {!loading && pairs.length < PAIRS && (
        <p className="match-rule-game__state">
          Нужно минимум {PAIRS} правил для игры.
        </p>
      )}

      {!loading && done && (
        <div className="match-rule-game__result">
          <p className="match-rule-game__result-score">
            {correctCount} / {totalPairs}
          </p>
          <p className="match-rule-game__result-percent">{percent}%</p>
          {reward && (
            <span className="match-rule-game__result-reward">
              +{reward.reward} черники
            </span>
          )}
          <div className="match-rule-game__result-actions">
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

      {!loading && !done && pairs.length >= PAIRS && (
        <div className="match-rule-game__body">
          <div className="match-rule-game__cols">
            <div className="match-rule-game__col">
              {leftOrder.map((id) => {
                const isSolved = solved.includes(id);
                const isSelected = selectedLeft === id;
                const cls =
                  "match-rule-game__cell" +
                  (isSolved ? " match-rule-game__cell--solved" : "") +
                  (isSelected ? " match-rule-game__cell--active" : "");
                return (
                  <button
                    key={id}
                    type="button"
                    className={cls}
                    onClick={() => handleLeft(id)}
                    disabled={isSolved}
                  >
                    {byId.get(id)?.title}
                  </button>
                );
              })}
            </div>
            <div className="match-rule-game__col">
              {rightOrder.map((id) => {
                const isSolved = solved.includes(id);
                const isSelected = selectedRight === id;
                const cls =
                  "match-rule-game__cell" +
                  (isSolved ? " match-rule-game__cell--solved" : "") +
                  (isSelected ? " match-rule-game__cell--active" : "");
                return (
                  <button
                    key={id}
                    type="button"
                    className={cls}
                    onClick={() => handleRight(id)}
                    disabled={isSolved}
                  >
                    {byId.get(id)?.construction}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
