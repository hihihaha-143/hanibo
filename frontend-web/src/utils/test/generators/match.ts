// frontend-web/src/utils/test/generators/match.ts

import type { CourseItemWord } from "../../../api/course";
import type { TestQuestionMatch } from "../types";
import { shuffle } from "../shared";

const PAIRS_PER_QUESTION = 4;

/**
 * Генерирует вопросы типа "match" по словам урока.
 *
 * Логика:
 * - Группируем слова по 4 штуки. Остаток меньше 4 — отбрасываем.
 * - Каждая группа → один вопрос с 4 парами { left: hangul, right: translation }.
 * - Перемешивание колонок делает компонент при монтировании.
 */
export function generateMatchQuestions(
  words: CourseItemWord[],
): TestQuestionMatch[] {
  if (words.length < PAIRS_PER_QUESTION) return [];

  const pool = shuffle(words);
  const questions: TestQuestionMatch[] = [];

  const groupsCount = Math.floor(pool.length / PAIRS_PER_QUESTION);

  for (let g = 0; g < groupsCount; g++) {
    const groupWords = pool.slice(
      g * PAIRS_PER_QUESTION,
      (g + 1) * PAIRS_PER_QUESTION,
    );

    const pairs = groupWords.map((w) => ({
      left: w.hangul,
      right: w.translation,
    }));

    questions.push({
      type: "match",
      id: `match-${groupWords.map((w) => w.id).join("-")}`,
      instruction: "Соедините пары",
      pairs,
    });
  }

  return questions;
}
