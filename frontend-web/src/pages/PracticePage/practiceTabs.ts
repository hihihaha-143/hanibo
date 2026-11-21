export type PracticeTabId =
  | "alphabet"
  | "grammar"
  | "vocabulary"
  | "phrases";

export interface PracticeTab {
  id: PracticeTabId;
  label: string;
}

export const PRACTICE_TABS: PracticeTab[] = [
  { id: "alphabet", label: "Алфавит" },
  { id: "grammar", label: "Грамматика" },
  { id: "vocabulary", label: "Словарь" },
  { id: "phrases", label: "Фразы" },
];

export const DEFAULT_PRACTICE_TAB: PracticeTabId = "alphabet";
