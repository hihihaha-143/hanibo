import { useEffect, type ReactNode } from "react";
import { ArrowLeft, X } from "lucide-react";
import { WORD_MINI_GAMES } from "./miniGamesData";
import type { AnyMiniGameId, MiniGameId } from "./miniGamesData";

interface MiniGamesModalProps<T extends AnyMiniGameId = MiniGameId> {
  open: boolean;
  onClose: () => void;
  activeGame: T | null;
  onPlay: (id: T) => void;
  onExitGame: () => void;
  games?: {
    id: T;
    title: string;
    description: string;
    icon: ReactNode;
    available: boolean;
  }[];
  title?: string;
  /** Показать возврат к списку игр, если у игры нет своей кнопки «Назад». */
  showBackToList?: boolean;
  children?: ReactNode;
}

export function MiniGamesModal<T extends AnyMiniGameId = MiniGameId>({
  open,
  onClose,
  activeGame,
  onPlay,
  onExitGame,
  games,
  title = "Мини-игры",
  showBackToList = false,
  children,
}: MiniGamesModalProps<T>) {
  const list =
    games ??
    (WORD_MINI_GAMES as unknown as MiniGamesModalProps<T>["games"]) ??
    [];

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeGame) onExitGame();
        else onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, activeGame, onExitGame]);

  if (!open) return null;

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="modal__panel mini-games-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {!activeGame && (
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        )}

        {activeGame ? (
          <>
            {showBackToList && (
              <button
                type="button"
                className="btn btn--ghost btn--sm mini-games-modal__back"
                onClick={onExitGame}
              >
                <ArrowLeft size={16} />
                К играм
              </button>
            )}
            {children}
          </>
        ) : (
          <>
            <h2 className="mini-games-modal__title">{title}</h2>

            <div className="mini-games-grid">
              {list.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  className={
                    "mini-games-grid__card" +
                    (!game.available ? " mini-games-grid__card--disabled" : "")
                  }
                  onClick={() => {
                    if (!game.available) return;
                    onPlay(game.id);
                  }}
                  disabled={!game.available}
                >
                  <span className="mini-games-grid__icon">{game.icon}</span>
                  <span className="mini-games-grid__title">{game.title}</span>
                  <span className="mini-games-grid__desc">
                    {game.description}
                  </span>
                  {!game.available && (
                    <span className="mini-games-grid__badge">Скоро</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
