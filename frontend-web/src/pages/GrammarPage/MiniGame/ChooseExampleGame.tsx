import { useCallback, useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import {
  getGrammarRule,
  getGrammarRules,
  type GrammarRule,
  type GrammarRulePhrase,
} from "../../../api/grammar";
import { apiClient } from "../../../api/client";
import { useAuth } from "../../../context/useAuth";

const ROUNDS = 10;
const NEXT_DELAY = 900;
const OPTIONS = 4;

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
  variants: GrammarRulePhrase[];
  correctIndex: number;
}

interface ChooseExampleGameProps {
  onClose: () => void;
}

export function ChooseExampleGame({ onClose }: ChooseExampleGameProps) {
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

  const buildAndSet = useCallback(async () => {
    setSelected(null);
    setAnswered(false);
    setQuestion(null);

    const candidates = shuffle(pool).slice(0, 4);
    if (candidates.length < 2) return;

    const details = await Promise.all(
      candidates.map((c) => getGrammarRule(c.id).catch(() => null)),
    );

    const withPhrases = details
      .filter((d): d is NonNullable<typeof d> => d !== null)
      .filter((d) => (d.phrases?.length ?? 0) > 0);

    if (withPhrases.length < 2) return;

    const target = withPhrases[0];
    const correctPhrase =
      target.phrases[Math.floor(Math.random() * target.phrases.length)];

    const distractorPhrases: GrammarRulePhrase[] = [];
    for (const other of withPhrases.slice(1)) {
      const pick = other.phrases.find((p) => p.id !== correctPhrase.id);
      if (pick) distractorPhrases.push(pick);
      if (distractorPhrases.length >= OPTIONS - 1) break;
    }

    if (distractorPhrases.length < OPTIONS - 1) {
      const extra = shuffle(
        withPhrases
          .flatMap((d) => d.phrases)
          .filter((p) => p.id !== correctPhrase.id),
      ).slice(0, OPTIONS - 1 - distractorPhrases.length);
      distractorPhrases.push(...extra);
    }

    const variants = shuffle([correctPhrase, ...distractorPhrases]).slice(
      0,
      OPTIONS,
    );
    const correctIndex = variants.findIndex((p) => p.id === correctPhrase.id);

    const targetMeta = pool.find((r) => r.id === target.id) ?? target;

    setQuestion({ target: targetMeta, variants, correctIndex });
  }, [pool]);

  useEffect(() => {
    if (!loading && pool.length > 0 && !done) buildAndSet();
  }, [loading, pool.length, buildAndSet, done]);

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
          buildAndSet();
        }
      }, NEXT_DELAY);
    },
    [question, answered, round, score, refreshUser, buildAndSet],
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
    <div className="choose-example-game">
      <div className="choose-example-game__header">
        <button
          type="button"
          className="choose-example-game__back"
          onClick={onClose}
        >
          <ChevronLeft size={16} />
          <span>Назад</span>
        </button>
        <span className="choose-example-game__title">Пример к правилу</span>
        {!done && (
          <span className="choose-example-game__progress">
            {Math.min(round + 1, ROUNDS)} / {ROUNDS}
          </span>
        )}
      </div>

      {loading && <p className="choose-example-game__state">Загрузка…</p>}

      {!loading && pool.length < 4 && (
        <p className="choose-example-game__state">
          Нужно минимум 4 правила для игры.
        </p>
      )}

      {!loading && done && (
        <div className="choose-example-game__result">
          <p className="choose-example-game__result-score">
            {score} / {ROUNDS}
          </p>
          <p className="choose-example-game__result-percent">
            {reward ? `${reward.percent}%` : ""}
          </p>
          {reward && (
            <span className="choose-example-game__result-reward">
              +{reward.reward} черники
            </span>
          )}
          <div className="choose-example-game__result-actions">
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

      {!loading && !done && !question && pool.length >= 4 && (
        <p className="choose-example-game__state">
          Недостаточно примеров для игры.
        </p>
      )}

      {!loading && !done && question && (
        <div className="choose-example-game__body">
          <p className="choose-example-game__instruction">
            Выбери пример для правила
          </p>
          <div className="choose-example-game__prompt-wrap">
            <p className="choose-example-game__prompt">
              {question.target.title}
            </p>
            <p className="choose-example-game__prompt-sub">
              {question.target.construction}
            </p>
          </div>

          <div className="choose-example-game__variants">
            {question.variants.map((p, i) => {
              const isSelected = selected === i;
              const isCorrect = i === question.correctIndex;
              const cls =
                "choose-example-game__variant" +
                (answered && isCorrect
                  ? " choose-example-game__variant--correct"
                  : "") +
                (answered && isSelected && !isCorrect
                  ? " choose-example-game__variant--wrong"
                  : "");
              return (
                <button
                  key={p.id}
                  type="button"
                  className={cls}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                >
                  <span className="choose-example-game__variant-hangul">
                    {p.hangul}
                  </span>
                  <span className="choose-example-game__variant-translation">
                    {p.translation}
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
