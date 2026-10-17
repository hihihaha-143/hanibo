import type { LibraryItem } from "../../types/library";
import LibraryCardBlock from "./LibraryCardBlock";
import StateBlock from "../../components/StateBlock/StateBlock";

interface LibraryGridBlockProps {
  items: LibraryItem[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

export default function LibraryGridBlock({
  items,
  loading,
  error,
  onRetry,
}: LibraryGridBlockProps) {
  if (loading) return <StateBlock variant="loading" />;
  if (error) return <StateBlock variant="error" onRetry={onRetry} />;
  if (items.length === 0) return <StateBlock variant="empty" />;

  return (
    <div className="library-grid-block">
      {items.map((item) => (
        <LibraryCardBlock key={item.id} item={item} />
      ))}
    </div>
  );
}