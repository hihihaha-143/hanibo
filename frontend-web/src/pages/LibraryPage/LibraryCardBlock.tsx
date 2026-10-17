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

export default function LibraryCardBlock({ item }: LibraryCardBlockProps) {
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
      </div>
    </Link>
  );
}
