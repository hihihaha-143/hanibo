import { useState } from "react";
import {
  deleteUserWord,
  startUserWord,
  type DictionaryWord,
  type WordProgress,
} from "../../api/dictionary";

interface DictionaryCardBlockProps {
  word: DictionaryWord;
  onProgressChange: (wordId: number, progress: WordProgress | null) => void;
}

function formatReviewDate(iso: string): string {
  const date = new Date(iso);
  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "сегодня";
  if (diffDays === 1) return "завтра";
  if (diffDays < 5) return `через ${diffDays} дня`;
  return `через ${diffDays} дней`;
}

function getProgressLabel(word: DictionaryWord): {
  text: string;
  mod: string;
} {
  const progress = word.progress;

  if (!progress) {
    return { text: "Не изучено", mod: "new" };
  }

  if (!progress.is_learned) {
    return { text: "В процессе", mod: "progress" };
  }

  if (progress.next_review_at) {
    const date = new Date(progress.next_review_at);
    if (date.getTime() <= Date.now()) {
      return { text: "На повторение", mod: "review" };
    }
    return {
      text: `Повтор ${formatReviewDate(progress.next_review_at)}`,
      mod: "learned",
    };
  }

  return { text: "Изучено", mod: "learned" };
}

export function DictionaryCardBlock({
  word,
  onProgressChange,
}: DictionaryCardBlockProps) {
  const [pending, setPending] = useState(false);

  const status = getProgressLabel(word);
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
    } catch {
      // молча: пользователь увидит, что ничего не изменилось
    } finally {
      setPending(false);
    }
  };

  return (
    <article className="dictionary-card">
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
