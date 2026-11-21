import { Link } from "react-router-dom";
import { ArrowRight, Clapperboard } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { BREAKDOWNS } from "./breakdownData";
import { getProgress } from "./breakdownStorage";
import BreakdownCard from "./BreakdownCard";

function ownerFor(userId: number | undefined): string {
  return userId ? String(userId) : "guest";
}

export default function BreakdownsHomeTab() {
  const { user } = useAuth();
  const owner = ownerFor(user?.id);
  const progress = getProgress(owner);

  const continueItems = BREAKDOWNS.filter((item) => {
    const entry = progress[item.id];
    return entry && !entry.completed;
  }).slice(0, 3);

  return (
    <div className="breakdowns-home">
      <section className="breakdowns-hero">
        <div className="breakdowns-hero__copy">
          <span className="breakdowns-hero__eyebrow">
            <Clapperboard size={15} aria-hidden="true" />
            Учись на живом контенте
          </span>
          <h2>Смотри, читай и разбирай — без скучных текстов</h2>
          <p>
            Манхва и дорамы с корейскими репликами, переводом по кнопке и
            разбором слов и грамматики. Смотри в своём темпе и сохраняй фразы
            для практики.
          </p>
          <Link to="/breakdowns?tab=catalog" className="btn btn--accent">
            Открыть каталог
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="breakdowns-hero__art" aria-hidden="true">
          <span>읽고</span>
          <span>보고</span>
          <span>이해해요</span>
        </div>
      </section>

      {continueItems.length > 0 && (
        <section className="breakdowns-section">
          <div className="breakdowns-section__head">
            <h2>Продолжить</h2>
            <Link to="/breakdowns?tab=account" className="breakdowns-section__link">
              Все мои разборы
            </Link>
          </div>
          <div className="breakdowns-grid breakdowns-grid--small">
            {continueItems.map((item) => (
              <BreakdownCard
                key={item.id}
                item={item}
                completed={progress[item.id]?.completed}
              />
            ))}
          </div>
        </section>
      )}

      <section className="breakdowns-section">
        <div className="breakdowns-section__head">
          <h2>Обновления</h2>
          <Link to="/breakdowns?tab=catalog" className="breakdowns-section__link">
            Смотреть всё
          </Link>
        </div>
        <div className="breakdowns-grid">
          {BREAKDOWNS.map((item) => (
            <BreakdownCard
              key={item.id}
              item={item}
              completed={progress[item.id]?.completed}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
