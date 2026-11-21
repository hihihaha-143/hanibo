import {
  getProgress as getCourseProgress,
  PASS_THRESHOLD,
} from "../utils/progress";
import {
  getProgress as getBreakdownProgress,
  getSavedPhrases,
} from "../pages/BreakdownsPage/breakdownStorage";
import { readRecent } from "./libraryRecent";

const TRAINING_KEY = "hanibo:course:training";
const PROFILE_VISITS_PREFIX = "hanibo:profile-visits:";

export type CourseTrainingMode = "review" | "errors";

export function markCourseTrainingComplete(mode: CourseTrainingMode): void {
  try {
    const raw = localStorage.getItem(TRAINING_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    parsed[mode] = true;
    localStorage.setItem(TRAINING_KEY, JSON.stringify(parsed));
  } catch {
    // ignore
  }
}

export function isCourseTrainingComplete(mode: CourseTrainingMode): boolean {
  try {
    const raw = localStorage.getItem(TRAINING_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed[mode] === true;
  } catch {
    return false;
  }
}

export interface AchievementStats {
  course_lessons_completed: number;
  course_tests_completed: number;
  course_tests_perfect: number;
  course_review_completed: number;
  course_errors_completed: number;
  breakdowns_started: number;
  breakdowns_completed: number;
  breakdown_phrases_saved: number;
  library_books_opened: number;
}

export function collectAchievementStats(owner: string): AchievementStats {
  const course = getCourseProgress();
  const lessonValues = Object.values(course.lessons);
  const testValues = Object.values(course.tests);
  const breakdowns = Object.values(getBreakdownProgress(owner));

  return {
    course_lessons_completed: lessonValues.filter(
      (lesson) => lesson.finalPercent >= PASS_THRESHOLD,
    ).length,
    course_tests_completed: testValues.filter(
      (test) => test.percent >= PASS_THRESHOLD,
    ).length,
    course_tests_perfect: testValues.filter((test) => test.percent === 100)
      .length,
    course_review_completed: isCourseTrainingComplete("review") ? 1 : 0,
    course_errors_completed: isCourseTrainingComplete("errors") ? 1 : 0,
    breakdowns_started: breakdowns.filter(
      (entry) =>
        entry.page > 0 || entry.episode > 0 || entry.completed,
    ).length,
    breakdowns_completed: breakdowns.filter((entry) => entry.completed).length,
    breakdown_phrases_saved: getSavedPhrases(owner).length,
    library_books_opened: readRecent().length,
  };
}

export function requestAchievementSync(): void {
  window.dispatchEvent(new Event("hanibo:achievements-sync"));
}

export function getProfileVisits(owner: string): number {
  try {
    return Math.max(0, Number(localStorage.getItem(PROFILE_VISITS_PREFIX + owner) || 0));
  } catch {
    return 0;
  }
}

export function recordProfileVisit(owner: string): number {
  const next = getProfileVisits(owner) + 1;
  try {
    localStorage.setItem(PROFILE_VISITS_PREFIX + owner, String(next));
  } catch {
    // ignore
  }
  return next;
}
