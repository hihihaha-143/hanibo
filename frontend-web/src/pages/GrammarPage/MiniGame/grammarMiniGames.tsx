import type { ReactNode } from "react";
import {
  CheckCheck,
  SpellCheck,
  Layers,
  ArrowLeftRight,
} from "lucide-react";

export type GrammarMiniGameId =
  | "choose-rule"
  | "rule-to-construction"
  | "match-rule"
  | "choose-example";

export interface GrammarMiniGameInfo {
  id: GrammarMiniGameId;
  title: string;
  description: string;
  icon: ReactNode;
  available: boolean;
}

export const GRAMMAR_MINI_GAMES: GrammarMiniGameInfo[] = [
  {
    id: "choose-rule",
    title: "Найди правило",
    description: "Дана конструкция — выбери название правила.",
    icon: <SpellCheck size={22} />,
    available: true,
  },
  {
    id: "rule-to-construction",
    title: "Правило → конструкция",
    description: "Дано название правила — выбери конструкцию.",
    icon: <ArrowLeftRight size={22} />,
    available: true,
  },
  {
    id: "match-rule",
    title: "Соедини пары",
    description: "6 пар: название правила и его конструкция.",
    icon: <Layers size={22} />,
    available: true,
  },
  {
    id: "choose-example",
    title: "Пример к правилу",
    description: "Дано правило — выбери фразу, которая его иллюстрирует.",
    icon: <CheckCheck size={22} />,
    available: true,
  },
];