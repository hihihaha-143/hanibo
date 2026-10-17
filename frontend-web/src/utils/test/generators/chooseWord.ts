// frontend-web/src/utils/test/generators/chooseWord.ts

import type { CourseItemWord } from "../../../api/course";
import type { TestQuestionChoose } from "../types";
import { buildVariants } from "../shared";

/**
 * Генерирует вопросы типа "choose" по словам урока.
 *
 * На каждое слово — два вопроса:
 * 1. корейский (hangul) → выбор перевода
 * 2. русский (translation) → выбор хангыля
 *
 * Возвращает НЕперемешанный массив — перемешивание делает вызывающий код.
 */
export function generateChooseWordQuestions(
  words: CourseItemWord[],
): TestQuestionChoose[] {
  const questions: TestQuestionChoose[] = [];

  for (const word of words) {
    // корейский → выбор перевода
    {
      const { variants, correctIndices } = buildVariants(
        word.translation,
        words,
        word,
        (w) => w.translation,
      );
      questions.push({
        type: "choose",
        id: `word-${word.id}-ko-to-ru`,
        instruction: "Выберите перевод",
        prompt: word.hangul,
        promptAudio: word.hangul,
        variants,
        correctIndices,
      });
    }

    // русский → выбор хангыля
    {
      const { variants, correctIndices } = buildVariants(
        word.hangul,
        words,
        word,
        (w) => w.hangul,
      );
      questions.push({
        type: "choose",
        id: `word-${word.id}-ru-to-ko`,
        instruction: "Выберите, как это по-корейски",
        prompt: word.translation,
        promptAudio: null,
        variants,
        correctIndices,
      });
    }
  }

  return questions;
}
