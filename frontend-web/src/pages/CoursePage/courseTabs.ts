export type CourseTabId = "course" | "dictionary" | "stats";

export const COURSE_TABS: { id: CourseTabId; label: string }[] = [
  { id: "course", label: "Курс" },
  { id: "dictionary", label: "Мой словарь" },
  { id: "stats", label: "Статистика" },
];

export const DEFAULT_COURSE_TAB: CourseTabId = "course";

export function isCourseTabId(value: string | null): value is CourseTabId {
  return COURSE_TABS.some((tab) => tab.id === value);
}
