import { apiClient } from "./client";
import type { Level, PartOfSpeech, Phrase, Topic } from "./course";

// ---------- прогресс слова ----------

export interface WordProgress {
  interval_days: number;
  next_review_at: string | null;
  is_learned: boolean;
  mistakes_count?: number;
  correct_streak?: number;
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
  per_page?: number;
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
  if (filters.per_page) {
    params.per_page = filters.per_page;
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

export interface UserWordProgressUpdate {
  word_id: number;
  is_correct: boolean;
}

export async function updateUserWordProgress(
  wordId: number,
  isCorrect: boolean,
): Promise<UserWordProgressResponse> {
  const { data } = await apiClient.post<UserWordProgressResponse>(
    "/user-words/progress",
    { word_id: wordId, is_correct: isCorrect },
  );
  return data;
}

// ---------- слово дня ----------

export interface DailyWordResponse {
  date: string;
  word: DictionaryWord;
}

export async function getDailyWord(): Promise<DailyWordResponse> {
  const { data } = await apiClient.get<DailyWordResponse>("/daily-word");
  return data;
}

// ---------- тест 1 из 4 ----------

export interface DailyQuizWord {
  id: number;
  hangul: string;
  translation: string;
}

export interface DailyQuizResponse {
  target: DailyQuizWord;
  distractors: DailyQuizWord[];
}

export async function getDailyQuiz(): Promise<DailyQuizResponse> {
  const { data } = await apiClient.get<DailyQuizResponse>("/daily-quiz");
  return data;
}

// =====================================================
// ФРАЗЫ
// =====================================================

// ---------- прогресс фразы ----------

export interface PhraseProgress {
  interval_days: number;
  next_review_at: string | null;
  is_learned: boolean;
  mistakes_count?: number;
  correct_streak?: number;
}

// ---------- фраза словаря ----------

export interface DictionaryPhrase {
  id: number;
  hangul: string;
  translation: string;
  level: Level | null;
  topics: Topic[];
  tokens: {
    order: number;
    text: string;
    space_after: boolean;
  }[];
  grammar_rules: { id: number; title: string; construction: string }[];
  progress: PhraseProgress | null;
}

// ---------- фильтры ----------

export interface PhraseFilters {
  search?: string;
  topic_id?: number | null;
  level_id?: number | null;
  tab?: DictionaryTab;
  page?: number;
  per_page?: number;
}

// ---------- запросы ----------

export async function getPhrases(
  filters: PhraseFilters = {},
): Promise<Paginated<DictionaryPhrase>> {
  const params: Record<string, string | number> = {};

  if (filters.search && filters.search.trim() !== "") {
    params.search = filters.search.trim();
  }
  if (filters.topic_id) {
    params.topic_id = filters.topic_id;
  }
  if (filters.level_id) {
    params.level_id = filters.level_id;
  }
  if (filters.tab && filters.tab !== "all") {
    params.tab = filters.tab;
  }
  if (filters.page && filters.page > 1) {
    params.page = filters.page;
  }
  if (filters.per_page) {
    params.per_page = filters.per_page;
  }

  const { data } = await apiClient.get<Paginated<DictionaryPhrase>>(
    "/phrases",
    { params },
  );
  return data;
}

// ---------- мутации прогресса ----------

export interface UserPhraseProgressResponse {
  phrase_id: number;
  mistakes_count: number;
  correct_streak: number;
  interval_days: number;
  next_review_at: string | null;
}

export async function startUserPhrase(
  phraseId: number,
): Promise<UserPhraseProgressResponse> {
  const { data } = await apiClient.post<UserPhraseProgressResponse>(
    "/user-phrases/start",
    { phrase_id: phraseId },
  );
  return data;
}

export async function deleteUserPhrase(
  phraseId: number,
): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<{ deleted: boolean }>(
    `/user-phrases/${phraseId}`,
  );
  return data;
}

export async function updateUserPhraseProgress(
  phraseId: number,
  isCorrect: boolean,
): Promise<UserPhraseProgressResponse> {
  const { data } = await apiClient.post<UserPhraseProgressResponse>(
    "/user-phrases/progress",
    { phrase_id: phraseId, is_correct: isCorrect },
  );
  return data;
}

// ---------- фраза дня ----------

export interface DailyPhraseResponse {
  date: string;
  phrase: DictionaryPhrase;
}

export async function getDailyPhrase(): Promise<DailyPhraseResponse> {
  const { data } = await apiClient.get<DailyPhraseResponse>("/daily-phrase");
  return data;
}

// ---------- тест 1 из 4 (фразы) ----------

export interface DailyPhraseQuizWord {
  id: number;
  hangul: string;
  translation: string;
}

export interface DailyPhraseQuizResponse {
  target: DailyPhraseQuizWord;
  distractors: DailyPhraseQuizWord[];
}

export async function getDailyPhraseQuiz(): Promise<DailyPhraseQuizResponse> {
  const { data } =
    await apiClient.get<DailyPhraseQuizResponse>("/daily-phrase-quiz");
  return data;
}
