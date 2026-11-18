import { apiClient } from "./client";

export type GrammarTabId = "all" | "progress" | "learned" | "review";

export interface GrammarFormRef {
  id: number;
  title: string;
}

export interface GrammarLevelRef {
  id: number;
  title: string;
}

export interface GrammarStatus {
  status: "new" | "learning" | "learned" | "review";
  interval_days: number | null;
  next_review_at: string | null;
  correct_streak: number | null;
  mistakes_count: number | null;
}

export interface GrammarRule {
  id: number;
  title: string;
  construction: string;
  form: GrammarFormRef | null;
  level: GrammarLevelRef | null;
  status: "new" | "learning" | "learned" | "review";
  interval_days: number | null;
  next_review_at: string | null;
  correct_streak: number | null;
  mistakes_count: number | null;
}

export interface GrammarRulePhrase {
  id: number;
  hangul: string;
  translation: string;
}

export interface GrammarRuleLesson {
  id: number;
  title: string | null;
  order: number;
}

export interface GrammarRuleDetail extends GrammarRule {
  phrases: GrammarRulePhrase[];
  lessons: GrammarRuleLesson[];
}

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

export interface GrammarFilters {
  forms: GrammarFormRef[];
  levels: GrammarLevelRef[];
}

interface GrammarListParams {
  search?: string;
  tab?: GrammarTabId;
  form_id?: number | null;
  level_id?: number | null;
  page?: number;
  per_page?: number;
}

export async function getGrammarRules(
  params: GrammarListParams = {},
): Promise<Paginated<GrammarRule>> {
  const { data } = await apiClient.get<Paginated<GrammarRule>>(
    "/grammar-rules",
    { params },
  );
  return data;
}

export async function getGrammarRule(id: number): Promise<GrammarRuleDetail> {
  const { data } = await apiClient.get<{ data: GrammarRuleDetail }>(
    `/grammar-rules/${id}`,
  );
  return data.data;
}

export async function getGrammarFilters(): Promise<GrammarFilters> {
  const { data } = await apiClient.get<GrammarFilters>(
    "/grammar-rules/filters",
  );
  return data;
}

export async function startGrammarRule(id: number): Promise<void> {
  await apiClient.post(`/user/grammar-rules/${id}/start`);
}

export async function reviewGrammarRule(
  id: number,
  correct: boolean,
): Promise<void> {
  await apiClient.post(`/user/grammar-rules/${id}/review`, { correct });
}

export async function resetGrammarRule(id: number): Promise<void> {
  await apiClient.delete(`/user/grammar-rules/${id}/reset`);
}
