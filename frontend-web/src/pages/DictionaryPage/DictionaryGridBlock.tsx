import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DictionaryWord, WordProgress } from "../../api/dictionary";
import { DictionaryCardBlock } from "./DictionaryCardBlock";

interface DictionaryGridBlockProps {
  words: DictionaryWord[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  now: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onProgressChange: (wordId: number, progress: WordProgress | null) => void;
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

export function DictionaryGridBlock({
  words,
  loading,
  error,
  currentPage,
  lastPage,
  now,
  onPageChange,
  onRetry,
  onProgressChange,
}: DictionaryGridBlockProps) {
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

  if (loading && words.length === 0) {
    return (
      <div className="dictionary-grid dictionary-grid--state">
        <p className="dictionary-grid__state-text">Загрузка слов…</p>
      </div>
    );
  }

  if (words.length === 0) {
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
        {words.map((word) => (
          <DictionaryCardBlock
            key={word.id}
            word={word}
            now={now}
            onProgressChange={onProgressChange}
          />
        ))}
      </div>

      {lastPage > 1 && (
        <nav className="dictionary-pagination" aria-label="Пагинация словаря">
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
