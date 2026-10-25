// frontend-web/src/utils/letterTestGenerator.ts

import type { AlphabetLetter } from "../api/alphabet";
import type {
  TestQuestion,
  TestQuestionChoose,
  TestQuestionAudioChoose,
  TestQuestionCorrectSpelling,
  TestQuestionTextInput,
  TestQuestionMatch,
  TestQuestionFlashcard,
} from "./test/types";
import { shuffle } from "./test/shared";

const CATEGORY_LABEL: Record<AlphabetLetter["category"], string> = {
  vowel: "гласная",
  diphthong: "дифтонг",
  consonant: "согласная",
  assimilation: "ассимиляция",
  all: "все",
};

/**
 * Достаёт N уникальных дистракторов из пула.
 */
function pickDistractors(
  pool: AlphabetLetter[],
  exclude: string[],
  getValue: (l: AlphabetLetter) => string | null,
  count: number,
): string[] {
  const used = new Set(exclude);
  const result: string[] = [];

  for (const letter of shuffle(pool)) {
    const value = getValue(letter);
    if (!value) continue;
    if (used.has(value)) continue;
    used.add(value);
    result.push(value);
    if (result.length >= count) break;
  }

  return result;
}

/**
 * Генерирует 10 вопросов для одной буквы алфавита.
 */
