import { apiClient } from "./client";

export type CourseItemType = "lesson" | "extra" | "test";

export interface CourseItem {
  id: number;
  type: CourseItemType;
  order: number;
  title: string;
}

export async function getCourseItems(): Promise<CourseItem[]> {
  const { data } = await apiClient.get<CourseItem[]>("/course/items");
  return data;
}
