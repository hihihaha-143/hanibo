import { Search, RotateCcw } from "lucide-react";
import type { LibraryItemType } from "../../types/library";

export type LibrarySort = "newest" | "title" | "year";
export type LibraryView = "grid" | "list";

interface LibraryToolbarBlockProps {
  query: string;
  onQueryChange: (value: string) => void;
  activeType: LibraryItemType | null;
  onTypeChange: (value: LibraryItemType | null) => void;
  levels: string[];
  activeLevel: string | null;
  onLevelChange: (value: string | null) => void;
  languages: string[];
  activeLanguage: string | null;
  onLanguageChange: (value: string | null) => void;
  years: number[];
  activeYear: number | null;
  onYearChange: (value: number | null) => void;
  onReset: () => void;
  sort: LibrarySort;
  onSortChange: (value: LibrarySort) => void;
}

const TYPE_LABELS: Record<LibraryItemType, string> = {
  textbook: "Учебники",
  dictionary: "Словари",
  book: "Книги",
  workbook: "Рабочие тетради",
  flashcards: "Карточки слов",
};

const TYPE_ORDER: LibraryItemType[] = [
  "textbook",
  "dictionary",
  "book",
  "workbook",
  "flashcards",
];

const LANGUAGE_LABELS: Record<string, string> = {
  ko: "Корейский",
  ru: "Русский",
  mixed: "Смешанный",
};

const SORT_LABELS: Record<LibrarySort, string> = {
  newest: "Сначала новые",
  title: "По названию",
  year: "По году",
};

export default function LibraryToolbarBlock({
  query,
  onQueryChange,
  activeType,
  onTypeChange,
  levels,
  activeLevel,
  onLevelChange,
  languages,
  activeLanguage,
  onLanguageChange,
  years,
  activeYear,
  onYearChange,
  onReset,
  sort,
  onSortChange,
}: LibraryToolbarBlockProps) {
  const toggleType = (type: LibraryItemType) => {
    onTypeChange(activeType === type ? null : type);
  };

  const hasActiveFilters =
    query.trim() !== "" ||
    activeType !== null ||
    activeLevel !== null ||
    activeLanguage !== null ||
    activeYear !== null;

  return (
    <div className="library-toolbar-block">
      <div className="library-toolbar-block__chips">
        <button
          type="button"
          className={`chip${activeType === null ? " chip--active" : ""}`}
          onClick={() => onTypeChange(null)}
          aria-pressed={activeType === null}
        >
          Все
        </button>
        {TYPE_ORDER.map((type) => (
          <button
            key={type}
            type="button"
            className={`chip${activeType === type ? " chip--active" : ""}`}
            onClick={() => toggleType(type)}
            aria-pressed={activeType === type}
          >
            {TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      <div className="input-wrap library-toolbar-block__search">
        <span className="input-wrap__icon" aria-hidden="true">
          <Search size={18} />
        </span>
        <input
          type="search"
          className="input input--pill input--with-icon"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Поиск по названию или автору…"
          aria-label="Поиск по названию или автору"
        />
      </div>

      <div className="library-toolbar-block__filters">
        <select
          value={activeLevel ?? ""}
          onChange={(e) => onLevelChange(e.target.value || null)}
          className="select"
          aria-label="Фильтр по уровню"
        >
          <option value="">Уровень: любой</option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <select
          value={activeLanguage ?? ""}
          onChange={(e) => onLanguageChange(e.target.value || null)}
          className="select"
          aria-label="Фильтр по языку"
        >
          <option value="">Язык: любой</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {LANGUAGE_LABELS[lang] ?? lang}
            </option>
          ))}
        </select>

        <select
          value={activeYear ?? ""}
          onChange={(e) =>
            onYearChange(e.target.value ? Number(e.target.value) : null)
          }
          className="select"
          aria-label="Фильтр по году"
        >
          <option value="">Год: любой</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as LibrarySort)}
          className="select"
          aria-label="Сортировка"
        >
          {(Object.keys(SORT_LABELS) as LibrarySort[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={onReset}
            title="Сбросить фильтры"
          >
            <RotateCcw size={16} />
            <span>Сбросить</span>
          </button>
        )}
      </div>
    </div>
  );
}
