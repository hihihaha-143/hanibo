// frontend-web/src/utils/test/generators/textInput.ts

import type { CourseItemWord } from "../../../api/course";
import type { TestQuestionTextInput } from "../types";

/**
 * Генерирует вопросы типа "text-input" по словам урока.
 *
 * На каждое слово — ОДИН вопрос, случайно:
 * - hangul → ввод перевода
 * - translation → ввод хангыля
 *
 * correctAnswer — единственное правильное значение (синонимов в БД нет).
 * Проверка ответа делается в компоненте (нормализация + опечатки).
 *
 * Возвращает НЕперемешанный массив — перемешивание делает вызывающий код.
 */
export function generateTextInputQuestions(
  words: CourseItemWord[],
): TestQuestionTextInput[] {
  const questions: TestQuestionTextInput[] = [];

  for (const word of words) {
    const askHangul = Math.random() < 0.5;

    if (askHangul) {
      // показываем перевод → вводим хангыль
      questions.push({
        type: "text-input",
        id: `word-${word.id}-ti-ru-to-ko`,
        instruction: "Напишите это по-корейски",
        prompt: word.translation,
        promptAudio: null,
        correctAnswer: word.hangul,
        placeholder: "Введите хангыль",
      });
    } else {
      // показываем хангыль → вводим перевод
      questions.push({
        type: "text-input",
        id: `word-${word.id}-ti-ko-to-ru`,
        instruction: "Напишите перевод",
        prompt: word.hangul,
        promptAudio: word.hangul,
        correctAnswer: word.translation,
        placeholder: "Введите перевод",
      });
    }
  }

  return questions;
}
