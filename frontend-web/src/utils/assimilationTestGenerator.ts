// frontend-web/src/utils/assimilationTestGenerator.ts

import type { AlphabetLetter } from "../api/alphabet";
import type { TestQuestion } from "./test";
import { shuffle } from "./test";

const SELECTED_COUNT = 5;
const MIN_QUESTIONS_PER_ITEM = 1;
const MAX_QUESTIONS_PER_ITEM = 3;
const VARIANTS_COUNT = 4;

function pickRandom<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, count);
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pickDistractors(
  pool: AlphabetLetter[],
  exclude: AlphabetLetter,
  count: number,
): string[] {
  const filtered = pool.filter(
    (l) => l.id !== exclude.id && l.romanization !== exclude.romanization,
  );
  return pickRandom(filtered, count).map((l) => l.romanization);
}

function buildChooseQuestion(
  item: AlphabetLetter,
  pool: AlphabetLetter[],
): TestQuestion | null {
  const distractors = pickDistractors(pool, item, VARIANTS_COUNT - 1);
  if (distractors.length < VARIANTS_COUNT - 1) return null;

  const variants = shuffle([item.romanization, ...distractors]);
  const correctIndex = variants.indexOf(item.romanization);

  return {
    id: `assimilation-${item.id}-${Date.now()}-${Math.random()}`,
    instruction: "Выберите правильное чтение",
    type: "choose",
    prompt: `Как читается «${item.symbol}»?`,
    promptAudio: null,
    variants,
    correctIndices: [correctIndex],
    letterId: item.id,
  };
}

export function generateAssimilationTest(
  letters: AlphabetLetter[],
): TestQuestion[] {
  if (letters.length === 0) return [];

  const selected = pickRandom(letters, SELECTED_COUNT);
  const questions: TestQuestion[] = [];

  for (const item of selected) {
    const count = randomInt(MIN_QUESTIONS_PER_ITEM, MAX_QUESTIONS_PER_ITEM);

    // на одну запись делаем count вопросов одного типа choose
    // (все вопросы разные по id, но правильный ответ один и тот же)
    for (let i = 0; i < count; i++) {
      const q = buildChooseQuestion(item, letters);
      if (q) questions.push(q);
    }
  }

  return shuffle(questions);
}
