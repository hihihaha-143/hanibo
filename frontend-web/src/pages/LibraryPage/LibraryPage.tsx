import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchLibraryItems } from "../../api/library";
import type { LibraryItem, LibraryItemType } from "../../types/library";
import LibraryToolbarBlock from "./LibraryToolbarBlock";
import LibraryGridBlock from "./LibraryGridBlock";
import LibraryShelfBlock from "./LibraryShelfBlock";

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<LibraryItemType | null>(null);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchLibraryItems();
      setItems(data);
    } catch (e) {
      console.error("Не удалось загрузить библиотеку:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleReset = () => {
    setQuery("");
    setActiveType(null);
    setActiveLevel(null);
    setActiveLanguage(null);
    setActiveYear(null);
  };

  const levels = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.level && set.add(i.level));
    return Array.from(set).sort();
  }, [items]);

  const languages = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.language && set.add(i.language));
    return Array.from(set).sort();
  }, [items]);

  const years = useMemo(() => {
    const set = new Set<number>();
    items.forEach((i) => i.year && set.add(i.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (activeType && item.type !== activeType) return false;
      if (activeLevel && item.level !== activeLevel) return false;
      if (activeLanguage && item.language !== activeLanguage) return false;
      if (activeYear !== null && item.year !== activeYear) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.author ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, query, activeType, activeLevel, activeLanguage, activeYear]);

  return (
    <div className="library-page">
      <LibraryToolbarBlock
        query={query}
        onQueryChange={setQuery}
        activeType={activeType}
        onTypeChange={setActiveType}
        levels={levels}
        activeLevel={activeLevel}
        onLevelChange={setActiveLevel}
        languages={languages}
        activeLanguage={activeLanguage}
        onLanguageChange={setActiveLanguage}
        years={years}
        activeYear={activeYear}
        onYearChange={setActiveYear}
        onReset={handleReset}
      />
      <div className="library-page__grid-wrap">
        <LibraryShelfBlock />
        <LibraryGridBlock
          items={filtered}
          loading={loading}
          error={error}
          onRetry={load}
        />
      </div>
    </div>
  );
}
