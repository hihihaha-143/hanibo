// frontend-web/src/utils/test/index.ts

import type { CourseItemWord, GrammarRule, Phrase } from "../../api/course";
import type { TestQuestion } from "./types";
import { shuffle } from "./shared";
import { generateChooseWordQuestions } from "./generators/chooseWord";
import { generateChooseGrammarQuestions } from "./generators/chooseGrammar";
import { generateTrueFalseQuestions } from "./generators/trueFalse";
import { generateTextInputQuestions } from "./generators/textInput";
import { generateMatchQuestions } from "./generators/match";
import { generateAudioChooseQuestions } from "./generators/audioChoose";
import { generateCorrectSpellingQuestions } from "./generators/correctSpelling";




import {
  generateFillBlankQuestions,
  buildWordPoolFromPhrases,
} from "./generators/fillBlank";
import { generateWordOrderQuestions } from "./generators/wordOrder";

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

// ---------- тест по словам ----------

/**
 * Все вопросы по словам урока.
 * Порядок вопросов перемешан.
 */
export function generateWordsTest(words: CourseItemWord[]): TestQuestion[] {
  const phrases = uniquePhrases(words.flatMap((w) => w.phrases));

return shuffle([
  ...generateChooseWordQuestions(words),
  ...generateTrueFalseQuestions(words),
  ...generateTextInputQuestions(words),
  ...generateMatchQuestions(words),
  ...generateFillBlankQuestions(phrases, words),
  ...generateWordOrderQuestions(phrases),
  ...generateAudioChooseQuestions(words),
  ...generateCorrectSpellingQuestions(words),
]);
}

// ---------- тест по грамматике ----------

/**
 * Все вопросы по грамматике урока.
 * Порядок вопросов перемешан.
 */
export function generateGrammarTest(
  rules: GrammarRule[],
  poolRules: GrammarRuleLike[],
): TestQuestion[] {
  const phrases = uniquePhrases(rules.flatMap((r) => r.phrases));
  const pool = buildWordPoolFromPhrases(phrases);

  return shuffle([
    ...generateChooseGrammarQuestions(rules, poolRules),
    ...generateFillBlankQuestions(phrases, pool),
    ...generateWordOrderQuestions(phrases),
  ]);
}

// ---------- вспомогательное: сборка теста с лимитом ----------

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

const FINAL_TEST_MAX = 20;

export function generateFinalTest(
  words: CourseItemWord[],
  rules: GrammarRule[],
  poolRules: GrammarRuleLike[],
): TestQuestion[] {
  const wordsQuestions = generateWordsTest(words);
  const grammarQuestions = generateGrammarTest(rules, poolRules);

  return buildTest(wordsQuestions, grammarQuestions, FINAL_TEST_MAX);
}

// ---------- итоговый тест курса ----------

const COURSE_TEST_MAX = 30;

export function generateCourseTest(
  words: CourseItemWord[],
  rules: GrammarRule[],
  poolRules: GrammarRuleLike[],
): TestQuestion[] {
  const wordsQuestions = generateWordsTest(words);
  const grammarQuestions = generateGrammarTest(rules, poolRules);

  return buildTest(wordsQuestions, grammarQuestions, COURSE_TEST_MAX);
}