export function generateLetterTest(
  letter: AlphabetLetter,
  allLetters: AlphabetLetter[],
): TestQuestion[] {
  const pool = allLetters.filter((l) => l.id !== letter.id);
  const questions: TestQuestion[] = [];

  // 1. choose — романизация
  {
    const distractors = pickDistractors(
      pool,
      [letter.romanization],
      (l) => l.romanization,
      3,
    );
    const variants = shuffle([letter.romanization, ...distractors]);
    const q: TestQuestionChoose = {
      id: `letter-${letter.id}-romanization`,
      type: "choose",
      instruction: "Выберите романизацию буквы",
      prompt: letter.symbol,
      promptAudio: letter.symbol,
      variants,
      correctIndices: [variants.indexOf(letter.romanization)],
    };
    questions.push(q);
  }

  // 2. choose — категория
  {
    const allCategories: AlphabetLetter["category"][] = [
      "vowel",
      "diphthong",
      "consonant",
    ];
    const variants = allCategories.map((c) => CATEGORY_LABEL[c]);
    const correct = CATEGORY_LABEL[letter.category];
    const q: TestQuestionChoose = {
      id: `letter-${letter.id}-category`,
      type: "choose",
      instruction: "Выберите категорию буквы",
      prompt: letter.symbol,
      promptAudio: letter.symbol,
      variants,
      correctIndices: [variants.indexOf(correct)],
    };
    questions.push(q);
  }

  // 3. choose — пример-слово с этой буквой
  if (letter.examples.length > 0) {
    const correctExample = shuffle(letter.examples)[0];

    // дистракторы — слова из других букв, БЕЗ этой буквы в составе
    const candidates: string[] = [];
    for (const other of shuffle(pool)) {
      for (const ex of other.examples) {
        if (ex.word.includes(letter.symbol)) continue;
        if (candidates.includes(ex.word)) continue;
        candidates.push(ex.word);
        if (candidates.length >= 3) break;
      }
      if (candidates.length >= 3) break;
    }

    // если не хватило — добираем любые слова других букв
    if (candidates.length < 3) {
      for (const other of shuffle(pool)) {
        for (const ex of other.examples) {
          if (ex.word === correctExample.word) continue;
          if (candidates.includes(ex.word)) continue;
          candidates.push(ex.word);
          if (candidates.length >= 3) break;
        }
        if (candidates.length >= 3) break;
      }
    }

    if (candidates.length >= 3) {
      const variants = shuffle([correctExample.word, ...candidates]);
      const q: TestQuestionChoose = {
        id: `letter-${letter.id}-example-word`,
        type: "choose",
        instruction: `Выберите слово с буквой ${letter.symbol}`,
        prompt: letter.romanization,
        promptAudio: null,
        variants,
        correctIndices: [variants.indexOf(correctExample.word)],
      };
      questions.push(q);
    }
  }

  // 4. audio-choose — послушай букву, выбери символ
  {
    const distractors = pickDistractors(
      pool,
      [letter.symbol],
      (l) => l.symbol,
      3,
    );
    const variants = shuffle([letter.symbol, ...distractors]);
    const q: TestQuestionAudioChoose = {
      id: `letter-${letter.id}-audio-symbol`,
      type: "audio-choose",
      instruction: "Послушайте и выберите букву",
      audioText: letter.symbol,
      mode: "hangul",
      promptHangul: letter.symbol,
      promptTranslation: letter.romanization,
      variants,
      correctIndices: [variants.indexOf(letter.symbol)],
    };
    questions.push(q);
  }

  // 5. audio-choose — послушай пример-слово, выбери перевод
  if (letter.examples.length > 0) {
    const example = letter.examples[0];
    const otherMeanings = pickDistractors(
      allLetters,
      [example.meaning],
      (l) => l.examples[0]?.meaning ?? null,
      3,
    );
    if (otherMeanings.length < 3) {
      for (const ex of letter.examples) {
        if (ex.meaning === example.meaning) continue;
        if (otherMeanings.includes(ex.meaning)) continue;
        otherMeanings.push(ex.meaning);
        if (otherMeanings.length >= 3) break;
      }
    }
    if (otherMeanings.length >= 3) {
      const variants = shuffle([example.meaning, ...otherMeanings]);
      const q: TestQuestionAudioChoose = {
        id: `letter-${letter.id}-audio-example`,
        type: "audio-choose",
        instruction: "Послушайте слово и выберите перевод",
        audioText: example.word,
        mode: "translation",
        promptHangul: example.word,
        promptTranslation: example.meaning,
        variants,
        correctIndices: [variants.indexOf(example.meaning)],
      };
      questions.push(q);
    }
  }

  // 6. correct-spelling — как пишется буква
  {
    const distractors = pickDistractors(
      pool,
      [letter.symbol],
      (l) => l.symbol,
      3,
    );
    const variants = shuffle([letter.symbol, ...distractors]);
    const q: TestQuestionCorrectSpelling = {
      id: `letter-${letter.id}-spelling`,
      type: "correct-spelling",
      instruction: "Выберите правильное написание буквы",
      prompt: letter.romanization,
      promptAudio: null,
      variants,
      correctIndex: variants.indexOf(letter.symbol),
    };
    questions.push(q);
  }

  // 7. text-input — напиши романизацию
  {
    const q: TestQuestionTextInput = {
      id: `letter-${letter.id}-input-romanization`,
      type: "text-input",
      instruction: "Напишите романизацию буквы (латиницей)",
      prompt: letter.symbol,
      promptAudio: letter.symbol,
      correctAnswer: letter.romanization,
      placeholder: "например, a",
    };
    questions.push(q);
  }

  // 8. match — слово ↔ перевод (3 пары из примеров)
  if (letter.examples.length >= 3) {
    const examples = shuffle(letter.examples).slice(0, 3);
    const q: TestQuestionMatch = {
      id: `letter-${letter.id}-match`,
      type: "match",
      instruction: "Сопоставьте слова и их переводы",
      pairs: examples.map((ex) => ({ left: ex.word, right: ex.meaning })),
    };
    questions.push(q);
  }

  // 9. flashcard — символ → романизация
  {
    const back = letter.sound_ipa
      ? `${letter.romanization} [${letter.sound_ipa}]`
      : letter.romanization;
    const q: TestQuestionFlashcard = {
      id: `letter-${letter.id}-flashcard-symbol`,
      type: "flashcard",
      instruction: "Вспомните букву",
      front: letter.symbol,
      back,
      frontAudio: letter.symbol,
      backAudio: null,
    };
    questions.push(q);
  }

  // 10. flashcard — пример-слово → перевод
  if (letter.examples.length > 0) {
    const example = shuffle(letter.examples)[0];
    const q: TestQuestionFlashcard = {
      id: `letter-${letter.id}-flashcard-example`,
      type: "flashcard",
      instruction: "Вспомните перевод слова",
      front: example.word,
      back: example.meaning,
      frontAudio: example.word,
      backAudio: null,
    };
    questions.push(q);
  }

  return questions;
}
