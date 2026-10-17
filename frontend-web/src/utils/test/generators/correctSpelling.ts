// frontend-web/src/utils/test/generators/correctSpelling.ts

import type { CourseItemWord } from "../../../api/course";
import type { TestQuestionCorrectSpelling } from "../types";
import { shuffle } from "../shared";

// Хангыль: диапазон слогов U+AC00 – U+D7A3 (11172 слога).
const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const HANGUL_COUNT = HANGUL_END - HANGUL_START + 1;

/**
 * Случайный слог хангыля.
 */
function randomSyllable(): string {
  const code = HANGUL_START + Math.floor(Math.random() * HANGUL_COUNT);
  return String.fromCharCode(code);
}

/**
 * Заменяет слог на позиции index на случайный другой слог.
 * Гарантирует, что новый слог отличается от старого.
 */
function corruptAt(hangul: string, index: number): string {
  const chars = Array.from(hangul);
  const oldChar = chars[index];
  let newChar = oldChar;
  // до 20 попыток — практически всегда хватит с первого раза
  for (let i = 0; i < 20 && newChar === oldChar; i++) {
    newChar = randomSyllable();
  }
  chars[index] = newChar;
  return chars.join("");
}

/**
 * Строит 2 искажения слова.
 * - если слово из 1 слога — обе искажения меняют позицию 0 (но получаются разные).
 * - если из 2+ слогов — меняем две разные позиции.
 */
function makeTwoCorruptions(
  hangul: string,
  forbidden: Set<string>,
): [string, string] | null {
  const chars = Array.from(hangul);
  const len = chars.length;

  const corruption1 = corruptAt(hangul, Math.floor(Math.random() * len));

  // выбираем позицию, отличную от первой, если длина > 1
  let pos2 = 0;
  if (len > 1) {
    const firstPos = chars.findIndex(
      (c, i) => Array.from(corruption1)[i] !== c,
    );
    do {
      pos2 = Math.floor(Math.random() * len);
    } while (pos2 === firstPos);
  }

  let corruption2: string | null = null;
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = corruptAt(hangul, pos2);
    if (candidate !== corruption1 && !forbidden.has(candidate)) {
      corruption2 = candidate;
      break;
    }
  }

  if (!corruption2) return null;
  if (forbidden.has(corruption1)) return null;

  return [corruption1, corruption2];
}

/**
 * Генерирует вопросы типа "correct-spelling" по словам урока.
 *
 * Варианты:
 * - 1 правильный (hangul слова),
 * - 2 искажения (тот же hangul, но с заменёнными слогами),
 * - 1 чужое слово (hangul другого слова из пула).
 *
 * Возвращает НЕперемешанный массив — перемешивание делает вызывающий код.
 */
export function generateCorrectSpellingQuestions(
  words: CourseItemWord[],
): TestQuestionCorrectSpelling[] {
  if (words.length < 2) return [];

  const allHanguls = new Set(words.map((w) => w.hangul));
  const questions: TestQuestionCorrectSpelling[] = [];

  for (const word of words) {
    const corruptions = makeTwoCorruptions(word.hangul, allHanguls);
    if (!corruptions) continue;

    // чужое слово — из другого слова пула
    const others = words.filter((w) => w.id !== word.id);
    if (others.length === 0) continue;
    const foreign = others[Math.floor(Math.random() * others.length)].hangul;

    const variants = shuffle([
      word.hangul,
      corruptions[0],
      corruptions[1],
      foreign,
    ]);
    const correctIndex = variants.indexOf(word.hangul);

    questions.push({
      type: "correct-spelling",
      id: `word-${word.id}-correct-spelling`,
      instruction: "Выберите правильное написание",
      prompt: word.translation,
      promptAudio: word.hangul,
      variants,
      correctIndex,
    });
  }

  return questions;
}
