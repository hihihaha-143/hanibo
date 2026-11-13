import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  getMatch,
  postReward,
  type MatchPairWord,
} from "../../../api/minigames";
import { updateUserWordProgress } from "../../../api/dictionary";
import { useAuth } from "../../../context/useAuth";

type Phase = "playing" | "result" | "loading";

interface MatchGameProps {
  onClose: () => void;
}

interface Pair {
  hangul: MatchPairWord;
  translation: MatchPairWord;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function MatchGame({ onClose }: MatchGameProps) {
  const { refreshUser } = useAuth();

  const [phase, setPhase] = useState<Phase>("loading");
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [leftItems, setLeftItems] = useState<MatchPairWord[]>([]);
  const [rightItems, setRightItems] = useState<MatchPairWord[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<MatchPairWord | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<{
    left: number;
    right: number;
  } | null>(null);
  const [mistakesWordIds, setMistakesWordIds] = useState<Set<number>>(
    new Set(),
  );
  const [reward, setReward] = useState<number | null>(null);

  const loadGame = useCallback(() => {
    setPhase("loading");
    setPairs([]);
    setLeftItems([]);
    setRightItems([]);
    setSelectedLeft(null);
    setMatchedIds(new Set());
    setWrongPair(null);
    setMistakesWordIds(new Set());
    setReward(null);

    getMatch()
      .then((data) => {
        setPairs(data.pairs.map((p) => ({ hangul: p, translation: p })));
        setLeftItems(shuffle(data.pairs));
        setRightItems(shuffle(data.pairs));
        setPhase("playing");
      })
      .catch(() => {
        setPhase("result");
      });
  }, []);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const finishGame = useCallback(
    async (mistakes: Set<number>, total: number) => {
      setPhase("result");
      const correct = total - mistakes.size;

      try {
        const res = await postReward(correct, total);
        setReward(res.reward);
        await refreshUser();
      } catch {
        setReward(0);
      }
    },
    [refreshUser],
  );

  const handleLeftClick = useCallback(
    (item: MatchPairWord) => {
      if (matchedIds.has(item.id) || wrongPair) return;
      setSelectedLeft(item);
    },
    [matchedIds, wrongPair],
  );

  const handleRightClick = useCallback(
    (item: MatchPairWord) => {
      if (!selectedLeft || matchedIds.has(item.id) || wrongPair) return;

      const isMatch = selectedLeft.id === item.id;
      const nextMistakes = new Set(mistakesWordIds);

      if (isMatch) {
        updateUserWordProgress(selectedLeft.id, true).catch(() => {});

        const nextMatched = new Set(matchedIds);
        nextMatched.add(selectedLeft.id);
        setMatchedIds(nextMatched);
        setSelectedLeft(null);

        if (nextMatched.size >= pairs.length) {
          setTimeout(() => {
            finishGame(nextMistakes, pairs.length);
          }, 600);
        }
      } else {
        // Штраф за ошибку только один раз на слово
        if (!nextMistakes.has(selectedLeft.id)) {
          nextMistakes.add(selectedLeft.id);
          setMistakesWordIds(nextMistakes);
          updateUserWordProgress(selectedLeft.id, false).catch(() => {});
        }

        setWrongPair({ left: selectedLeft.id, right: item.id });

        setTimeout(() => {
          setWrongPair(null);
          setSelectedLeft(null);
        }, 600);
      }
    },
    [
      selectedLeft,
      matchedIds,
      wrongPair,
      mistakesWordIds,
      pairs.length,
      finishGame,
    ],
  );

  const correctCount = pairs.length - mistakesWordIds.size;
  const percent =
    pairs.length > 0 ? Math.round((correctCount / pairs.length) * 100) : 0;

  return (
    <div className="match-game">
      <header className="match-game__header">
        <button
          type="button"
          className="match-game__back"
          onClick={onClose}
        >
          <ArrowLeft size={16} />
          <span>Назад</span>
        </button>
        <h2 className="match-game__title">Найди пару</h2>
        {phase === "playing" && (
          <span className="match-game__progress">
            {matchedIds.size} / {pairs.length}
          </span>
        )}
      </header>

      {phase === "loading" && (
        <p className="match-game__state">Загрузка…</p>
      )}

      {phase === "playing" && (
        <div className="match">
          <div className="match__col">
            {leftItems.map((item) => {
              const isMatched = matchedIds.has(item.id);
              const isSelected = selectedLeft?.id === item.id;
              const isWrong =
                wrongPair?.left === item.id &&
                !matchedIds.has(item.id);

              let modifier = "";
              if (isMatched) modifier = "match__item--correct";
              else if (isWrong) modifier = "match__item--wrong";
              else if (isSelected) modifier = "match__item--selected";

              return (
                <button
                  key={`l-${item.id}`}
                  type="button"
                  className={`match__item ${modifier}`}
                  onClick={() => handleLeftClick(item)}
                  disabled={isMatched}
                >
                  {item.hangul}
                </button>
              );
            })}
          </div>

          <div className="match__col">
            {rightItems.map((item) => {
              const isMatched = matchedIds.has(item.id);
              const isWrong =
                wrongPair?.right === item.id &&
                !matchedIds.has(item.id);

              let modifier = "";
              if (isMatched) modifier = "match__item--correct";
              else if (isWrong) modifier = "match__item--wrong";

              return (
                <button
                  key={`r-${item.id}`}
                  type="button"
                  className={`match__item ${modifier}`}
                  onClick={() => handleRightClick(item)}
                  disabled={isMatched}
                >
                  {item.translation}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === "result" && (
        <div className="match-game__result">
          <p className="match-game__result-score">
            {correctCount} / {pairs.length}
          </p>
          <p className="match-game__result-percent">{percent}%</p>
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
