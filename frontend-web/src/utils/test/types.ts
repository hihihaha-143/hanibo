import type { Phrase, PhraseToken } from "../../api/course";

// ---------- общие ----------

/**
 * Базовый вопрос. Все типы вопросов наследуют его.
 * @field id — уникальный id вопроса (например, "word-12-ko-to-ru")
 * @field instruction — текст-инструкция («Выберите перевод»)
 */
export interface TestQuestionBase {
  id: string;
  instruction: string;
}

// ---------- 1. Одиночный выбор (слово) ----------

export interface TestQuestionChoose extends TestQuestionBase {
  type: "choose";
  prompt: string;
  promptAudio: string | null;
  variants: string[];
  correctIndices: number[];
}

// ---------- 2. Одиночный выбор (грамматика) ----------

export interface TestQuestionChooseGrammar extends TestQuestionBase {
  type: "choose-grammar";
  promptPhrase: Phrase;
  variants: string[];
  correctIndices: number[];
}

// ---------- 3. Верно/Неверно ----------

export interface TestQuestionTrueFalse extends TestQuestionBase {
  type: "true-false";
  prompt: string; // например, "안녕 — привет"
  promptAudio: string | null;
  correct: boolean; // true = утверждение верное
}

// ---------- 4. Ввод текста ----------

export interface TestQuestionTextInput extends TestQuestionBase {
  type: "text-input";
  prompt: string;
  promptAudio: string | null;
  correctAnswer: string;
  placeholder?: string;
}

// ---------- 5. Сопоставление ----------

export interface TestQuestionMatchPair {
  left: string;
  right: string;
}

export interface TestQuestionMatch extends TestQuestionBase {
  type: "match";
  pairs: TestQuestionMatchPair[];
}

// ---------- 6. Выбор правильного написания ----------

export interface TestQuestionCorrectSpelling extends TestQuestionBase {
  type: "correct-spelling";
  prompt: string; // перевод слова, к которому выбираем написание
  promptAudio: string | null;
  variants: string[]; // варианты хангыля
  correctIndex: number;
}

// ---------- 7. Пропуск слога ----------

export interface TestQuestionSyllableGapChoice extends TestQuestionBase {
  type: "syllable-gap";
  mode: "choice";
  prompt: string; // слово с пропуском, например "안_"
  promptAudio: string | null;
  variants: string[];
  correctIndex: number;
}

export interface TestQuestionSyllableGapInput extends TestQuestionBase {
  type: "syllable-gap";
  mode: "input";
  prompt: string;
  promptAudio: string | null;
  correctAnswer: string;
}

export type TestQuestionSyllableGap =
  | TestQuestionSyllableGapChoice
  | TestQuestionSyllableGapInput;

// ---------- 8. Карточки ----------

export interface TestQuestionFlashcard extends TestQuestionBase {
  type: "flashcard";
  front: string; // что показываем (например, hangul)
  back: string; // что раскрываем (например, translation)
  frontAudio: string | null;
  backAudio: string | null;
}

// ---------- 9. Заполнение пропуска ----------

export interface TestQuestionFillBlankChoice extends TestQuestionBase {
  type: "fill-blank";
  mode: "choice";
  phraseTokens: PhraseToken[];
  gapIndex: number; // индекс токена, который пропущен
  variants: string[];
  correctIndex: number;
}

export interface TestQuestionFillBlankInput extends TestQuestionBase {
  type: "fill-blank";
  mode: "input";
  phraseTokens: PhraseToken[];
  gapIndex: number;
  correctAnswer: string;
}

export type TestQuestionFillBlank =
  | TestQuestionFillBlankChoice
  | TestQuestionFillBlankInput;

// ---------- 10. Порядок слов ----------

export interface TestQuestionWordOrder extends TestQuestionBase {
  type: "word-order";
  phraseTranslation: string; // перевод — подсказка для гостя
  tokens: string[]; // перемешанные токены
  correctOrder: string[]; // правильный порядок токенов
}

// ---------- 11. Аудио → выбор ----------

export interface TestQuestionAudioChoose extends TestQuestionBase {
  type: "audio-choose";
  audioText: string;              // что произносим (hangul слова)
  mode: "translation" | "hangul"; // что показываем в вариантах
  promptHangul: string;           // показываем после ответа
  promptTranslation: string;      // показываем после ответа
  variants: string[];
  correctIndices: number[];
}



// ---------- объединение ----------

export type TestQuestion =
  | TestQuestionChoose
  | TestQuestionChooseGrammar
  | TestQuestionTrueFalse
  | TestQuestionTextInput
  | TestQuestionMatch
  | TestQuestionCorrectSpelling
  | TestQuestionSyllableGap
  | TestQuestionFlashcard
  | TestQuestionFillBlank
  | TestQuestionWordOrder
  | TestQuestionAudioChoose;
