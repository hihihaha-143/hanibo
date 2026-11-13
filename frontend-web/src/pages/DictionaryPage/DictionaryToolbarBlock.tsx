import { Search, Gamepad2 } from "lucide-react";
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
}: DictionaryToolbarBlockProps) {
  return (
    <div className="library-toolbar-block">
      <div className="library-toolbar-block__search">
        <Search size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по слову или переводу..."
        />
      </div>

      <div className="library-toolbar-block__filters">
        <select
          value={tab}
          onChange={(e) => onTabChange(e.target.value as DictionaryTab)}
          className="library-toolbar-block__select"
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
          className="library-toolbar-block__select"
        >
          <option value="">Тема: любая</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="btn btn--outline btn--sm library-toolbar-block__minigames"
          onClick={onOpenMiniGames}
        >
          <Gamepad2 size={16} />
          <span>Мини-игры</span>
        </button>
      </div>
    </div>
  );
}
