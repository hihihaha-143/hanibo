import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import type { LibraryItem } from "../../types/library";
import { getLastPage } from "../../lib/libraryRecent";

interface LibraryContinueBlockProps {
  item: LibraryItem;
}

export default function LibraryContinueBlock({
  item,
}: LibraryContinueBlockProps) {
  const page = getLastPage(item);
  const total = item.pages;

  return (
    <Link to={`/library/${item.id}`} className="library-continue-block">
      <div className="library-continue-block__cover">
        {item.cover_url ? (
          <img src={item.cover_url} alt={item.title} />
        ) : (
          <BookOpen size={32} />
        )}
      </div>
      <div className="library-continue-block__info">
        <div className="library-continue-block__label">Продолжить чтение</div>
        <div className="library-continue-block__title">{item.title}</div>
        {item.author && (
          <div className="library-continue-block__author">{item.author}</div>
        )}
        <div className="library-continue-block__page">
          Стр. {page} {total ? `из ${total}` : ""}
        </div>
      </div>
      <div className="library-continue-block__btn">Продолжить</div>
    </Link>
  );
}
