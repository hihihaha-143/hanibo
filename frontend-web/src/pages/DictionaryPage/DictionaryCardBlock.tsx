import { useState } from "react";
import {
  deleteUserWord,
  startUserWord,
  type DictionaryWord,
  type WordProgress,
} from "../../api/dictionary";
import { useAuth } from "../../context/useAuth";

interface DictionaryCardBlockProps {
  word: DictionaryWord;
  now: number;
  onProgressChange: (wordId: number, progress: WordProgress | null) => void;
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

  // Календарный «завтра» / «сегодня» по TZ пользователя
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
  word: DictionaryWord,
  now: number,
): { text: string; mod: string } {
  const progress = word.progress;

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

export function DictionaryCardBlock({
  word,
  now,
  onProgressChange,
}: DictionaryCardBlockProps) {
  const { refreshUser } = useAuth();
  const [pending, setPending] = useState(false);

  const status = getProgressLabel(word, now);
  const firstPhrase = word.phrases[0];
  const isStarted = word.progress !== null;

  const handleToggle = async () => {
    if (pending) return;
    setPending(true);

    try {
      if (isStarted) {
        await deleteUserWord(word.id);
        onProgressChange(word.id, null);
      } else {
        await startUserWord(word.id);
        onProgressChange(word.id, {
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
          <h3 className="dictionary-card__hangul">{word.hangul}</h3>
          <p className="dictionary-card__translation">{word.translation}</p>
        </div>
        <span
          className={`dictionary-card__status dictionary-card__status--${status.mod}`}
        >
          {status.text}
        </span>
      </header>

      <div className="dictionary-card__meta">
        {word.part_of_speech && (
          <span className="dictionary-card__chip dictionary-card__chip--pos">
            {word.part_of_speech.title}
          </span>
        )}
        {word.level && (
          <span className="dictionary-card__chip dictionary-card__chip--level">
            {word.level.title}
          </span>
        )}
        {word.topics.map((topic) => (
          <span
            key={topic.id}
            className="dictionary-card__chip dictionary-card__chip--topic"
          >
            {topic.title}
          </span>
        ))}
      </div>

      {firstPhrase && (
        <div className="dictionary-card__example">
          <p className="dictionary-card__example-hangul">
            {firstPhrase.hangul}
          </p>
          <p className="dictionary-card__example-translation">
            {firstPhrase.translation}
          </p>
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
