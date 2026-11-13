import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import {
  deleteUserWord,
  getDailyWord,
  startUserWord,
  type DictionaryWord,
} from "../../api/dictionary";
import { useAuth } from "../../context/useAuth";

const TICK_MS = 60_000;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    });
  } catch {
    return iso;
  }
}

function currentDayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

export function DailyWordBlock() {
  const { refreshUser } = useAuth();
  const [word, setWord] = useState<DictionaryWord | null>(null);
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [dayKey, setDayKey] = useState<string>(() => currentDayKey());

  useEffect(() => {
    const id = window.setInterval(() => {
      const next = currentDayKey();
      setDayKey((prev) => (prev === next ? prev : next));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getDailyWord()
      .then((res) => {
        if (cancelled) return;
        setWord(res.word);
        setDate(res.date);
      })
      .catch(() => {
        if (!cancelled) setWord(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dayKey]);

  const isStarted = word?.progress !== null && word?.progress !== undefined;

  const handleToggle = async () => {
    if (!word || pending) return;
    setPending(true);

    try {
      if (isStarted) {
        await deleteUserWord(word.id);
        setWord({ ...word, progress: null });
      } else {
        await startUserWord(word.id);
        setWord({
          ...word,
          progress: {
            interval_days: 0,
            next_review_at: null,
            is_learned: false,
          },
        });
      }
      await refreshUser();
    } catch {
      // молча
    } finally {
      setPending(false);
    }
  };

  if (loading) {
    return (
      <aside className="daily-word-block daily-word-block--state">
        <p className="daily-word-block__state-text">Загрузка слова дня…</p>
      </aside>
    );
  }

  if (!word) {
    return null;
  }

  return (
    <aside className="daily-word-block">
      <div className="daily-word-block__head">
        <CalendarDays size={16} />
        <span className="daily-word-block__title">Слово дня</span>
        {date && (
          <span className="daily-word-block__date">{formatDate(date)}</span>
        )}
      </div>

      <div className="daily-word-block__body">
        <p className="daily-word-block__hangul">{word.hangul}</p>
        <p className="daily-word-block__translation">{word.translation}</p>
      </div>

      <button
        type="button"
        className={
          "btn btn--sm " +
          (isStarted ? "btn--outline" : "btn--accent") +
          " daily-word-block__action"
        }
        onClick={handleToggle}
        disabled={pending}
      >
        {pending ? "…" : isStarted ? "Сбросить" : "Начать учить"}
      </button>
    </aside>
  );
}
