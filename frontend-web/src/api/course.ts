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
}

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
