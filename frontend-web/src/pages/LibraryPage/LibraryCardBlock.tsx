import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { LibraryItem } from "../../types/library";

interface LibraryCardBlockProps {
  item: LibraryItem;
}

const LANGUAGE_LABELS: Record<string, string> = {
  ko: "Корейский",
  ru: "Русский",
  mixed: "Смешанный",
};

const STORAGE_PREFIX = "hanibo:library:lastPage:";

export default function LibraryCardBlock({ item }: LibraryCardBlockProps) {
  const [progress, setProgress] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(0);

  // Читаем сохраненную страницу при монтировании и при возврате на страницу (visibilitychange)
  useEffect(() => {
    const checkProgress = () => {
      if (!item.file_url || !item.pages) return;
      try {
        const saved = localStorage.getItem(STORAGE_PREFIX + item.file_url);
        if (saved) {
          const page = Number(saved);
          if (page > 0) {
            setLastPage(page);
            // Считаем прогресс: если страница 1, прогресс 0%, если последняя - 100%
            const percent = Math.min(
              100,
              Math.max(0, Math.round((page / item.pages) * 100)),
            );
            setProgress(percent);
            return;
          }
        }
        setLastPage(0);
        setProgress(0);
      } catch {
        /* noop */
      }
    };

    checkProgress();

    // Обновляем при возврате на вкладку (например, после чтения в другой вкладке)
    window.addEventListener("focus", checkProgress);
    return () => window.removeEventListener("focus", checkProgress);
  }, [item.file_url, item.pages]);

  return (
    <Link to={`/library/${item.id}`} className="library-card-block">
      <div className="library-card-block__cover">
        {item.cover_url ? (
          <img src={item.cover_url} alt={item.title} loading="lazy" />
        ) : (
          <div className="library-card-block__cover-fallback">{item.title}</div>
        )}

        <div className="library-card-block__overlay">
          <h3 className="library-card-block__overlay-title">{item.title}</h3>
          {item.author && (
            <p className="library-card-block__overlay-author">{item.author}</p>
          )}

          <div className="library-card-block__overlay-meta">
            {item.level && <span>{item.level}</span>}
            {item.language && (
              <span>{LANGUAGE_LABELS[item.language] ?? item.language}</span>
            )}
            {item.year && <span>{item.year}</span>}
            {item.pages && <span>{item.pages} стр.</span>}
          </div>

          {item.description && (
            <p className="library-card-block__overlay-desc">
              {item.description}
            </p>
          )}
        </div>

        {/* Полоска прогресса и текст */}
        {progress > 0 && (
          <div
            className="library-card-block__progress"
            title={`Прочитано: ${lastPage} из ${item.pages} стр.`}
          >
            <div
              className="library-card-block__progress-bar"
              style={{ width: `${progress}%` }}
            />
            <span className="library-card-block__progress-text">
              {lastPage} / {item.pages}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
