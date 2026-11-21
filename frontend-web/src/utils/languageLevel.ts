export interface LanguageLevel {
  code: string;
  label: string;
  score: number;
  next: { code: string; label: string; min: number } | null;
  progress: number;
}

const LEVELS = [
  { code: "A1", label: "Начальный", min: 0 },
  { code: "A2", label: "Базовый", min: 60 },
  { code: "B1", label: "Средний", min: 180 },
  { code: "B2", label: "Выше среднего", min: 400 },
  { code: "C1", label: "Продвинутый", min: 800 },
  { code: "C2", label: "Свободный", min: 1400 },
] as const;

interface LanguageLevelInput {
  learnedWords: number;
  learnedPhrases: number;
  learnedGrammar: number;
  completedLessons: number;
  completedTests: number;
  averageTestPercent: number;
}

/**
 * Учебный уровень считается по реальному прогрессу, а не по самооценке:
 * изученные слова/фразы/грамматика + пройденные уроки/тесты + средний балл.
 * Это эвристика для мотивации, а не официальный CEFR-экзамен.
 */
export function calculateLanguageLevel({
  learnedWords,
  learnedPhrases,
  learnedGrammar,
  completedLessons,
  completedTests,
  averageTestPercent,
}: LanguageLevelInput): LanguageLevel {
  const score = Math.max(
    0,
    Math.round(
      learnedWords +
        learnedPhrases * 2 +
        learnedGrammar * 4 +
        completedLessons * 12 +
        completedTests * 18 +
        Math.min(20, Math.max(0, averageTestPercent) * 0.2),
    ),
  );

  let currentIndex = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (score >= LEVELS[i].min) currentIndex = i;
  }

  const current = LEVELS[currentIndex];
  const next = LEVELS[currentIndex + 1] ?? null;
  const progress = next
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((score - current.min) / (next.min - current.min)) * 100,
          ),
        ),
      )
    : 100;

  return {
    code: current.code,
    label: current.label,
    score,
    next: next
      ? { code: next.code, label: next.label, min: next.min }
      : null,
    progress,
  };
}
