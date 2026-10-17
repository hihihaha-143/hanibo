// frontend-web/src/utils/test/generators/wordOrder.ts

import type { Phrase } from "../../../api/course";
import type { TestQuestionWordOrder } from "../types";
import { shuffle } from "../shared";

/**
 * Строит один вопрос word-order из фразы.
 *
 * Логика:
 * - Если во фразе меньше 2 токенов — контекста нет, вопрос не строим.
 * - tokens — перемешанные тексты токенов.
 * - correctOrder — правильный порядок (по phrase.tokens[].order).
 * - phraseTranslation — перевод фразы как подсказка.
 *
 * Возвращает null, если фраза не подходит.
 */
function buildWordOrderFromPhrase(
  phrase: Phrase,
): TestQuestionWordOrder | null {
  if (phrase.tokens.length < 2) return null;

  // Токены приходят уже отсортированными по order (в PhraseResource),
  // но на всякий случай отсортируем.
  const sorted = [...phrase.tokens].sort((a, b) => a.order - b.order);

  const correctOrder = sorted.map((t) => t.text);
  const shuffled = shuffle(correctOrder);

  // Если случайно перемешали в исходный порядок — перемешаем снова.
  // (не критично, но неприятно, когда "перемешанное" = правильное)
  let finalTokens = shuffled;
  if (correctOrder.length > 1 && arraysEqual(shuffled, correctOrder)) {
    finalTokens = shuffle(correctOrder);
  }

  return {
    type: "word-order",
    id: `word-order-${phrase.id}`,
    instruction: "Соберите предложение",
    phraseTranslation: phrase.translation,
    tokens: finalTokens,
    correctOrder,
  };
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Генерирует вопросы word-order из набора фраз.
 *
 * @param phrases — фразы, из которых строим вопросы.
 *
 * Возвращает НЕперемешанный массив — перемешивание делает вызывающий код.
 */
export function generateWordOrderQuestions(
  phrases: Phrase[],
): TestQuestionWordOrder[] {
  const questions: TestQuestionWordOrder[] = [];

  for (const phrase of phrases) {
    const q = buildWordOrderFromPhrase(phrase);
    if (q) questions.push(q);
  }

  return questions;
}
