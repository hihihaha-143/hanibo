// frontend-web/src/utils/letterGroupTestGenerator.ts

import type { AlphabetCategory, AlphabetLetter } from "../api/alphabet";
import type { TestQuestion } from "./test";
import { shuffle } from "./test";

const MIN_LETTERS_FOR_MATCH = 4;

const SELECTED_LETTERS_COUNT = 5;
const MIN_QUESTIONS_PER_LETTER = 1;
const MAX_QUESTIONS_PER_LETTER = 3;

const CATEGORY_LABEL: Record<AlphabetCategory, string> = {
  vowel: "гласных",
  consonant: "согласных",
  diphthong: "дифтонгов",
  assimilation: "ассимиляции",
  all: "всех",
};

type LetterQuestionType =
  | "choose-symbol-to-roman"
  | "choose-roman-to-symbol"
  | "true-false"
  | "text-input"
  | "flashcard";

const ALL_LETTER_QUESTION_TYPES: LetterQuestionType[] = [
  "choose-symbol-to-roman",
  "choose-roman-to-symbol",
  "true-false",
  "text-input",
  "flashcard",
];

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
  key: "romanization" | "symbol",
): AlphabetLetter[] {
  const filtered = pool.filter(
    (l) => l.id !== exclude.id && l[key] !== exclude[key],
  );
  return pickRandom(filtered, count);
}

/**
 * Приоритетная выборка записей для теста:
 * 1) «в процессе» (0 < score < max_score), отсортированы по score по убыванию
 * 2) «не начато» (score = 0), случайно
 * 3) «изучено» (score = max_score), случайно — только если не хватило
 * Если все изучены — просто случайные.
 */
export function pickPrioritizedLetters(
  letters: AlphabetLetter[],
  count: number,
): AlphabetLetter[] {
  if (letters.length === 0) return [];

  const inProgress = letters
    .filter(
      (l) => l.progress.score > 0 && l.progress.score < l.progress.max_score,
    )
    .sort((a, b) => b.progress.score - a.progress.score);

  const notStarted = shuffle(letters.filter((l) => l.progress.score === 0));

  const mastered = shuffle(
    letters.filter((l) => l.progress.score >= l.progress.max_score),
  );

  const result: AlphabetLetter[] = [];

  for (const item of [...inProgress, ...notStarted, ...mastered]) {
    if (result.length >= count) break;
    result.push(item);
  }

  // на случай, если во всех группах пусто (не должно случиться) — рандом
  if (result.length === 0) {
    return pickRandom(letters, count);
  }

  return result;
}

// ---------- генераторы одного вопроса по букве ----------

function buildChooseSymbolToRoman(
  letter: AlphabetLetter,
  pool: AlphabetLetter[],
): TestQuestion | null {
  const distractors = pickDistractors(pool, letter, 3, "romanization");
  if (distractors.length < 3) return null;

  const variants = shuffle([letter, ...distractors]).map((l) => l.romanization);
  const correctIndex = variants.indexOf(letter.romanization);

  return {
    id: `alphabet-${letter.id}-symbol-to-roman-${Date.now()}-${Math.random()}`,
    instruction: "Выберите правильную транскрипцию",
    type: "choose",
    prompt: `Как читается буква «${letter.symbol}»?`,
    promptAudio: null,
    variants,
    correctIndices: [correctIndex],
    letterId: letter.id,
  };
}

function buildChooseRomanToSymbol(
  letter: AlphabetLetter,
  pool: AlphabetLetter[],
): TestQuestion | null {
  const distractors = pickDistractors(pool, letter, 3, "symbol");
  if (distractors.length < 3) return null;

  const variants = shuffle([letter, ...distractors]).map((l) => l.symbol);
  const correctIndex = variants.indexOf(letter.symbol);

  return {
    id: `alphabet-${letter.id}-roman-to-symbol-${Date.now()}-${Math.random()}`,
    instruction: "Выберите правильную букву",
    type: "choose",
    prompt: `Какая буква читается как «${letter.romanization}»?`,
    promptAudio: null,
    variants,
    correctIndices: [correctIndex],
    letterId: letter.id,
  };
}

function buildTrueFalse(
  letter: AlphabetLetter,
  pool: AlphabetLetter[],
): TestQuestion | null {
  const isCorrectPair = Math.random() < 0.5;
  let shownRomanization = letter.romanization;

  if (!isCorrectPair) {
    const wrong = pickRandom(
      pool.filter(
        (l) => l.id !== letter.id && l.romanization !== letter.romanization,
      ),
      1,
    )[0];
    if (!wrong) return null;
    shownRomanization = wrong.romanization;
  }

  return {
    id: `alphabet-${letter.id}-tf-${Date.now()}-${Math.random()}`,
    instruction: "Верно или неверно?",
    type: "true-false",
    prompt: `Буква «${letter.symbol}» читается как «${shownRomanization}»`,
    promptAudio: null,
    correct: isCorrectPair,
    letterId: letter.id,
  };
}

