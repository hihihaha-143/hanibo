import type { LibraryItem } from "../types/library";

const RECENT_KEY = "hanibo:library:recent";
const MAX_RECENT = 5; // храним ровно 5 последних

export interface RecentEntry {
  id: number;
  openedAt: number;
}

export function readRecent(): RecentEntry[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (e): e is RecentEntry =>
          typeof e?.id === "number" && typeof e?.openedAt === "number",
      )
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

export function pushRecent(id: number | string): void {
  try {
    const numId = Number(id);
    const current = readRecent().filter((e) => e.id !== numId);
    const next: RecentEntry[] = [
      { id: numId, openedAt: Date.now() },
      ...current,
    ].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* noop */
  }
}

export function getLastPage(item: LibraryItem): number {
  if (!item.file_url) return 1;
  try {
    const raw = localStorage.getItem(
      "hanibo:library:lastPage:" + item.file_url,
    );
    const n = Number(raw || "0");
    return n >= 1 ? n : 1;
  } catch {
    return 1;
  }
}
