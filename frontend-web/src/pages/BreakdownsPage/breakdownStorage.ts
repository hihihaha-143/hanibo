export interface SavedBreakdownPhrase {
  itemId: string;
  itemTitle: string;
  lineId: string;
  hangul: string;
  translation: string;
}

export interface BreakdownItemProgress {
  page: number;
  episode: number;
  completed: boolean;
}

export type BreakdownProgressMap = Record<string, BreakdownItemProgress>;

const PROGRESS_PREFIX = "hanibo.breakdowns.progress:";
const SAVED_PREFIX = "hanibo.breakdowns.phrases:";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

export function getProgress(owner: string): BreakdownProgressMap {
  return readJson<BreakdownProgressMap>(PROGRESS_PREFIX + owner, {});
}

export function getItemProgress(
  owner: string,
  itemId: string,
): BreakdownItemProgress {
  return (
    getProgress(owner)[itemId] ?? { page: 0, episode: 0, completed: false }
  );
}

export function saveItemProgress(
  owner: string,
  itemId: string,
  patch: Partial<BreakdownItemProgress>,
): void {
  const progress = getProgress(owner);
  progress[itemId] = {
    ...{ page: 0, episode: 0, completed: false },
    ...progress[itemId],
    ...patch,
  };
  writeJson(PROGRESS_PREFIX + owner, progress);
}

export function getSavedPhrases(owner: string): SavedBreakdownPhrase[] {
  return readJson<SavedBreakdownPhrase[]>(SAVED_PREFIX + owner, []);
}

export function isPhraseSaved(
  owner: string,
  itemId: string,
  lineId: string,
): boolean {
  return getSavedPhrases(owner).some(
    (phrase) => phrase.itemId === itemId && phrase.lineId === lineId,
  );
}

export function toggleSavedPhrase(
  owner: string,
  phrase: SavedBreakdownPhrase,
): boolean {
  const saved = getSavedPhrases(owner);
  const exists = saved.some(
    (item) => item.itemId === phrase.itemId && item.lineId === phrase.lineId,
  );
  const next = exists
    ? saved.filter(
        (item) =>
          !(item.itemId === phrase.itemId && item.lineId === phrase.lineId),
      )
    : [phrase, ...saved];
  writeJson(SAVED_PREFIX + owner, next);
  return !exists;
}
