import type { ReactNode } from "react";
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

export type AnyMiniGameId = MiniGameId | PhraseMiniGameId | (string & {});

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
