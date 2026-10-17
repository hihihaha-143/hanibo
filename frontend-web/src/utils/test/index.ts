// frontend-web/src/utils/test/index.ts

import type { CourseItemWord, GrammarRule, Phrase } from "../../api/course";
import type { TestQuestion } from "./types";
import { shuffle } from "./shared";
import { generateChooseWordQuestions } from "./generators/chooseWord";
import { generateChooseGrammarQuestions } from "./generators/chooseGrammar";
import { generateTrueFalseQuestions } from "./generators/trueFalse";
import { generateTextInputQuestions } from "./generators/textInput";
import { generateMatchQuestions } from "./generators/match";
import {
  generateFillBlankQuestions,
  buildWordPoolFromPhrases,
} from "./generators/fillBlank";
import { generateWordOrderQuestions } from "./generators/wordOrder";
import { generateAudioChooseQuestions } from "./generators/audioChoose";
import { generateCorrectSpellingQuestions } from "./generators/correctSpelling";
import { generateFlashcardQuestions } from "./generators/flashcard";
import { generateSyllableGapQuestions } from "./generators/syllableGap";

// реэкспорт типов и утилит — чтобы импорты снаружи остались короткими
export * from "./types";
export { shuffle, buildVariants } from "./shared";

// ---------- вспомогательный тип для пула правил ----------

interface GrammarRuleLike {
  id: number;
  title: string;
}

// ---------- утилита: дедупликация фраз по id ----------

function uniquePhrases(phrases: Phrase[]): Phrase[] {
  const map = new Map<number, Phrase>();
  for (const p of phrases) map.set(p.id, p);
  return Array.from(map.values());
}

// ---------- ВСЕ вопросы по словам (без лимита) ----------

/**
 * Все словесные вопросы по уроку — без ограничения.
 * Используется итоговыми тестами, которые сами режут пул.
 */
function generateAllWordsQuestions(words: CourseItemWord[]): TestQuestion[] {
  const phrases = uniquePhrases(words.flatMap((w) => w.phrases));

  return [
    ...generateChooseWordQuestions(words),
    ...generateTrueFalseQuestions(words),
    ...generateTextInputQuestions(words),
    ...generateMatchQuestions(words),
    ...generateFillBlankQuestions(phrases, words),
    ...generateWordOrderQuestions(phrases),
    ...generateAudioChooseQuestions(words),
    ...generateCorrectSpellingQuestions(words),
    ...generateFlashcardQuestions(words),
    ...generateSyllableGapQuestions(words),
  ];
}

// ---------- ВСЕ вопросы по грамматике (без лимита) ----------

function generateAllGrammarQuestions(
  rules: GrammarRule[],
  poolRules: GrammarRuleLike[],
): TestQuestion[] {
  const phrases = uniquePhrases(rules.flatMap((r) => r.phrases));
  const pool = buildWordPoolFromPhrases(phrases);

  return [
    ...generateChooseGrammarQuestions(rules, poolRules),
    ...generateFillBlankQuestions(phrases, pool),
    ...generateWordOrderQuestions(phrases),
  ];
}

// ---------- публичные тесты с лимитом ----------

const WORDS_TEST_MAX = 15;
const GRAMMAR_TEST_MAX = 15;

/**
 * Тест по словам урока: не больше WORDS_TEST_MAX вопросов.
 */
export function generateWordsTest(words: CourseItemWord[]): TestQuestion[] {
  return shuffle(generateAllWordsQuestions(words)).slice(0, WORDS_TEST_MAX);
}

/**
 * Тест по грамматике урока: не больше GRAMMAR_TEST_MAX вопросов.
 */
export function generateGrammarTest(
  rules: GrammarRule[],
  poolRules: GrammarRuleLike[],
): TestQuestion[] {
  return shuffle(generateAllGrammarQuestions(rules, poolRules)).slice(
    0,
    GRAMMAR_TEST_MAX,
  );
}

// ---------- вспомогательное: сборка теста с лимитом (половина/половина) ----------

function buildTest(
  wordsQuestions: TestQuestion[],
  grammarQuestions: TestQuestion[],
  max: number,
): TestQuestion[] {
  const combined = [...wordsQuestions, ...grammarQuestions];

  if (combined.length <= max) {
    return shuffle(combined);
  }

  const half = Math.floor(max / 2);

  const wordsSelected = shuffle(wordsQuestions).slice(0, half);
  const grammarSelected = shuffle(grammarQuestions).slice(0, max - half);

  const selected = [...wordsSelected, ...grammarSelected];

  if (selected.length < max) {
    const usedIds = new Set(selected.map((q) => q.id));
    const remainder = combined.filter((q) => !usedIds.has(q.id));
    const extra = shuffle(remainder).slice(0, max - selected.length);
    selected.push(...extra);
  }

  return shuffle(selected);
}

// ---------- итоговый тест урока ----------

const FINAL_TEST_MAX = 30;

export function generateFinalTest(
  words: CourseItemWord[],
  rules: GrammarRule[],
  poolRules: GrammarRuleLike[],
): TestQuestion[] {
  const wordsQuestions = generateAllWordsQuestions(words);
  const grammarQuestions = generateAllGrammarQuestions(rules, poolRules);

  return buildTest(wordsQuestions, grammarQuestions, FINAL_TEST_MAX);
}

// ---------- итоговый тест курса ----------

const COURSE_TEST_MAX = 30;

export function generateCourseTest(
  words: CourseItemWord[],
  rules: GrammarRule[],
  poolRules: GrammarRuleLike[],
): TestQuestion[] {
  const wordsQuestions = generateAllWordsQuestions(words);
  const grammarQuestions = generateAllGrammarQuestions(rules, poolRules);

  return buildTest(wordsQuestions, grammarQuestions, COURSE_TEST_MAX);
}
