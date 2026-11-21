import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BREAKDOWNS } from "./breakdownData";
import BreakdownCard from "./BreakdownCard";
import type { BreakdownKind } from "./breakdownData";

type FilterKind = "all" | BreakdownKind;

const KIND_FILTERS: { id: FilterKind; label: string }[] = [
  { id: "all", label: "Всё" },
  { id: "manga", label: "Манхва" },
  { id: "drama", label: "Дорама" },
];

export default function BreakdownsCatalogTab() {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<FilterKind>("all");
  const [level, setLevel] = useState("all");

  const levels = useMemo(
    () => [...new Set(BREAKDOWNS.map((item) => item.level))].sort(),
    [],
  );

  const items = useMemo(() => {
    const query = search.trim().toLowerCase();
    return BREAKDOWNS.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (level !== "all" && item.level !== level) return false;
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.originalTitle.toLowerCase().includes(query) ||
        item.genres.some((genre) => genre.toLowerCase().includes(query))
      );
    });
  }, [search, kind, level]);

  return (
    <div className="breakdowns-catalog">
      <div className="breakdowns-catalog__toolbar">
        <div className="input-wrap breakdowns-catalog__search">
          <span className="input-wrap__icon" aria-hidden="true">
            <Search size={18} />
          </span>
          <input
            type="search"
            className="input input--pill input--with-icon"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Название, жанр или оригинал"
            aria-label="Поиск разборов"
          />
        </div>

        <select
          className="select breakdowns-catalog__level"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          aria-label="Уровень"
        >
          <option value="all">Уровень: любой</option>
          {levels.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="breakdowns-catalog__filters">
        {KIND_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={
              "chip" +
              (kind === filter.id ? " chip--active" : "")
            }
            onClick={() => setKind(filter.id)}
            aria-pressed={kind === filter.id}
          >
            {filter.label}
          </button>
        ))}
        <span className="breakdowns-catalog__count">
          {items.length} {items.length === 1 ? "разбор" : "разборов"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="breakdowns-empty">
          <p>Ничего не найдено. Попробуй изменить фильтры.</p>
        </div>
      ) : (
        <div className="breakdowns-grid">
          {items.map((item) => (
            <BreakdownCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
