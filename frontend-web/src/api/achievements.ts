import { apiClient } from "./client";
import type { UnlockedAchievement } from "./alphabet";
import type { User } from "../types/user";

export interface AchievementItem {
  id: number;
  code: string;
  title: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  category_id: number;
  is_hidden: boolean;
  sort_order: number;
  blueberry_reward: number;
  unlocked: boolean;
  unlocked_at: string | null;
}

export interface AchievementCategory {
  id: number;
  code: string;
  title: string;
  achievements: AchievementItem[];
}

export interface AchievementSyncPayload {
  course_lessons_completed?: number;
  course_tests_completed?: number;
  course_tests_perfect?: number;
  course_review_completed?: number;
  course_errors_completed?: number;
  breakdowns_started?: number;
  breakdowns_completed?: number;
  breakdown_phrases_saved?: number;
  library_books_opened?: number;
  profile_visited?: boolean;
  settings_visited?: boolean;
  profile_visits?: number;
}

interface AchievementsResponse {
  data: AchievementCategory[];
}

interface AchievementSyncResponse {
  unlocked_achievements: UnlockedAchievement[];
  user: User;
}

export async function getAchievements(): Promise<AchievementCategory[]> {
  const { data } = await apiClient.get<AchievementsResponse>("/achievements");
  return data.data;
}

export async function syncAchievements(
  payload: AchievementSyncPayload,
): Promise<AchievementSyncResponse> {
  const { data } = await apiClient.post<AchievementSyncResponse>(
    "/achievements/sync",
    payload,
  );
  return data;
}
