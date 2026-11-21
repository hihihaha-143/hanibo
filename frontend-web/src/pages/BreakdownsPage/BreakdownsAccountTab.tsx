import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, LogIn, Trash2 } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import SpeakControls from "../../components/SpeakButton/SpeakControls";
import { BREAKDOWNS } from "./breakdownData";
import BreakdownCard from "./BreakdownCard";
import {
  getProgress,
  getSavedPhrases,
  toggleSavedPhrase,
  type SavedBreakdownPhrase,
} from "./breakdownStorage";

function ownerFor(userId: number | undefined): string {
  return userId ? String(userId) : "guest";
}

export default function BreakdownsAccountTab() {
  const { user } = useAuth();
  const owner = ownerFor(user?.id);
  const [saved, setSaved] = useState<SavedBreakdownPhrase[]>(() =>
    getSavedPhrases(owner),
  );

  if (!user) {
    return (
      <div className="breakdowns-empty breakdowns-empty--auth">
        <Bookmark size={28} aria-hidden="true" />
        <p>
          Войди в аккаунт, чтобы сохранять прогресс разборов и фразы для
          повторения.
        </p>
        <Link to="/login" className="btn btn--accent">
          <LogIn size={16} />
          Войти
        </Link>
      </div>
    );
  }

  const progress = getProgress(owner);
  const started = BREAKDOWNS.filter(
    (item) =>
      progress[item.id] &&
      (progress[item.id].page > 0 ||
        progress[item.id].episode > 0 ||
        progress[item.id].completed),
  );
  const completed = started.filter(
    (item) => progress[item.id].completed,
  ).length;

  const handleRemove = (phrase: SavedBreakdownPhrase) => {
    toggleSavedPhrase(owner, phrase);
    setSaved(getSavedPhrases(owner));
  };

  return (
    <div className="breakdowns-account">
      <div className="breakdowns-account__stats">
        <div className="breakdowns-account__stat">
          <strong>{started.length}</strong>
          <span>разборов начато</span>
        </div>
        <div className="breakdowns-account__stat">
          <strong>{completed}</strong>
          <span>завершено</span>
        </div>
        <div className="breakdowns-account__stat">
          <strong>{saved.length}</strong>
          <span>фраз сохранено</span>
        </div>
      </div>

      <section className="breakdowns-section">
        <div className="breakdowns-section__head">
          <h2>Мои разборы</h2>
        </div>
        {started.length === 0 ? (
          <div className="breakdowns-empty">
            <p>Пока пусто. Начни с любого разбора в каталоге.</p>
            <Link to="/breakdowns?tab=catalog" className="btn btn--accent">
              В каталог
            </Link>
          </div>
        ) : (
          <div className="breakdowns-grid">
            {started.map((item) => (
              <BreakdownCard
                key={item.id}
                item={item}
                completed={progress[item.id]?.completed}
              />
            ))}
          </div>
        )}
      </section>

      <section className="breakdowns-section">
        <div className="breakdowns-section__head">
          <h2>Сохранённые фразы</h2>
        </div>
        {saved.length === 0 ? (
          <div className="breakdowns-empty">
            <p>Сохраняй фразы в разборе — они появятся здесь.</p>
          </div>
        ) : (
          <div className="breakdowns-saved">
            {saved.map((phrase) => (
              <div
                key={`${phrase.itemId}-${phrase.lineId}`}
                className="card breakdowns-saved__item"
              >
                <div className="breakdowns-saved__text">
                  <strong>{phrase.hangul}</strong>
                  <span>{phrase.translation}</span>
                  <small>{phrase.itemTitle}</small>
                </div>
                <SpeakControls
                  text={phrase.hangul}
                  className="breakdowns-saved__speak"
                />
                <button
                  type="button"
                  className="btn btn--ghost btn--icon"
                  onClick={() => handleRemove(phrase)}
                  aria-label="Удалить фразу"
                  title="Удалить фразу"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
