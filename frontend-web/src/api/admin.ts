import { apiClient } from "./client";

export interface AdminStats {
  users: number;
  admins: number;
  course_items: number;
  words: number;
  phrases: number;
  grammar_rules: number;
  library_items: number;
  tips: number;
  achievements: number;
  shop_items: number;
}

export interface AdminMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export interface AdminUser {
  id: number;
  nickname: string;
  email: string;
  role: "user" | "admin";
  language_level: string | null;
  exp: number;
  blueberry: number;
  strawberry: number;
  streak_current: number;
  created_at: string | null;
}

export interface AdminGrammarRule {
  id: number;
  title: string;
  construction: string;
  level_id: number | null;
  level: string | null;
  form_id: number | null;
  form: string | null;
}

export interface AdminLibraryItem {
  id: number;
  title: string;
  author: string | null;
  type: string;
  description: string | null;
  cover_path: string | null;
  file_path: string | null;
  level: string | null;
  language: string | null;
  pages: number | null;
  year: number | null;
}

export interface AdminTip {
  id: number;
  type: "advice" | "fact";
  content: string;
}

export interface AdminCourseItem {
  id: number;
  type: string;
  order: number;
  title: string;
  level_id: number | null;
}

export interface AdminAchievement {
  id: number;
  code: string;
  title: string;
  description: string | null;
  category_id: number;
  is_hidden: boolean;
  blueberry_reward: number;
  category?: { title: string };
}

export interface AdminOption {
  id: number;
  title: string;
}

export interface AdminList<T> {
  data: T[];
  meta: AdminMeta;
}

export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await apiClient.get<AdminStats>("/admin/stats");
  return data;
}

export async function getAdminUsers(search = "", page = 1): Promise<AdminList<AdminUser>> {
  const { data } = await apiClient.get<AdminList<AdminUser>>("/admin/users", {
    params: { search, page },
  });
  return data;
}

export async function setAdminUserRole(
  id: number,
  role: "user" | "admin",
): Promise<AdminUser> {
  const { data } = await apiClient.patch<{ data: AdminUser }>(
    `/admin/users/${id}`,
    { role },
  );
  return data.data;
}

export async function resetAdminUserProgress(id: number): Promise<void> {
  await apiClient.post(`/admin/users/${id}/reset-progress`);
}

export interface AdminGrammarResponse extends AdminList<AdminGrammarRule> {
  levels: AdminOption[];
  forms: AdminOption[];
}

export async function getAdminGrammar(search = "", page = 1): Promise<AdminGrammarResponse> {
  const { data } = await apiClient.get<AdminGrammarResponse>("/admin/grammar-rules", {
    params: { search, page },
  });
  return data;
}

export async function saveAdminGrammar(
  id: number | null,
  payload: {
    title: string;
    construction: string;
    level_id: number | null;
    form_id: number | null;
  },
): Promise<void> {
  if (id) await apiClient.patch(`/admin/grammar-rules/${id}`, payload);
  else await apiClient.post("/admin/grammar-rules", payload);
}

export async function deleteAdminGrammar(id: number): Promise<void> {
  await apiClient.delete(`/admin/grammar-rules/${id}`);
}

export async function getAdminLibrary(search = "", page = 1): Promise<AdminList<AdminLibraryItem>> {
  const { data } = await apiClient.get<AdminList<AdminLibraryItem>>(
    "/admin/library-items",
    { params: { search, page } },
  );
  return data;
}

export type AdminLibraryPayload = Omit<AdminLibraryItem, "id">;

export async function saveAdminLibrary(
  id: number | null,
  payload: AdminLibraryPayload,
): Promise<void> {
  if (id) await apiClient.patch(`/admin/library-items/${id}`, payload);
  else await apiClient.post("/admin/library-items", payload);
}

export async function deleteAdminLibrary(id: number): Promise<void> {
  await apiClient.delete(`/admin/library-items/${id}`);
}

export async function getAdminTips(page = 1): Promise<AdminList<AdminTip>> {
  const { data } = await apiClient.get<AdminList<AdminTip>>("/admin/tips", {
    params: { page },
  });
  return data;
}

export async function saveAdminTip(
  id: number | null,
  payload: { type: "advice" | "fact"; content: string },
): Promise<void> {
  if (id) await apiClient.patch(`/admin/tips/${id}`, payload);
  else await apiClient.post("/admin/tips", payload);
}

export async function deleteAdminTip(id: number): Promise<void> {
  await apiClient.delete(`/admin/tips/${id}`);
}

export async function getAdminCourse(): Promise<{
  data: AdminCourseItem[];
  levels: AdminOption[];
}> {
  const { data } = await apiClient.get<{
    data: AdminCourseItem[];
    levels: AdminOption[];
  }>("/admin/course-items");
  return data;
}

export async function updateAdminCourseItem(
  id: number,
  payload: { title: string; order: number; level_id: number | null },
): Promise<void> {
  await apiClient.patch(`/admin/course-items/${id}`, payload);
}

export async function getAdminAchievements(): Promise<{ data: AdminAchievement[] }> {
  const { data } = await apiClient.get<{ data: AdminAchievement[] }>(
    "/admin/achievements",
  );
  return data;
}

export async function getAdminLogs(): Promise<string[]> {
  const { data } = await apiClient.get<{ data: string[] }>("/admin/logs");
  return data.data;
}
