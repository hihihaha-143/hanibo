import { apiClient } from "./client";
import type { User } from "../types/user";

export type CourseProgressPart = "words" | "grammar" | "final" | "test";

export interface CourseProgressEntry {
  course_item_id: number;
  words_percent: number;
  grammar_percent: number;
  final_percent: number;
  test_percent: number;
}

interface CourseProgressResponse {
  data: CourseProgressEntry[];
}

export interface CourseProgressUpdate {
  progress: CourseProgressEntry;
  reward: {
    amount: number;
    currency: "blueberry" | "strawberry" | null;
  };
  user: User | null;
}

export async function getCourseProgress(): Promise<CourseProgressEntry[]> {
  const { data } = await apiClient.get<CourseProgressResponse>(
    "/course/progress",
  );
  return data.data;
}

export async function reportCourseProgress(
  itemId: number,
  part: CourseProgressPart,
  percent: number,
): Promise<CourseProgressUpdate | null> {
  if (!localStorage.getItem("hanibo_token")) return null;

  try {
    const { data } = await apiClient.post<CourseProgressUpdate>(
      `/course/items/${itemId}/progress`,
      { part, percent },
    );

    if (data.user) {
      window.dispatchEvent(
        new CustomEvent("hanibo:user-updated", { detail: data.user }),
      );
    }

    return data;
  } catch {
    // Прогресс уже сохранён локально; сетевая ошибка не должна ломать урок.
    return null;
  }
}
