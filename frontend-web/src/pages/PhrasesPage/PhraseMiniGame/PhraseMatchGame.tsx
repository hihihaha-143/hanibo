import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  getPhraseMatch,
  postReward,
  type MatchPairWord,
} from "../../../api/minigames";
import { updateUserPhraseProgress } from "../../../api/dictionary";
import { useAuth } from "../../../context/useAuth";
import { spring } from "../../../lib/motion";

type Phase = "playing" | "result" | "loading";

const PAIR_COLORS = ["#7aa2f7", "#bb9af7", "#7dcfff", "#f7768e"];

interface PhraseMatchGameProps {
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

export function PhraseMatchGame({ onClose }: PhraseMatchGameProps) {
  const { refreshUser } = useAuth();

  const [phase, setPhase] = useState<Phase>("loading");
  const [phrases, setPhrases] = useState<MatchPairWord[]>([]);
  const [leftItems, setLeftItems] = useState<string[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([]);

  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [draggingLeft, setDraggingLeft] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [reward, setReward] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const correctMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of phrases) map[p.hangul] = p.translation;
    return map;
  }, [phrases]);


  const loadGame = useCallback(() => {
    setPhase("loading");
    setPhrases([]);
    setLeftItems([]);
    setRightItems([]);
    setPairs({});
    setSelectedLeft(null);
    setSelectedRight(null);
    setDraggingLeft(null);
    setAnswered(false);
    setReward(null);
    setCorrectCount(0);

    getPhraseMatch()
      .then((data) => {
        setPhrases(data.pairs);
        setLeftItems(shuffle(data.pairs.map((p) => p.hangul)));
        setRightItems(shuffle(data.pairs.map((p) => p.translation)));
        setPhase("playing");
      })
      .catch(() => {
        setPhase("result");
      });
  }, []);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const pairIndexByLeft: Record<string, number> = {};
  Object.keys(pairs).forEach((left, i) => {
    pairIndexByLeft[left] = i;
  });

  const getLeftForRight = (right: string): string | undefined =>
    Object.keys(pairs).find((l) => pairs[l] === right);

  const attach = (left: string, right: string) => {
    const copy = { ...pairs };
    delete copy[left];
    for (const l of Object.keys(copy)) {
      if (copy[l] === right) delete copy[l];
    }
    copy[left] = right;
    setPairs(copy);
  };

  const handleLeftClick = (left: string) => {
    if (answered) return;

    if (pairs[left]) {
      const copy = { ...pairs };
      delete copy[left];
      setPairs(copy);
      return;
    }

    if (selectedRight) {
      attach(left, selectedRight);
      setSelectedRight(null);
      return;
    }

    setSelectedLeft(left === selectedLeft ? null : left);
  };

  const handleRightClick = (right: string) => {
    if (answered) return;

    const existingLeft = getLeftForRight(right);
    if (existingLeft) {
      const copy = { ...pairs };
      delete copy[existingLeft];
      setPairs(copy);
      return;
    }

    if (selectedLeft) {
      attach(selectedLeft, right);
      setSelectedLeft(null);
      return;
    }

    setSelectedRight(right === selectedRight ? null : right);
  };

  const handleDragStartLeft = (left: string) => {
    if (answered) return;
    setDraggingLeft(left);
  };

  const handleDropOnRight = (right: string) => {
    if (answered) return;
    if (!draggingLeft) return;
    attach(draggingLeft, right);
    setDraggingLeft(null);
    setSelectedLeft(null);
  };

  const total = phrases.length;
  const allPaired = Object.keys(pairs).length === total;

  const finishGame = useCallback(
    async (correct: number, totalCount: number) => {
      setPhase("result");

      for (const p of phrases) {
        const userRight = pairs[p.hangul];
        const isCorrect = userRight === p.translation;
        updateUserPhraseProgress(p.id, isCorrect).catch(() => {});
      }

      try {
        const res = await postReward(correct, totalCount);
        setReward(res.reward);
        await refreshUser();
      } catch {
        setReward(0);
      }
    },
    [phrases, pairs, refreshUser],
  );

  const handleCheck = () => {
    if (!allPaired || answered || phase !== "playing") return;

    const correct = Object.keys(pairs).filter(
      (left) => correctMap[left] === pairs[left],
    ).length;

    setCorrectCount(correct);
    setAnswered(true);

    setTimeout(() => {
      finishGame(correct, total);
    }, 900);
  };

  const renderLeft = (left: string) => {
    const pairIdx = pairIndexByLeft[left];
    const isPaired = pairIdx !== undefined;
    const color = isPaired ? PAIR_COLORS[pairIdx % PAIR_COLORS.length] : null;
    const isSelected = selectedLeft === left;

    let modifier = "";
    if (answered) {
      const correct = correctMap[left] === pairs[left];
      modifier = correct ? "match__item--correct" : "match__item--wrong";
    } else if (isSelected) {
      modifier = "match__item--selected";
    }

    return (
      <motion.div
        key={left}
        className={`match__item ${modifier}`}
        style={
          color && !answered
            ? {
                borderColor: color,
                color,
                background: `${color}22`,
              }
            : undefined
        }
        draggable={!answered}
        onDragStart={() => handleDragStartLeft(left)}
        onClick={() => handleLeftClick(left)}
        whileHover={!answered ? { scale: 1.02 } : undefined}
        whileTap={!answered ? { scale: 0.98 } : undefined}
        transition={spring.bouncy}
      >
        {left}
      </motion.div>
    );
  };

  const renderRight = (right: string) => {
    const left = getLeftForRight(right);
    const isPaired = left !== undefined;
    const pairIdx = isPaired ? pairIndexByLeft[left] : undefined;
    const color =
      pairIdx !== undefined ? PAIR_COLORS[pairIdx % PAIR_COLORS.length] : null;
    const isSelected = selectedRight === right;

    let modifier = "";
    if (answered) {
      const correct = left !== undefined && correctMap[left] === right;
      modifier = correct ? "match__item--correct" : "match__item--wrong";
    } else if (isSelected) {
      modifier = "match__item--selected";
    }

    return (
      <motion.div
        key={right}
        className={`match__item ${modifier}`}
        style={
          color && !answered
            ? {
                borderColor: color,
                color,
                background: `${color}22`,
              }
            : undefined
        }
        onClick={() => handleRightClick(right)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDropOnRight(right)}
        whileHover={!answered ? { scale: 1.02 } : undefined}
        whileTap={!answered ? { scale: 0.98 } : undefined}
        transition={spring.bouncy}
      >
        {right}
      </motion.div>
    );
  };

  return (
    <div className="match-game">
      <header className="match-game__header">
        <button type="button" className="match-game__back" onClick={onClose}>
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>
        <h2 className="match-game__title">Найди пару</h2>
        {phase === "playing" && (
          <span className="match-game__progress">
            {Object.keys(pairs).length} / {total}
          </span>
        )}
      </header>

      {phase === "loading" && <p className="match-game__state">Загрузка…</p>}

      {phase === "playing" && (
        <div className="match-game__body">
          <div className="match">
            <div className="match__col">{leftItems.map(renderLeft)}</div>
            <div className="match__col">{rightItems.map(renderRight)}</div>
          </div>

          {!answered && (
            <div className="match__footer">
              <motion.button
                type="button"
                className="btn btn--accent btn--lg"
                disabled={!allPaired}
                onClick={handleCheck}
                whileHover={allPaired ? { y: -1, scale: 1.02 } : undefined}
                whileTap={allPaired ? { scale: 0.97 } : undefined}
                transition={spring.bouncy}
              >
                Проверить
              </motion.button>
            </div>
          )}
        </div>
      )}

      {phase === "result" && (
        <div className="match-game__result">
          <p className="match-game__result-score">
            {correctCount} / {total}
          </p>
          <p className="match-game__result-percent">
            {total > 0 ? Math.round((correctCount / total) * 100) : 0}%
          </p>
          {reward !== null && (
            <p className="match-game__result-reward">
              {reward > 0 ? `+${reward} черники` : "Без награды"}
            </p>
          )}

          <div className="match-game__result-actions">
            <button
              type="button"
              className="btn btn--accent"
              onClick={loadGame}
            >
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
