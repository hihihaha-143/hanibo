import type { CourseItemWord, GrammarRule, Phrase } from "../api/course";

// ---------- типы вопросов ----------

export interface TestQuestionChoose {
  type: "choose";
  id: string;
  instruction: string;
  prompt: string;
  promptAudio: string | null;
  variants: string[];
  correctIndices: number[];
}

export interface TestQuestionChooseGrammar {
  type: "choose-grammar";
  id: string;
  instruction: string;
  promptPhrase: Phrase;
  variants: string[];
  correctIndices: number[];
}

export type TestQuestion = TestQuestionChoose | TestQuestionChooseGrammar;

// ---------- типы-минимумы (для pool) ----------

interface GrammarRuleLike {
  id: number;
  title: string;
}

// ---------- утилиты ----------

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildVariants(
  correct: string,
  pool: CourseItemWord[],
  correctWord: CourseItemWord,
  getValue: (w: CourseItemWord) => string,
): { variants: string[]; correctIndices: number[] } {
  const samePos = pool.filter(
    (w) =>
      w.id !== correctWord.id &&
      w.part_of_speech?.id === correctWord.part_of_speech?.id,
  );
  const otherPos = pool.filter(
    (w) =>
      w.id !== correctWord.id &&
      w.part_of_speech?.id !== correctWord.part_of_speech?.id,
  );

  const distractorPool = [...samePos, ...otherPos];

  const used = new Set<string>([correct]);
  const distractors: string[] = [];

  for (const w of distractorPool) {
    const value = getValue(w);
    if (used.has(value)) continue;
    used.add(value);
    distractors.push(value);
    if (distractors.length >= 3) break;
  }

  const variants = shuffle([correct, ...distractors]);
  const correctIndices = [variants.indexOf(correct)];

  return { variants, correctIndices };
}

// ---------- генератор: слова ----------

export function generateWordsTest(words: CourseItemWord[]): TestQuestion[] {
  const questions: TestQuestion[] = [];

  for (const word of words) {
    // Тип 1: корейский → выбор перевода
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

    // Тип 4: русский → выбор хангыля
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

  return shuffle(questions);
}

// ---------- генератор: грамматика ----------

/**
 * Тест по грамматике.
 *
 * Логика:
 * - Промпт — фраза (пример) из правил урока.
 * - Правильный ответ — правило урока, к которому привязана фраза.
 * - Дистракторы — правила из пула (poolRules).
 */
export function generateGrammarTest(
  rules: GrammarRule[],
  poolRules: GrammarRuleLike[],
): TestQuestion[] {
  // Собираем фразы урока с правильными ответами (только правила урока).
  const phraseMap = new Map<number, { phrase: Phrase; correctIds: number[] }>();

  for (const rule of rules) {
    for (const phrase of rule.phrases) {
      const existing = phraseMap.get(phrase.id);
      if (existing) {
        if (!existing.correctIds.includes(rule.id)) {
          existing.correctIds.push(rule.id);
        }
      } else {
        phraseMap.set(phrase.id, {
          phrase,
          correctIds: [rule.id],
        });
      }
    }
  }

  // Пул всех правил для дистракторов.
  // ВАЖНО: включаем правила урока (rules) — иначе правильные ответы
  // не находятся в pool, и все грамматические вопросы отбрасываются.
  const allRules = [...rules, ...poolRules].map((r) => ({
    id: r.id,
    title: r.title,
  }));

  const questions: TestQuestion[] = [];

  for (const { phrase, correctIds } of phraseMap.values()) {
    // Правильные названия — ТОЛЬКО правила урока.
    const correctTitles: string[] = [];
    for (const id of correctIds) {
      const r = allRules.find((x) => x.id === id);
      if (r) correctTitles.push(r.title);
    }

    if (correctTitles.length === 0) continue;

    // Дистракторы — правила, НЕ входящие в correctTitles.
    const usedTitles = new Set(correctTitles);
    const distractors: string[] = [];
    for (const r of allRules) {
      if (usedTitles.has(r.title)) continue;
      distractors.push(r.title);
      if (distractors.length >= 3) break;
    }

    const variants = shuffle([...correctTitles, ...distractors]);
    const correctIndices = correctTitles
      .map((t) => variants.indexOf(t))
      .filter((i) => i >= 0);

    questions.push({
      type: "choose-grammar",
      id: `grammar-phrase-${phrase.id}`,
      instruction: "Какое правило используется в этом примере?",
      promptPhrase: phrase,
      variants,
      correctIndices,
    });
  }

  return shuffle(questions);
}

// ---------- генератор: итоговый тест ----------

/**
 * Итоговый тест по уроку.
 *
 * Логика:
 * - Собираем все вопросы из словаря и грамматики.
 * - Если получилось больше FINAL_TEST_MAX — обрезаем случайно.
 * - Если меньше — оставляем как есть.
 */
const FINAL_TEST_MAX = 20;

export function generateFinalTest(
  words: CourseItemWord[],
  rules: GrammarRule[],
  poolRules: GrammarRuleLike[],
): TestQuestion[] {
  const wordsQuestions = generateWordsTest(words);
  const grammarQuestions = generateGrammarTest(rules, poolRules);

  const combined = [...wordsQuestions, ...grammarQuestions];

  if (combined.length <= FINAL_TEST_MAX) {
    return shuffle(combined);
  }

  const half = Math.floor(FINAL_TEST_MAX / 2);

  const wordsSelected = shuffle(wordsQuestions).slice(0, half);
  const grammarSelected = shuffle(grammarQuestions).slice(
    0,
    FINAL_TEST_MAX - half,
  );

  const selected = [...wordsSelected, ...grammarSelected];

  if (selected.length < FINAL_TEST_MAX) {
    const usedIds = new Set(selected.map((q) => q.id));
    const remainder = combined.filter((q) => !usedIds.has(q.id));
    const extra = shuffle(remainder).slice(0, FINAL_TEST_MAX - selected.length);
    selected.push(...extra);
  }

  return shuffle(selected);
}

// ---------- генератор: итоговый тест курса ----------

/**
 * Итоговый тест по группе уроков (элемент курса type === "test").
 *
 * Логика:
 * - words и rules — уже объединённые и дедуплицированные данные
 *   со всех уроков группы (это делает вызывающий код).
 * - Используем те же генераторы, что и в тесте урока.
 * - Ограничиваем общее число вопросов COURSE_TEST_MAX.
 */
const COURSE_TEST_MAX = 30;

export function generateCourseTest(
  words: CourseItemWord[],
  rules: GrammarRule[],
  poolRules: GrammarRuleLike[],
): TestQuestion[] {
  const wordsQuestions = generateWordsTest(words);
  const grammarQuestions = generateGrammarTest(rules, poolRules);

  const combined = [...wordsQuestions, ...grammarQuestions];

  if (combined.length <= COURSE_TEST_MAX) {
    return shuffle(combined);
  }

  const half = Math.floor(COURSE_TEST_MAX / 2);

  const wordsSelected = shuffle(wordsQuestions).slice(0, half);
  const grammarSelected = shuffle(grammarQuestions).slice(
    0,
    COURSE_TEST_MAX - half,
  );

  const selected = [...wordsSelected, ...grammarSelected];

  if (selected.length < COURSE_TEST_MAX) {
    const usedIds = new Set(selected.map((q) => q.id));
    const remainder = combined.filter((q) => !usedIds.has(q.id));
    const extra = shuffle(remainder).slice(
      0,
      COURSE_TEST_MAX - selected.length,
    );
    selected.push(...extra);
  }

  return shuffle(selected);
}
