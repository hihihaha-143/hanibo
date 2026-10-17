import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLibraryItem } from "../../api/library";
import type { LibraryItem } from "../../types/library";
import LibraryViewerBlock from "./LibraryViewerBlock";
import StateBlock from "../../components/StateBlock/StateBlock";

export default function LibraryViewPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<LibraryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const data = await fetchLibraryItem(id);
      setItem(data);
    } catch (e) {
      console.error("Не удалось загрузить книгу:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <StateBlock variant="loading" />;
  if (error || !item) return <StateBlock variant="error" onRetry={load} />;

  return (
    <div className="library-view-page">
      <LibraryViewerBlock item={item} />
    </div>
  );
}
