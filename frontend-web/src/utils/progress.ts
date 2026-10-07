// src/utils/progress.ts

const STORAGE_KEY = "hanibo:progress";

export const PASS_THRESHOLD = 70;

export interface LessonProgress {
  wordsPercent: number;
  grammarPercent: number;
  finalPercent: number;
}

export interface TestProgress {
  percent: number;
}

export interface Progress {
  lessons: Record<number, LessonProgress>;
  tests: Record<number, TestProgress>;
}

const EMPTY_LESSON: LessonProgress = {
  wordsPercent: 0,
  grammarPercent: 0,
  finalPercent: 0,
};

const EMPTY_TEST: TestProgress = {
  percent: 0,
};

function readProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lessons: {}, tests: {} };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    if (!parsed || typeof parsed !== "object") {
      return { lessons: {}, tests: {} };
    }
    return {
      lessons: parsed.lessons ?? {},
      tests: parsed.tests ?? {},
    };
  } catch {
    return { lessons: {}, tests: {} };
  }
}

function writeProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage может быть недоступен (приватный режим и т.п.)
  }
}

export function getProgress(): Progress {
  return readProgress();
}

// ---------- уроки ----------

export function getLessonProgress(itemId: number): LessonProgress {
  const progress = readProgress();
  return progress.lessons[itemId] ?? { ...EMPTY_LESSON };
}

function updateLesson(itemId: number, patch: Partial<LessonProgress>): void {
  const progress = readProgress();
  const current = progress.lessons[itemId] ?? { ...EMPTY_LESSON };
  const next: LessonProgress = { ...current };

  if (patch.wordsPercent !== undefined) {
    next.wordsPercent = Math.max(current.wordsPercent, patch.wordsPercent);
  }
  if (patch.grammarPercent !== undefined) {
    next.grammarPercent = Math.max(
      current.grammarPercent,
      patch.grammarPercent,
    );
  }
  if (patch.finalPercent !== undefined) {
    next.finalPercent = Math.max(current.finalPercent, patch.finalPercent);
  }

  progress.lessons[itemId] = next;
  writeProgress(progress);
}

export function setWordsPercent(itemId: number, percent: number): void {
  updateLesson(itemId, { wordsPercent: percent });
}

export function setGrammarPercent(itemId: number, percent: number): void {
  updateLesson(itemId, { grammarPercent: percent });
}

export function setFinalPercent(itemId: number, percent: number): void {
  updateLesson(itemId, { finalPercent: percent });
}

export function isWordsPassed(itemId: number): boolean {
  return getLessonProgress(itemId).wordsPercent > PASS_THRESHOLD;
}

export function isGrammarPassed(itemId: number): boolean {
  return getLessonProgress(itemId).grammarPercent > PASS_THRESHOLD;
}

export function isFinalPassed(itemId: number): boolean {
  return getLessonProgress(itemId).finalPercent > PASS_THRESHOLD;
}

export function isItemCompleted(itemId: number): boolean {
  return isFinalPassed(itemId);
}

export function isItemFullyCompleted(itemId: number): boolean {
  const p = getLessonProgress(itemId);
  return (
    p.wordsPercent === 100 && p.grammarPercent === 100 && p.finalPercent === 100
  );
}

export function isItemStarted(itemId: number): boolean {
  const p = getLessonProgress(itemId);
  return p.wordsPercent > 0 || p.grammarPercent > 0 || p.finalPercent > 0;
}

// ---------- тесты курса ----------

export function getTestProgress(itemId: number): TestProgress {
  const progress = readProgress();
  return progress.tests[itemId] ?? { ...EMPTY_TEST };
}

export function setTestPercent(itemId: number, percent: number): void {
  const progress = readProgress();
  const current = progress.tests[itemId] ?? { ...EMPTY_TEST };
  progress.tests[itemId] = {
    percent: Math.max(current.percent, percent),
  };
  writeProgress(progress);
}

