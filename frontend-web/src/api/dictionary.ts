import { apiClient } from "./client";
import type { Level, PartOfSpeech, Phrase, Topic } from "./course";

// ---------- прогресс слова ----------

export interface WordProgress {
  interval_days: number;
  next_review_at: string | null;
  is_learned: boolean;
}

// ---------- слово словаря ----------

export interface DictionaryWord {
  id: number;
  hangul: string;
  translation: string;
  part_of_speech: PartOfSpeech | null;
  level: Level | null;
  topics: Topic[];
  phrases: Phrase[];
  progress: WordProgress | null;
}

// ---------- пагинация (Laravel Resource collection) ----------

export interface Paginated<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

// ---------- фильтры ----------

export type DictionaryTab = "all" | "progress" | "learned" | "review";

export interface DictionaryFilters {
  search?: string;
  topic_id?: number | null;
  tab?: DictionaryTab;
  page?: number;
}

// ---------- запросы ----------

export async function getDictionary(
  filters: DictionaryFilters = {},
): Promise<Paginated<DictionaryWord>> {
  const params: Record<string, string | number> = {};

  if (filters.search && filters.search.trim() !== "") {
    params.search = filters.search.trim();
  }
  if (filters.topic_id) {
    params.topic_id = filters.topic_id;
  }
  if (filters.tab && filters.tab !== "all") {
    params.tab = filters.tab;
  }
  if (filters.page && filters.page > 1) {
    params.page = filters.page;
  }

  const { data } = await apiClient.get<Paginated<DictionaryWord>>(
    "/dictionary",
    { params },
  );
  return data;
}

export async function getTopics(): Promise<Topic[]> {
  const { data } = await apiClient.get<Topic[]>("/topics");
  return data;
}

// ---------- мутации прогресса ----------

export interface UserWordProgressResponse {
  word_id: number;
  mistakes_count: number;
  correct_streak: number;
  interval_days: number;
  next_review_at: string | null;
}

export async function startUserWord(
  wordId: number,
): Promise<UserWordProgressResponse> {
  const { data } = await apiClient.post<UserWordProgressResponse>(
    "/user-words/start",
    { word_id: wordId },
  );
  return data;
}

export async function deleteUserWord(
  wordId: number,
): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<{ deleted: boolean }>(
    `/user-words/${wordId}`,
  );
  return data;
}
