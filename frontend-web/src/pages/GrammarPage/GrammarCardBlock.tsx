import type { GrammarRule } from "../../api/grammar";

interface GrammarCardBlockProps {
  rule: GrammarRule;
  onOpen: (id: number) => void;
}

function statusLabel(rule: GrammarRule): { text: string; mod: string } {
  if (rule.status === "new") {
    return { text: "Не изучено", mod: "new" };
  }
  if (rule.status === "learning") {
    return { text: "В процессе", mod: "progress" };
  }
  if (rule.status === "review") {
    return { text: "На повторение", mod: "review" };
  }
  return { text: "Изучено", mod: "learned" };
}

export function GrammarCardBlock({ rule, onOpen }: GrammarCardBlockProps) {
  const status = statusLabel(rule);

  return (
    <article
      className="dictionary-card"
      onClick={() => onOpen(rule.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(rule.id);
        }
      }}
    >
      <header className="dictionary-card__header">
        <div className="dictionary-card__main">
          <h3 className="dictionary-card__hangul">{rule.title}</h3>
          <p className="dictionary-card__translation">{rule.construction}</p>
        </div>
        <span
          className={`dictionary-card__status dictionary-card__status--${status.mod}`}
        >
          {status.text}
        </span>
      </header>

      <div className="dictionary-card__meta">
        {rule.form && (
          <span className="dictionary-card__chip dictionary-card__chip--pos">
            {rule.form.title}
          </span>
        )}
        {rule.level && (
          <span className="dictionary-card__chip dictionary-card__chip--level">
            {rule.level.title}
          </span>
        )}
      </div>
    </article>
  );
}
