import { Search, Gamepad2, RotateCcw } from "lucide-react";
import type { Topic } from "../../api/course";
import type { DictionaryTab } from "../../api/dictionary";

const TABS: { key: DictionaryTab; label: string }[] = [
  { key: "all", label: "Все слова" },
  { key: "progress", label: "В процессе" },
  { key: "learned", label: "Изучено" },
  { key: "review", label: "На повторение" },
];

interface DictionaryToolbarBlockProps {
  search: string;
  onSearchChange: (value: string) => void;
  tab: DictionaryTab;
  onTabChange: (tab: DictionaryTab) => void;
  topics: Topic[];
  topicId: number | null;
  onTopicChange: (id: number | null) => void;
  onOpenMiniGames: () => void;
  onReset: () => void;
  hasFilters: boolean;
}

export function DictionaryToolbarBlock({
  search,
  onSearchChange,
  tab,
  onTabChange,
  topics,
  topicId,
  onTopicChange,
  onOpenMiniGames,
  onReset,
  hasFilters,
}: DictionaryToolbarBlockProps) {
  return (
    <div className="library-toolbar-block">
      <div className="input-wrap library-toolbar-block__search">
        <span className="input-wrap__icon" aria-hidden="true">
          <Search size={18} />
        </span>
        <input
          type="search"
          className="input input--pill input--with-icon"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по слову или переводу..."
          aria-label="Поиск по слову или переводу..."
        />
      </div>

      <div className="library-toolbar-block__filters">
        <select
          value={tab}
          onChange={(e) => onTabChange(e.target.value as DictionaryTab)}
          className="select"
        >
          {TABS.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          value={topicId ?? ""}
          onChange={(e) =>
            onTopicChange(e.target.value ? Number(e.target.value) : null)
          }
          className="select"
        >
          <option value="">Тема: любая</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={onReset}
            title="Сбросить поиск и фильтры"
          >
            <RotateCcw size={16} />
            <span>Сбросить</span>
          </button>
        )}

        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={onOpenMiniGames}
        >
          <Gamepad2 size={16} />
          <span>Мини-игры</span>
        </button>
      </div>
    </div>
  );
}
