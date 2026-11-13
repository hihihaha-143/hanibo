import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import {
  Volume2,
  Puzzle,
  Layers,
  ArrowLeftRight,
  Gauge,
  SpellCheck,
  CheckCheck,
  Keyboard,
} from "lucide-react";

export type MiniGameId =
  | "audio-choose"
  | "syllable-gap"
  | "match"
  | "syllable-order"
  | "speed"
  | "correct-spelling"
  | "true-false"
  | "text-input";

interface MiniGameInfo {
  id: MiniGameId;
  title: string;
  description: string;
  icon: ReactNode;
  available: boolean;
}

const MINI_GAMES: MiniGameInfo[] = [
  {
    id: "true-false",
    title: "Правда или ложь",
    description: "Пара «слово — перевод»: верно ли?",
    icon: <CheckCheck size={22} />,
    available: true,
  },
  {
    id: "audio-choose",
    title: "Аудио-угадайка",
    description: "Слушай и выбирай перевод",
    icon: <Volume2 size={22} />,
    available: true,
  },
  {
    id: "match",
    title: "Найди пару",
    description: "6 слов и 6 переводов",
    icon: <Layers size={22} />,
    available: true,
  },
  {
    id: "syllable-gap",
    title: "Собери слог",
    description: "Один слог потерялся",
    icon: <Puzzle size={22} />,
    available: false,
  },
  {
    id: "syllable-order",
    title: "Слог за слогом",
    description: "Собери слово из слогов",
    icon: <ArrowLeftRight size={22} />,
    available: false,
  },
  {
    id: "speed",
    title: "Скорость",
    description: "3 секунды на ответ",
    icon: <Gauge size={22} />,
    available: false,
  },
  {
    id: "correct-spelling",
    title: "Правописание",
    description: "Выбери верное написание",
    icon: <SpellCheck size={22} />,
    available: false,
  },
  {
    id: "text-input",
    title: "Ввод слова",
    description: "Напиши хангыль по переводу",
    icon: <Keyboard size={22} />,
    available: false,
  },
];

interface MiniGamesModalProps {
  open: boolean;
  onClose: () => void;
  activeGame: MiniGameId | null;
  onPlay: (id: MiniGameId) => void;
  onExitGame: () => void;
  children?: ReactNode;
}

export function MiniGamesModal({
  open,
  onClose,
  activeGame,
  onPlay,
  onExitGame,
  children,
}: MiniGamesModalProps) {
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
      aria-label="Мини-игры"
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
          children
        ) : (
          <>
            <h2 className="mini-games-modal__title">Мини-игры</h2>

            <div className="mini-games-grid">
              {MINI_GAMES.map((game) => (
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
