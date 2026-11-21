import { Search, Gamepad2 } from "lucide-react";
import type {
  GrammarFormRef,
  GrammarLevelRef,
  GrammarTabId,
} from "../../api/grammar";

const TABS: { key: GrammarTabId; label: string }[] = [
  { key: "all", label: "Все правила" },
  { key: "progress", label: "В процессе" },
  { key: "learned", label: "Изучено" },
  { key: "review", label: "На повторение" },
];

interface GrammarToolbarBlockProps {
  search: string;
  onSearchChange: (value: string) => void;
  tab: GrammarTabId;
  onTabChange: (tab: GrammarTabId) => void;
  forms: GrammarFormRef[];
  formId: number | null;
  onFormChange: (id: number | null) => void;
  levels: GrammarLevelRef[];
  levelId: number | null;
  onLevelChange: (id: number | null) => void;
  onOpenMiniGames: () => void;
}

export function GrammarToolbarBlock({
  search,
  onSearchChange,
  tab,
  onTabChange,
  forms,
  formId,
  onFormChange,
  levels,
  levelId,
  onLevelChange,
  onOpenMiniGames,
}: GrammarToolbarBlockProps) {
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
          placeholder="Поиск по названию или конструкции..."
          aria-label="Поиск по названию или конструкции..."
        />
      </div>

      <div className="library-toolbar-block__filters">
        <select
          value={tab}
          onChange={(e) => onTabChange(e.target.value as GrammarTabId)}
          className="select"
        >
          {TABS.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          value={formId ?? ""}
          onChange={(e) =>
            onFormChange(e.target.value ? Number(e.target.value) : null)
          }
          className="select"
        >
          <option value="">Форма: любая</option>
          {forms.map((form) => (
            <option key={form.id} value={form.id}>
              {form.title}
            </option>
          ))}
        </select>

        <select
          value={levelId ?? ""}
          onChange={(e) =>
            onLevelChange(e.target.value ? Number(e.target.value) : null)
          }
          className="select"
        >
          <option value="">Уровень: любой</option>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.title}
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
