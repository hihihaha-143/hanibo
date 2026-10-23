// frontend-web/src/utils/letterGroupTestGenerator.ts

import type { AlphabetCategory, AlphabetLetter } from "../api/alphabet";
import type { TestQuestion } from "./test";
import { shuffle } from "./test";

const MIN_LETTERS_FOR_MATCH = 4;

const CATEGORY_LABEL: Record<AlphabetCategory, string> = {
  vowel: "гласных",
  consonant: "согласных",
  diphthong: "дифтонгов",
};

function pickRandom<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, count);
}

function pickDistractors(
  pool: AlphabetLetter[],
  exclude: AlphabetLetter,
  count: number,
  key: "romanization" | "symbol",
): AlphabetLetter[] {
  const filtered = pool.filter(
    (l) => l.id !== exclude.id && l[key] !== exclude[key],
  );
  return pickRandom(filtered, count);
}

export function generateLetterGroupTest(
  letters: AlphabetLetter[],
  category: AlphabetCategory,
): TestQuestion[] {
  if (letters.length === 0) return [];

  const label = CATEGORY_LABEL[category];
  const questions: TestQuestion[] = [];

  // --- choose: символ → романизация ---
  for (const letter of letters) {
    const distractors = pickDistractors(letters, letter, 3, "romanization");
    if (distractors.length < 3) continue;

    const variants = shuffle([letter, ...distractors]).map(
      (l) => l.romanization,
    );
    const correctIndex = variants.indexOf(letter.romanization);

    questions.push({
      id: `alphabet-${letter.id}-symbol-to-roman`,
      instruction: "Выберите правильную транскрипцию",
      type: "choose",
      prompt: `Как читается буква «${letter.symbol}»?`,
      promptAudio: null,
      variants,
      correctIndices: [correctIndex],
    });
  }

  // --- choose: романизация → символ ---
  for (const letter of letters) {
    const distractors = pickDistractors(letters, letter, 3, "symbol");
    if (distractors.length < 3) continue;

    const variants = shuffle([letter, ...distractors]).map((l) => l.symbol);
    const correctIndex = variants.indexOf(letter.symbol);

    questions.push({
      id: `alphabet-${letter.id}-roman-to-symbol`,
      instruction: "Выберите правильную букву",
      type: "choose",
      prompt: `Какая буква читается как «${letter.romanization}»?`,
      promptAudio: null,
      variants,
      correctIndices: [correctIndex],
    });
  }

  // --- true-false ---
  for (const letter of letters) {
    const isCorrectPair = Math.random() < 0.5;
    let shownRomanization = letter.romanization;

    if (!isCorrectPair) {
      const wrong = pickRandom(
        letters.filter(
          (l) => l.id !== letter.id && l.romanization !== letter.romanization,
        ),
        1,
      )[0];
      if (!wrong) continue;
      shownRomanization = wrong.romanization;
    }

    questions.push({
      id: `alphabet-${letter.id}-tf`,
      instruction: "Верно или неверно?",
      type: "true-false",
      prompt: `Буква «${letter.symbol}» читается как «${shownRomanization}»`,
      promptAudio: null,
      correct: isCorrectPair,
    });
  }

  // --- text-input: романизация ---
  for (const letter of letters) {
    questions.push({
      id: `alphabet-${letter.id}-input-roman`,
      instruction: "Напишите ответ",
      type: "text-input",
      prompt: `Напишите романизацию буквы «${letter.symbol}»`,
      promptAudio: null,
      correctAnswer: letter.romanization,
    });
  }

  // --- match: буква ↔ романизация ---
  if (letters.length >= MIN_LETTERS_FOR_MATCH) {
    const groupsCount = Math.max(1, Math.floor(letters.length / 4));
    const shuffled = shuffle(letters);

    for (let g = 0; g < groupsCount; g++) {
      const chunk = shuffled.slice(g * 4, g * 4 + 4);
      if (chunk.length < 4) break;

      questions.push({
        id: `alphabet-match-${category}-${g}`,
        instruction: "Сопоставьте буквы и транскрипции",
        type: "match",
        pairs: chunk.map((l) => ({
          left: l.symbol,
          right: l.romanization,
        })),
      });
    }
  }

  // --- flashcard ---
  for (const letter of letters) {
    questions.push({
      id: `alphabet-${letter.id}-flashcard`,
      instruction: `Карточка ${label}`,
      type: "flashcard",
      front: letter.symbol,
      back: `${letter.romanization}${letter.sound_ipa ? ` · [${letter.sound_ipa}]` : ""}`,
      frontAudio: null,
      backAudio: null,
    });
  }

  return shuffle(questions);
}
