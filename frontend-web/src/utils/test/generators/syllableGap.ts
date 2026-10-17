// frontend-web/src/utils/test/generators/syllableGap.ts

import type { CourseItemWord } from "../../../api/course";
import type { TestQuestionSyllableGap } from "../types";
import { shuffle } from "../shared";

// Хангыль: диапазон слогов U+AC00 – U+D7A3.
const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const HANGUL_COUNT = HANGUL_END - HANGUL_START + 1;

function randomSyllable(): string {
  const code = HANGUL_START + Math.floor(Math.random() * HANGUL_COUNT);
  return String.fromCharCode(code);
}

/**
 * Генерирует вопросы типа "syllable-gap" по словам урока.
 * Минимум 2 слога в слове. Пропускаем не первый слог.
 */
export function generateSyllableGapQuestions(
  words: CourseItemWord[],
): TestQuestionSyllableGap[] {
  const questions: TestQuestionSyllableGap[] = [];

  for (const word of words) {
    const syllables = Array.from(word.hangul);
    if (syllables.length < 2) continue;

    // позиция пропуска: не первый слог (чтобы был контекст)
    const minIndex = 1;
    const gapIndex =
      minIndex + Math.floor(Math.random() * (syllables.length - minIndex));

    const correct = syllables[gapIndex];

    const prompt =
      syllables.slice(0, gapIndex).join("") +
      "_" +
      syllables.slice(gapIndex + 1).join("");

    const mode: "choice" | "input" = Math.random() < 0.5 ? "choice" : "input";

    if (mode === "input") {
      questions.push({
        type: "syllable-gap",
        mode: "input",
        id: `word-${word.id}-syllable-${gapIndex}-input`,
        instruction: "Впишите пропущенный слог",
        prompt,
        promptAudio: word.hangul,
        correctAnswer: correct,
      });
      continue;
    }

    // mode === "choice"
    const used = new Set<string>([correct]);
    const distractors: string[] = [];

    // сначала соседи по слову
    for (let i = 0; i < syllables.length; i++) {
      if (i === gapIndex) continue;
      const s = syllables[i];
      if (used.has(s)) continue;
      used.add(s);
      distractors.push(s);
      if (distractors.length >= 3) break;
    }

    // добираем случайными
    let safety = 0;
    while (distractors.length < 3 && safety < 100) {
      safety++;
      const s = randomSyllable();
      if (used.has(s)) continue;
      used.add(s);
      distractors.push(s);
    }

    const variants = shuffle([correct, ...distractors]);
    const correctIndex = variants.indexOf(correct);

    questions.push({
      type: "syllable-gap",
      mode: "choice",
      id: `word-${word.id}-syllable-${gapIndex}-choice`,
      instruction: "Выберите пропущенный слог",
      prompt,
      promptAudio: word.hangul,
      variants,
      correctIndex,
    });
  }

  return questions;
}
