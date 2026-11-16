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

export type PhraseMiniGameId =
  | "phrase-true-false"
  | "phrase-audio-choose"
  | "phrase-match"
  | "phrase-speed"
  | "phrase-correct-spelling"
  | "phrase-order";

export interface MiniGameInfo {
  id: MiniGameId;
  title: string;
  description: string;
  icon: ReactNode;
  available: boolean;
}

export interface PhraseMiniGameInfo {
  id: PhraseMiniGameId;
  title: string;
  description: string;
  icon: ReactNode;
  available: boolean;
}

export const WORD_MINI_GAMES: MiniGameInfo[] = [
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
    available: true,
  },
  {
    id: "syllable-order",
    title: "Слог за слогом",
    description: "Собери слово из слогов",
    icon: <ArrowLeftRight size={22} />,
    available: true,
  },
  {
    id: "speed",
    title: "Скорость",
    description: "3 секунды на ответ",
    icon: <Gauge size={22} />,
    available: true,
  },
  {
    id: "correct-spelling",
    title: "Правописание",
    description: "Выбери верное написание",
    icon: <SpellCheck size={22} />,
    available: true,
  },
  {
    id: "text-input",
    title: "Ввод слова",
    description: "Напиши хангыль по переводу",
    icon: <Keyboard size={22} />,
    available: true,
  },
];

export const PHRASE_MINI_GAMES: PhraseMiniGameInfo[] = [
  {
    id: "phrase-true-false",
    title: "Правда или ложь",
    description: "Пара «фраза — перевод»: верно ли?",
    icon: <CheckCheck size={22} />,
    available: true,
  },
  {
    id: "phrase-audio-choose",
    title: "Аудио-угадайка",
    description: "Слушай и выбирай перевод",
    icon: <Volume2 size={22} />,
    available: true,
  },
  {
    id: "phrase-match",
    title: "Найди пару",
    description: "6 фраз и 6 переводов",
    icon: <Layers size={22} />,
    available: true,
  },
  {
    id: "phrase-speed",
    title: "Скорость",
    description: "3 секунды на ответ",
    icon: <Gauge size={22} />,
    available: true,
  },
  {
    id: "phrase-correct-spelling",
    title: "Правописание",
    description: "Выбери верное написание фразы",
    icon: <SpellCheck size={22} />,
    available: true,
  },
  {
    id: "phrase-order",
    title: "Собери фразу",
    description: "Расставь слова по порядку",
    icon: <ArrowLeftRight size={22} />,
    available: true,
  },
];

type AnyGameId = MiniGameId | PhraseMiniGameId;

interface MiniGamesModalProps<T extends AnyGameId = MiniGameId> {
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
  children?: ReactNode;
}

export function MiniGamesModal<T extends AnyGameId = MiniGameId>({
  open,
  onClose,
  activeGame,
  onPlay,
  onExitGame,
  games,
  title = "Мини-игры",
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
          children
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
