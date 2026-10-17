// frontend-web/src/utils/test/generators/trueFalse.ts

import type { CourseItemWord } from "../../../api/course";
import type { TestQuestionTrueFalse } from "../types";
import { shuffle } from "../shared";

/**
 * Генерирует вопросы типа "true-false" по словам урока.
 *
 * На каждое слово — ОДНО утверждение, случайно:
 * - верное: "hangul — translation" (из одного слова)
 * - ложное: "hangul — <чужой translation>" (перевод от другого слова)
 *
 * Дистрактор для ложного утверждения берётся сначала из той же части речи,
 * если такой есть; иначе — из любой другой.
 *
 * Возвращает НЕперемешанный массив — перемешивание делает вызывающий код.
 */
export function generateTrueFalseQuestions(
  words: CourseItemWord[],
): TestQuestionTrueFalse[] {
  if (words.length < 2) return [];

  const questions: TestQuestionTrueFalse[] = [];

  for (const word of words) {
    const makeCorrect = Math.random() < 0.5;

    if (makeCorrect) {
      questions.push({
        type: "true-false",
        id: `word-${word.id}-tf-correct`,
        instruction: "Верно или неверно",
        prompt: `${word.hangul} — ${word.translation}`,
        promptAudio: word.hangul,
        correct: true,
      });
    } else {
      const distractor = pickDistractor(word, words);
      if (!distractor) continue; // нет подходящего дистрактора — пропускаем

      questions.push({
        type: "true-false",
        id: `word-${word.id}-tf-wrong`,
        instruction: "Верно или неверно",
        prompt: `${word.hangul} — ${distractor.translation}`,
        promptAudio: word.hangul,
        correct: false,
      });
    }
  }

  return questions;
}

/**
 * Подбирает дистрактор для ложного утверждения.
 * Сначала — из той же части речи, иначе — из любой другой.
 * Возвращает null, если в пуле не нашлось ни одного слова.
 */
function pickDistractor(
  word: CourseItemWord,
  pool: CourseItemWord[],
): CourseItemWord | null {
  const samePos = pool.filter(
    (w) => w.id !== word.id && w.part_of_speech?.id === word.part_of_speech?.id,
  );
  const otherPos = pool.filter(
    (w) => w.id !== word.id && w.part_of_speech?.id !== word.part_of_speech?.id,
  );

  const candidates = samePos.length > 0 ? samePos : otherPos;
  if (candidates.length === 0) return null;

  return shuffle(candidates)[0];
}
