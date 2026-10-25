// frontend-web/src/utils/assimilationTestGenerator.ts

import type { AlphabetLetter } from "../api/alphabet";
import type { TestQuestion } from "./test";
import { shuffle } from "./test";
import { pickPrioritizedLetters } from "./letterGroupTestGenerator";

const SELECTED_COUNT = 5;
const MIN_QUESTIONS_PER_ITEM = 1;
const MAX_QUESTIONS_PER_ITEM = 3;
const VARIANTS_COUNT = 4;

type AssimilationQuestionKind = "choose" | "audio" | "true-false";

const ALL_KINDS: AssimilationQuestionKind[] = ["choose", "audio", "true-false"];

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

function buildAudioQuestion(
  item: AlphabetLetter,
  pool: AlphabetLetter[],
): TestQuestion | null {
  const distractors = pickDistractors(pool, item, VARIANTS_COUNT - 1);
  if (distractors.length < VARIANTS_COUNT - 1) return null;

  const variants = shuffle([item.romanization, ...distractors]);
  const correctIndex = variants.indexOf(item.romanization);

  return {
    id: `assimilation-audio-${item.id}-${Date.now()}-${Math.random()}`,
    instruction: "Прослушайте и выберите правильное чтение",
    type: "audio-choose",
    audioText: item.romanization,
    mode: "hangul",
    promptHangul: item.symbol,
    promptTranslation: item.romanization,
    variants,
    correctIndices: [correctIndex],
    letterId: item.id,
  };
}

function buildTrueFalseQuestion(item: AlphabetLetter): TestQuestion | null {
  // если написание совпадает с чтением — «неверный» вариант невозможен
  if (item.symbol === item.romanization) return null;

  const isCorrectPair = Math.random() < 0.5;
  const shown = isCorrectPair ? item.romanization : item.symbol;

  return {
    id: `assimilation-tf-${item.id}-${Date.now()}-${Math.random()}`,
    instruction: "Верно или неверно?",
    type: "true-false",
    prompt: `${item.symbol} читается как ${shown}`,
    promptAudio: item.symbol,
    correct: isCorrectPair,
    letterId: item.id,
  };
}

function buildQuestion(
  kind: AssimilationQuestionKind,
  item: AlphabetLetter,
  pool: AlphabetLetter[],
): TestQuestion | null {
  switch (kind) {
    case "choose":
      return buildChooseQuestion(item, pool);
    case "audio":
      return buildAudioQuestion(item, pool);
    case "true-false":
      return buildTrueFalseQuestion(item);
  }
}

export function generateAssimilationTest(
  letters: AlphabetLetter[],
): TestQuestion[] {
  if (letters.length === 0) return [];

  const selected = pickPrioritizedLetters(letters, SELECTED_COUNT);
  const questions: TestQuestion[] = [];

  for (const item of selected) {
    const count = randomInt(MIN_QUESTIONS_PER_ITEM, MAX_QUESTIONS_PER_ITEM);
    const kinds = pickRandom(ALL_KINDS, count);

    for (const kind of kinds) {
      const q = buildQuestion(kind, item, letters);
      if (q) questions.push(q);
    }
  }

  return shuffle(questions);
}
