export type AlphabetTabId =
  | "vowels"
  | "consonants"
  | "diphthongs"
  | "assimilation"
  | "stats";

export interface AlphabetTab {
  id: AlphabetTabId;
  label: string;
}

export const ALPHABET_TABS: AlphabetTab[] = [
  { id: "vowels", label: "Гласные" },
  { id: "consonants", label: "Согласные" },
  { id: "diphthongs", label: "Дифтонги" },
  { id: "assimilation", label: "Ассимиляция" },
  { id: "stats", label: "Статистика" },
];

export const DEFAULT_ALPHABET_TAB: AlphabetTabId = "vowels";

export function isAlphabetTabId(value: string | null): value is AlphabetTabId {
  return !!value && ALPHABET_TABS.some((tab) => tab.id === value);
}