function buildTextInput(letter: AlphabetLetter): TestQuestion {
  return {
    id: `alphabet-${letter.id}-input-roman-${Date.now()}-${Math.random()}`,
    instruction: "Напишите ответ",
    type: "text-input",
    prompt: `Напишите романизацию буквы «${letter.symbol}»`,
    promptAudio: null,
    correctAnswer: letter.romanization,
    letterId: letter.id,
  };
}

function buildFlashcard(
  letter: AlphabetLetter,
  category: AlphabetCategory,
): TestQuestion {
  const label = CATEGORY_LABEL[category];
  return {
    id: `alphabet-${letter.id}-flashcard-${Date.now()}-${Math.random()}`,
    instruction: `Карточка ${label}`,
    type: "flashcard",
    front: letter.symbol,
    back: `${letter.romanization}${letter.sound_ipa ? ` · [${letter.sound_ipa}]` : ""}`,
    frontAudio: null,
    backAudio: null,
    letterId: letter.id,
  };
}

function buildQuestionByType(
  type: LetterQuestionType,
  letter: AlphabetLetter,
  pool: AlphabetLetter[],
  category: AlphabetCategory,
): TestQuestion | null {
  switch (type) {
    case "choose-symbol-to-roman":
      return buildChooseSymbolToRoman(letter, pool);
    case "choose-roman-to-symbol":
      return buildChooseRomanToSymbol(letter, pool);
    case "true-false":
      return buildTrueFalse(letter, pool);
    case "text-input":
      return buildTextInput(letter);
    case "flashcard":
      return buildFlashcard(letter, category);
  }
}

// ---------- match (один бонусный вопрос на 4 буквы) ----------

function buildMatchQuestion(
  letters: AlphabetLetter[],
  category: AlphabetCategory,
): TestQuestion | null {
  if (letters.length < MIN_LETTERS_FOR_MATCH) return null;

  const chunk = pickRandom(letters, 4);
  if (chunk.length < 4) return null;

  return {
    id: `alphabet-match-${category}-${Date.now()}-${Math.random()}`,
    instruction: "Сопоставьте буквы и транскрипции",
    type: "match",
    pairs: chunk.map((l) => ({
      left: l.symbol,
      right: l.romanization,
    })),
  };
}

// ---------- основной генератор ----------

export interface GenerateLetterGroupTestOptions {
  /**
   * Если задан — эта буква обязательно попадёт в выборку,
   * остальные добираются по приоритету.
   */
  forcedLetterId?: number;
}

export function generateLetterGroupTest(
  letters: AlphabetLetter[],
  category: AlphabetCategory,
  options: GenerateLetterGroupTestOptions = {},
): TestQuestion[] {
  if (letters.length === 0) return [];

  const { forcedLetterId } = options;

  let selectedLetters: AlphabetLetter[];

  if (forcedLetterId != null) {
    const forced = letters.find((l) => l.id === forcedLetterId);
    if (forced) {
      const rest = letters.filter((l) => l.id !== forcedLetterId);
      const extra = pickPrioritizedLetters(rest, SELECTED_LETTERS_COUNT - 1);
      selectedLetters = [forced, ...extra];
    } else {
      selectedLetters = pickPrioritizedLetters(letters, SELECTED_LETTERS_COUNT);
    }
  } else {
    selectedLetters = pickPrioritizedLetters(letters, SELECTED_LETTERS_COUNT);
  }

  const questions: TestQuestion[] = [];

  for (const letter of selectedLetters) {
    const questionsCount = randomInt(
      MIN_QUESTIONS_PER_LETTER,
      MAX_QUESTIONS_PER_LETTER,
    );

    // типы без повторов для одной буквы
    const typesForLetter = pickRandom(
      ALL_LETTER_QUESTION_TYPES,
      questionsCount,
    );

    for (const type of typesForLetter) {
      const q = buildQuestionByType(type, letter, letters, category);
      if (q) questions.push(q);
    }
  }

  // match завязан на 4 буквы и в награды по буквам не идёт —
  // поэтому он остаётся без letterId и в submit не попадает
  const matchQuestion = buildMatchQuestion(letters, category);
  if (matchQuestion) questions.push(matchQuestion);

  return shuffle(questions);
}
