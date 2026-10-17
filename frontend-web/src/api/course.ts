import { apiClient } from "./client";

export type CourseItemType = "lesson" | "extra" | "test";

export interface CourseItem {
  id: number;
  type: CourseItemType;
  order: number;
  title: string;
}

export interface CourseItemLink {
  id: number;
  type: CourseItemType;
  title: string;
}

export interface ExtraContent {
  title: string;
  content: string;
}

export interface CourseItemDetails extends CourseItem {
  extra: ExtraContent | null;
  next: CourseItemLink | null;
  prev: CourseItemLink | null;
  next_lesson: CourseItemLink | null;
  prev_lesson: CourseItemLink | null;
  lesson_ids: number[];
}

// ---------- общие справочники ----------

export interface PartOfSpeech {
  id: number;
  title: string;
}

export interface Level {
  id: number;
  title: string;
}

export interface Topic {
  id: number;
  title: string;
}

export interface Form {
  id: number;
  title: string;
}

// ---------- токены (используются и в словах, и в грамматике) ----------

export interface PhraseToken {
  order: number;
  text: string;
  space_after: boolean;
  word: {
    id: number;
    hangul: string;
    translation: string;
  } | null;
  grammar_rule: {
    id: number;
    title: string;
    construction: string;
  } | null;
}

// ---------- короткое правило (внутри фразы) ----------

export interface PhraseGrammarRule {
  id: number;
  title: string;
  construction: string;
}

// ---------- фраза (пример) ----------

export interface Phrase {
  id: number;
  hangul: string;
  translation: string;
  tokens: PhraseToken[];
  grammar_rules: PhraseGrammarRule[];
}

// ---------- слова урока ----------

export interface CourseItemWord {
  id: number;
  hangul: string;
  translation: string;
  part_of_speech: PartOfSpeech | null;
  level: Level | null;
  topics: Topic[];
  phrases: Phrase[];
}

export interface CourseItemWordsResponse {
  course_item: CourseItem;
  words: CourseItemWord[];
}

// ---------- грамматика урока ----------

export interface GrammarRule {
  id: number;
  title: string;
  construction: string;
  form: Form | null;
  level: Level | null;
  phrases: Phrase[];
}

export interface CourseItemGrammarResponse {
  course_item: CourseItem;
  grammar: GrammarRule[];
  pool: PhraseGrammarRule[];
}

// ---------- запросы ----------

export async function getCourseItems(): Promise<CourseItem[]> {
  const { data } = await apiClient.get<CourseItem[]>("/course/items");
  return data;
}

export async function getCourseItem(id: number): Promise<CourseItemDetails> {
  const { data } = await apiClient.get<CourseItemDetails>(
    `/course/items/${id}`,
  );
  return data;
}

export async function getCourseItemWords(
  id: number,
): Promise<CourseItemWordsResponse> {
  const { data } = await apiClient.get<CourseItemWordsResponse>(
    `/course-items/${id}/words`,
  );
  return data;
}

export async function getCourseItemGrammar(
  id: number,
): Promise<CourseItemGrammarResponse> {
  const { data } = await apiClient.get<CourseItemGrammarResponse>(
    `/course-items/${id}/grammar`,
  );
  return data;
}

export interface CourseTestDataResponse {
  course_item: CourseItem;
  words: CourseItemWord[];
  grammar: GrammarRule[];
  pool: PhraseGrammarRule[];
  lesson_ids: number[];
}

export async function getCourseTestData(
  id: number,
): Promise<CourseTestDataResponse> {
  const { data } = await apiClient.get<CourseTestDataResponse>(
    `/course-tests/${id}/data`,
  );
  return data;
}