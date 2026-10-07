// src/utils/courseStatus.ts

import type { CourseItem } from "../api/course";
import {
  getLessonProgress,
  getTestProgress,
  PASS_THRESHOLD,
  isItemFullyCompleted,
  isItemStarted,
} from "./progress";

export type CourseItemStatus = "locked" | "active" | "partial" | "complete";

export interface ItemWithStatus {
  item: CourseItem;
  status: CourseItemStatus;
  progressPercent: number; // 0–100, для заливки
}

function lessonPercent(itemId: number): number {
  const p = getLessonProgress(itemId);
  return Math.round((p.wordsPercent + p.grammarPercent + p.finalPercent) / 3);
}

export function calculateCourseStatuses(items: CourseItem[]): ItemWithStatus[] {
  const sorted = [...items].sort((a, b) => a.order - b.order);

  const result: ItemWithStatus[] = [];
  let prevPassed = true;

  for (const item of sorted) {
    let status: CourseItemStatus;
    let progressPercent = 0;

    if (!prevPassed) {
      status = "locked";
    } else if (item.type === "lesson") {
      progressPercent = lessonPercent(item.id);
      if (isItemFullyCompleted(item.id)) {
        status = "complete";
      } else if (isItemStarted(item.id)) {
        status = "partial";
      } else {
        status = "active";
      }
    } else if (item.type === "test") {
      const testProgress = getTestProgress(item.id);
      progressPercent = testProgress.percent;
      if (testProgress.percent === 100) {
        status = "complete";
      } else if (testProgress.percent > 0) {
        status = "partial";
      } else {
        status = "active";
      }
    } else {
      // extra
      status = "active";
    }

    result.push({ item, status, progressPercent });

    if (item.type === "lesson") {
      prevPassed = getLessonProgress(item.id).finalPercent > PASS_THRESHOLD;
    } else if (item.type === "test") {
      prevPassed = getTestProgress(item.id).percent > PASS_THRESHOLD;
    }
    // extra — не меняет prevPassed
  }

  return result;
}

export function getItemStatus(
  items: CourseItem[],
  itemId: number,
): CourseItemStatus | null {
  const found = calculateCourseStatuses(items).find(
    (entry) => entry.item.id === itemId,
  );
  return found ? found.status : null;
}
