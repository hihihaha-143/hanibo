// frontend-web/src/utils/test/generators/audioChoose.ts

import type { CourseItemWord } from "../../../api/course";
import type { TestQuestionAudioChoose } from "../types";
import { shuffle } from "../shared";

/**
 * Генерирует вопросы типа "audio-choose" по словам урока.
 *
 * На каждое слово — один вопрос:
 * - audioText = hangul слова (это гость услышит),
 * - mode: "translation" (варианты — переводы) или "hangul" (варианты — хангыли),
 *   случайно 50/50,
 * - promptHangul и promptTranslation заполняются для показа после ответа.
 *
 * Дистракторы — другие слова из пула.
 *
 * Возвращает НЕперемешанный массив — перемешивание делает вызывающий код.
 */
export function generateAudioChooseQuestions(
  words: CourseItemWord[],
): TestQuestionAudioChoose[] {
  if (words.length < 2) return [];

  const questions: TestQuestionAudioChoose[] = [];

  for (const word of words) {
    const mode: "translation" | "hangul" =
      Math.random() < 0.5 ? "translation" : "hangul";

    const correct = mode === "translation" ? word.translation : word.hangul;
    const getValue = (w: CourseItemWord) =>
      mode === "translation" ? w.translation : w.hangul;

    // дистракторы — сначала той же части речи, потом любые другие
    const samePos = words.filter(
      (w) =>
        w.id !== word.id && w.part_of_speech?.id === word.part_of_speech?.id,
    );
    const otherPos = words.filter(
      (w) =>
        w.id !== word.id && w.part_of_speech?.id !== word.part_of_speech?.id,
    );

    const used = new Set<string>([correct]);
    const distractors: string[] = [];

    for (const w of [...samePos, ...otherPos]) {
      const v = getValue(w);
      if (used.has(v)) continue;
      used.add(v);
      distractors.push(v);
      if (distractors.length >= 3) break;
    }

    if (distractors.length < 3) continue; // мало пула — пропускаем

    const variants = shuffle([correct, ...distractors]);
    const correctIndices = [variants.indexOf(correct)];

    questions.push({
      type: "audio-choose",
      id: `word-${word.id}-audio-${mode}`,
      instruction: "Прослушайте и выберите",
      audioText: word.hangul,
      mode,
      promptHangul: word.hangul,
      promptTranslation: word.translation,
      variants,
      correctIndices,
    });
  }

  return questions;
}
