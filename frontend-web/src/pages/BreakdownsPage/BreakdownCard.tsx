import { Link } from "react-router-dom";
import { BookOpen, Clapperboard, Sparkles } from "lucide-react";
import type { BreakdownItem } from "./breakdownData";

interface BreakdownCardProps {
  item: BreakdownItem;
  completed?: boolean;
}

function kindLabel(kind: BreakdownItem["kind"]): string {
  return kind === "manga" ? "Манхва" : "Дорама";
}

export default function BreakdownCard({ item, completed }: BreakdownCardProps) {
  return (
    <Link
      to={`/breakdowns/${item.id}`}
      className="breakdown-card"
      aria-label={`${item.title} — ${kindLabel(item.kind)}`}
    >
      <div
        className="breakdown-card__cover"
        style={{
          background: `linear-gradient(140deg, ${item.cover.from}, ${item.cover.to})`,
          color: item.cover.ink,
        }}
      >
        <span className="breakdown-card__kind">
          {item.kind === "manga" ? (
            <BookOpen size={14} aria-hidden="true" />
          ) : (
            <Clapperboard size={14} aria-hidden="true" />
          )}
          {kindLabel(item.kind)}
        </span>
        <span className="breakdown-card__cover-title">
          {item.originalTitle}
        </span>
        <span className="breakdown-card__cover-sub">{item.title}</span>
        {completed && (
          <span className="breakdown-card__done">
            <Sparkles size={13} aria-hidden="true" />
            разобрано
          </span>
        )}
      </div>

      <div className="breakdown-card__body">
        <div className="breakdown-card__line">
          <strong>{item.title}</strong>
          <span className="breakdown-card__level">{item.level}</span>
        </div>
        <span className="breakdown-card__latest">
          {item.latest} · {item.updatedAt}
        </span>
        <span className="breakdown-card__genres">{item.genres.join(" · ")}</span>
      </div>
    </Link>
  );
}
