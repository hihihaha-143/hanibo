import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DictionaryPhrase, PhraseProgress } from "../../api/dictionary";
import { PhrasesCardBlock } from "./PhrasesCardBlock";

interface PhrasesGridBlockProps {
  phrases: DictionaryPhrase[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  now: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onProgressChange: (phraseId: number, progress: PhraseProgress | null) => void;
}

function getPageNumbers(current: number, last: number): (number | "…")[] {
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1);
  }

  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);

  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < last - 1) pages.push("…");
  pages.push(last);

  return pages;
}

export function PhrasesGridBlock({
  phrases,
  loading,
  error,
  currentPage,
  lastPage,
  now,
  onPageChange,
  onRetry,
  onProgressChange,
}: PhrasesGridBlockProps) {
  if (error) {
    return (
      <div className="dictionary-grid dictionary-grid--state">
        <p className="dictionary-grid__state-text dictionary-grid__state-text--error">
          {error}
        </p>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={onRetry}
        >
          Повторить
        </button>
      </div>
    );
  }

  if (loading && phrases.length === 0) {
    return (
      <div className="dictionary-grid dictionary-grid--state">
        <p className="dictionary-grid__state-text">Загрузка фраз…</p>
      </div>
    );
  }

  if (phrases.length === 0) {
    return (
      <div className="dictionary-grid dictionary-grid--state">
        <p className="dictionary-grid__state-text">
          Ничего не найдено. Попробуй изменить фильтры.
        </p>
      </div>
    );
  }

  return (
    <div className="dictionary-grid-block">
      <div
        className={
          "dictionary-grid" + (loading ? " dictionary-grid--loading" : "")
        }
      >
        {phrases.map((phrase) => (
          <PhrasesCardBlock
            key={phrase.id}
            phrase={phrase}
            now={now}
            onProgressChange={onProgressChange}
          />
        ))}
      </div>

      {lastPage > 1 && (
        <nav className="dictionary-pagination" aria-label="Пагинация фраз">
          <button
            type="button"
            className="dictionary-pagination__btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            aria-label="Предыдущая страница"
          >
            <ChevronLeft size={18} />
          </button>

          {getPageNumbers(currentPage, lastPage).map((page, idx) =>
            page === "…" ? (
              <span key={`dots-${idx}`} className="dictionary-pagination__dots">
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={
                  "dictionary-pagination__btn" +
                  (page === currentPage
                    ? " dictionary-pagination__btn--active"
                    : "")
                }
                onClick={() => onPageChange(page)}
                disabled={loading}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            className="dictionary-pagination__btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= lastPage || loading}
            aria-label="Следующая страница"
          >
            <ChevronRight size={18} />
          </button>
        </nav>
      )}
    </div>
  );
}
