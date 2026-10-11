// frontend-web/src/utils/test/generators/flashcard.ts

import type { CourseItemWord } from "../../../api/course";
import type { TestQuestionFlashcard } from "../types";

/**
 * Генерирует вопросы типа "flashcard" по словам урока.
 *
 * На каждое слово — один вопрос, направление случайно:
 * - front = hangul, back = translation
 * - front = translation, back = hangul
 *
 * frontAudio и backAudio — озвучка для соответствующей стороны.
 * Для hangul — корейский текст, для translation — null.
 *
 * Возвращает НЕперемешанный массив — перемешивание делает вызывающий код.
 */
export function generateFlashcardQuestions(
  words: CourseItemWord[],
): TestQuestionFlashcard[] {
  const questions: TestQuestionFlashcard[] = [];

  for (const word of words) {
    const reversed = Math.random() < 0.5;

    if (reversed) {
      questions.push({
        type: "flashcard",
        id: `word-${word.id}-flashcard-rev`,
        instruction: "Вспомните слово",
        front: word.translation,
        back: word.hangul,
        frontAudio: null,
        backAudio: word.hangul,
      });
    } else {
      questions.push({
        type: "flashcard",
        id: `word-${word.id}-flashcard`,
        instruction: "Вспомните перевод",
        front: word.hangul,
        back: word.translation,
        frontAudio: word.hangul,
        backAudio: null,
      });
    }
  }

  return questions;
}
