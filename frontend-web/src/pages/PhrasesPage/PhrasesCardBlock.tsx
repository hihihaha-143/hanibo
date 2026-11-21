import { useState } from "react";
import {
  deleteUserPhrase,
  startUserPhrase,
  type DictionaryPhrase,
  type PhraseProgress,
} from "../../api/dictionary";
import { useAuth } from "../../context/useAuth";

interface PhrasesCardBlockProps {
  phrase: DictionaryPhrase;
  now: number;
  onProgressChange: (phraseId: number, progress: PhraseProgress | null) => void;
}

function formatReviewDate(iso: string, now: number): string {
  const date = new Date(iso);
  const diffMs = date.getTime() - now;
  const diffMinutes = Math.ceil(diffMs / (1000 * 60));
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) return "сегодня";
  if (diffMinutes < 60) return "меньше чем через час";
  if (diffHours === 1) return "через час";
  if (diffHours < 24) return `через ${diffHours} часа`;

  const nowDate = new Date(now);
  const targetDate = new Date(iso);
  const sameDay =
    nowDate.getFullYear() === targetDate.getFullYear() &&
    nowDate.getMonth() === targetDate.getMonth() &&
    nowDate.getDate() === targetDate.getDate();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    tomorrow.getFullYear() === targetDate.getFullYear() &&
    tomorrow.getMonth() === targetDate.getMonth() &&
    tomorrow.getDate() === targetDate.getDate();

  if (sameDay) return "сегодня";
  if (isTomorrow) return "завтра";
  if (diffDays < 5) return `через ${diffDays} дня`;
  return `через ${diffDays} дней`;
}

function getProgressLabel(
  phrase: DictionaryPhrase,
  now: number,
): { text: string; mod: string } {
  const progress = phrase.progress;

  if (!progress) {
    return { text: "Не изучено", mod: "new" };
  }

  if (!progress.is_learned) {
    return { text: "В процессе", mod: "progress" };
  }

  if (progress.next_review_at) {
    const target = new Date(progress.next_review_at).getTime();
    if (target <= now) {
      return { text: "На повторение", mod: "review" };
    }
    return {
      text: `Повтор ${formatReviewDate(progress.next_review_at, now)}`,
      mod: "learned",
    };
  }

  return { text: "Изучено", mod: "learned" };
}

function tokensToText(tokens: DictionaryPhrase["tokens"]): string {
  let out = "";
  for (const token of tokens) {
    out += token.text;
    if (token.space_after) out += " ";
  }
  return out.trim();
}

export function PhrasesCardBlock({
  phrase,
  now,
  onProgressChange,
}: PhrasesCardBlockProps) {
  const { refreshUser } = useAuth();
  const [pending, setPending] = useState(false);

  const status = getProgressLabel(phrase, now);
  const isStarted = phrase.progress !== null;
  const exampleText =
    phrase.tokens.length > 0 ? tokensToText(phrase.tokens) : "";

  const handleToggle = async () => {
    if (pending) return;
    setPending(true);

    try {
      if (isStarted) {
        await deleteUserPhrase(phrase.id);
        onProgressChange(phrase.id, null);
      } else {
        await startUserPhrase(phrase.id);
        onProgressChange(phrase.id, {
          interval_days: 0,
          next_review_at: null,
          is_learned: false,
        });
      }
      await refreshUser();
    } catch {
      // молча
    } finally {
      setPending(false);
    }
  };

  return (
    <article className="card dictionary-card">
      <header className="dictionary-card__header">
        <div className="dictionary-card__main">
          <h3 className="dictionary-card__hangul">{phrase.hangul}</h3>
          <p className="dictionary-card__translation">{phrase.translation}</p>
        </div>
        <span
          className={`dictionary-card__status dictionary-card__status--${status.mod}`}
        >
          {status.text}
        </span>
      </header>

      <div className="dictionary-card__meta">
        {phrase.level && (
          <span className="dictionary-card__chip dictionary-card__chip--level">
            {phrase.level.title}
          </span>
        )}
        {phrase.topics.map((topic) => (
          <span
            key={topic.id}
            className="dictionary-card__chip dictionary-card__chip--topic"
          >
            {topic.title}
          </span>
        ))}
        {phrase.grammar_rules.map((rule) => (
          <span
            key={rule.id}
            className="dictionary-card__chip dictionary-card__chip--pos"
          >
            {rule.title}
          </span>
        ))}
      </div>

      {exampleText && exampleText !== phrase.hangul && (
        <div className="dictionary-card__example">
          <p className="dictionary-card__example-hangul">{exampleText}</p>
        </div>
      )}

      <button
        type="button"
        className={
          "btn btn--sm " +
          (isStarted ? "btn--outline" : "btn--accent") +
          " dictionary-card__action"
        }
        onClick={handleToggle}
        disabled={pending}
      >
        {pending ? "…" : isStarted ? "Сбросить" : "Начать учить"}
      </button>
    </article>
  );
}
