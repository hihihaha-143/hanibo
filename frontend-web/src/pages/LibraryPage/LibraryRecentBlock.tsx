import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import type { LibraryItem } from "../../types/library";

interface LibraryRecentBlockProps {
  items: LibraryItem[];
}

export default function LibraryRecentBlock({ items }: LibraryRecentBlockProps) {
  if (items.length === 0) return null;

  return (
    <div className="library-recent-block">
      <div className="library-recent-block__title">Недавно открытые</div>
      <div className="library-recent-block__list">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/library/${item.id}`}
            className="library-recent-block__item"
            title={item.title}
          >
            <div className="library-recent-block__cover">
              {item.cover_url ? (
                <img src={item.cover_url} alt={item.title} />
              ) : (
                <BookOpen size={20} />
              )}
            </div>
            <div className="library-recent-block__name">{item.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
