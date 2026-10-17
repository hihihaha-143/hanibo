// frontend-web/src/utils/test/generators/fillBlank.ts

import type { CourseItemWord, Phrase } from "../../../api/course";
import type { TestQuestionFillBlank } from "../types";
import { shuffle } from "../shared";

/**
 * Строит один fill-blank вопрос из фразы.
 *
 * Логика:
 * - Если во фразе меньше 2 токенов — контекста нет, вопрос не строим.
 * - Среди токенов ищем те, у которых есть word (слово из словаря).
 * - Случайно берём один такой токен — это будет пропуск.
 * - Правильный ответ — hangul этого слова.
 * - mode: "choice" (выбор из 4) или "input" (ввод текста) — случайно 50/50.
 *
 * Дистракторы для choice — hangul других слов из pool (сначала той же части речи).
 *
 * Возвращает null, если фраза не подходит.
 */
function buildFillBlankFromPhrase(
  phrase: Phrase,
  pool: CourseItemWord[],
): TestQuestionFillBlank | null {
  // Если во фразе меньше 2 токенов — контекста нет, fill-blank не работает.
  if (phrase.tokens.length < 2) return null;

  const candidateIndices: number[] = [];
  phrase.tokens.forEach((t, i) => {
    if (t.word) candidateIndices.push(i);
  });

  if (candidateIndices.length === 0) return null;

  const gapIndex =
    candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
  const gapToken = phrase.tokens[gapIndex];
  const correctAnswer = gapToken.word!.hangul;

  const mode: "choice" | "input" = Math.random() < 0.5 ? "choice" : "input";

  if (mode === "input") {
    return {
      type: "fill-blank",
      mode: "input",
      id: `fill-blank-${phrase.id}-${gapIndex}-input`,
      instruction: "Впишите пропущенное слово",
      phraseTokens: phrase.tokens,
      gapIndex,
      correctAnswer,
    };
  }

  // mode === "choice"
  const targetPosId = pool.find((w) => w.hangul === correctAnswer)
    ?.part_of_speech?.id;

  const samePos = pool.filter(
    (w) => w.hangul !== correctAnswer && w.part_of_speech?.id === targetPosId,
  );
  const otherPos = pool.filter(
    (w) => w.hangul !== correctAnswer && w.part_of_speech?.id !== targetPosId,
  );

  const used = new Set<string>([correctAnswer]);
  const distractors: string[] = [];

  for (const w of [...samePos, ...otherPos]) {
    if (used.has(w.hangul)) continue;
    used.add(w.hangul);
    distractors.push(w.hangul);
    if (distractors.length >= 3) break;
  }

  const variants = shuffle([correctAnswer, ...distractors]);
  const correctIndex = variants.indexOf(correctAnswer);

  return {
    type: "fill-blank",
    mode: "choice",
    id: `fill-blank-${phrase.id}-${gapIndex}-choice`,
    instruction: "Выберите пропущенное слово",
    phraseTokens: phrase.tokens,
    gapIndex,
    variants,
    correctIndex,
  };
}

/**
 * Генерирует вопросы fill-blank из набора фраз.
 *
 * @param phrases — фразы, из которых строим вопросы (phrases слов урока,
 *                  phrases правил урока, или объединение обоих).
 * @param pool    — пул слов для дистракторов в режиме "choice".
 *
 * Возвращает НЕперемешанный массив — перемешивание делает вызывающий код.
 */
export function generateFillBlankQuestions(
  phrases: Phrase[],
  pool: CourseItemWord[],
): TestQuestionFillBlank[] {
  const questions: TestQuestionFillBlank[] = [];

  for (const phrase of phrases) {
    const q = buildFillBlankFromPhrase(phrase, pool);
    if (q) questions.push(q);
  }

  return questions;
}

/**
 * Собирает "пул слов" из фраз (нужно для теста грамматики,
 * где исходных CourseItemWord нет — только GrammarRule с phrases).
 *
 * part_of_speech / level / topics / phrases — пустые, т.к. токен их не отдаёт.
 */
export function buildWordPoolFromPhrases(phrases: Phrase[]): CourseItemWord[] {
  const seen = new Set<string>();
  const result: CourseItemWord[] = [];

  for (const phrase of phrases) {
    for (const t of phrase.tokens) {
      if (!t.word) continue;
      if (seen.has(t.word.hangul)) continue;
      seen.add(t.word.hangul);
      result.push({
        id: t.word.id,
        hangul: t.word.hangul,
        translation: t.word.translation,
        part_of_speech: null,
        level: null,
        topics: [],
        phrases: [],
      });
    }
  }

  return result;
}
