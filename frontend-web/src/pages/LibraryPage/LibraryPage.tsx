import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { fetchLibraryItems } from "../../api/library";
import type { LibraryItem, LibraryItemType } from "../../types/library";
import { readRecent, type RecentEntry } from "../../lib/libraryRecent";
import LibraryToolbarBlock, { type LibrarySort } from "./LibraryToolbarBlock";
import LibraryGridBlock from "./LibraryGridBlock";
import LibraryShelfBlock from "./LibraryShelfBlock";
import LibraryContinueBlock from "./LibraryContinueBlock";
import LibraryRecentBlock from "./LibraryRecentBlock";
import AchievementsStrip from "../../components/AchievementsStrip/AchievementsStrip";

const LIBRARY_TYPES: LibraryItemType[] = [
  "textbook",
  "dictionary",
  "book",
  "workbook",
  "flashcards",
];
const LIBRARY_SORTS: LibrarySort[] = ["newest", "title", "year"];

export default function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [recentData, setRecentData] = useState<RecentEntry[]>([]);

  const [query, setQuery] = useState(() => searchParams.get("search") ?? "");
  const [activeType, setActiveType] = useState<LibraryItemType | null>(() => {
    const value = searchParams.get("type");
    return LIBRARY_TYPES.includes(value as LibraryItemType)
      ? (value as LibraryItemType)
      : null;
  });
  const [activeLevel, setActiveLevel] = useState<string | null>(
    () => searchParams.get("level") || null,
  );
  const [activeLanguage, setActiveLanguage] = useState<string | null>(
    () => searchParams.get("language") || null,
  );
  const [activeYear, setActiveYear] = useState<number | null>(() => {
    const value = Number(searchParams.get("year"));
    return Number.isFinite(value) && value > 0 ? value : null;
  });
  const [sort, setSort] = useState<LibrarySort>(() => {
    const value = searchParams.get("sort") as LibrarySort | null;
    return value && LIBRARY_SORTS.includes(value) ? value : "newest";
  });

  const location = useLocation();

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

  useEffect(() => {
    setRecentData(readRecent());
  }, [items, location.pathname]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set("search", query.trim());
    if (activeType) next.set("type", activeType);
    if (activeLevel) next.set("level", activeLevel);
    if (activeLanguage) next.set("language", activeLanguage);
    if (activeYear !== null) next.set("year", String(activeYear));
    if (sort !== "newest") next.set("sort", sort);
    setSearchParams(next, { replace: true });
  }, [
    query,
    activeType,
    activeLevel,
    activeLanguage,
    activeYear,
    sort,
    setSearchParams,
  ]);

  const handleReset = () => {
    setQuery("");
    setActiveType(null);
    setActiveLevel(null);
    setActiveLanguage(null);
    setActiveYear(null);
    setSort("newest");
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

  const sorted = useMemo(() => {
    const result = [...filtered];
    switch (sort) {
      case "title":
        result.sort((a, b) =>
          a.title.localeCompare(b.title, "ru", { sensitivity: "base" }),
        );
        break;
      case "year":
        result.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }
    return result;
  }, [filtered, sort]);

  const continueItem = useMemo<LibraryItem | null>(() => {
    if (items.length === 0 || recentData.length === 0) return null;
    for (const entry of recentData) {
      const found = items.find((i) => i.id === entry.id);
      if (found) return found;
    }
    return null;
  }, [items, recentData]);

  const recentItems = useMemo<LibraryItem[]>(() => {
    if (items.length === 0 || recentData.length === 0) return [];
    const byId = new Map(items.map((i) => [i.id, i]));
    const result: LibraryItem[] = [];
    for (const entry of recentData) {
      if (entry.id === continueItem?.id) continue;
      const found = byId.get(entry.id);
      if (found) result.push(found);
    }
    return result;
  }, [items, continueItem, recentData]);

  return (
    <div className="page library-page">
      <header className="page__header library-page__header">
        <h1 className="page__title">Библиотека</h1>
        <p className="library-page__subtitle">
          Учебники, словари и материалы для чтения
        </p>
      </header>

      <AchievementsStrip categoryCode="library" />

      {continueItem && <LibraryContinueBlock item={continueItem} />}

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
        sort={sort}
        onSortChange={setSort}
      />

      <LibraryRecentBlock items={recentItems} />

      <div className="library-page__grid-wrap">
        <LibraryShelfBlock view="grid" />
        <LibraryGridBlock
          items={sorted}
          loading={loading}
          error={error}
          onRetry={load}
        />
      </div>
    </div>
  );
}
