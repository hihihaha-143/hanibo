// frontend-web/src/utils/test/shared.ts

import type { CourseItemWord } from "../../api/course";

// =============================================================================
// shuffle
// =============================================================================

/**
 * Перемешивание массива (Fisher–Yates).
 * Возвращает новый массив, исходный не мутирует.
 */
export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// =============================================================================
// buildVariants
// =============================================================================

/**
 * Собирает варианты ответа (правильный + 3 дистрактора) из пула слов.
 * Дистракторы сначала берутся из той же части речи, потом — из остальных.
 */
export function buildVariants(
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

// =============================================================================
// checkTextAnswer
// =============================================================================

/**
 * Нормализация текста для сравнения:
 * - нижний регистр
 * - обрезка пробелов по краям
 * - ё → е
 * - множественные пробелы → один
 */
function normalizeText(text: string): string {
  return text.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
}

/**
 * Расстояние Левенштейна между двумя строками.
 * Классический алгоритм с двумя строками (O(min(a,b)) по памяти).
 */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  if (a.length > b.length) [a, b] = [b, a];

  const aLen = a.length;
  const bLen = b.length;

  let prev = new Array<number>(aLen + 1);
  let curr = new Array<number>(aLen + 1);

  for (let i = 0; i <= aLen; i++) prev[i] = i;

  for (let j = 1; j <= bLen; j++) {
    curr[0] = j;
    for (let i = 1; i <= aLen; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[i] = Math.min(curr[i - 1] + 1, prev[i] + 1, prev[i - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }

  return prev[aLen];
}

/**
 * Порог допустимых опечаток в зависимости от длины правильного ответа.
 * - < 5 символов — 0 опечаток
 * - 5–8 символов — 1 опечатка
 * - 9+ символов — 2 опечатки
 */
function allowedTypos(length: number): number {
  if (length < 5) return 0;
  if (length <= 8) return 1;
  return 2;
}

/**
 * Проверка текстового ответа гостя.
 * Сравнивает нормализованные строки, допускает опечатки по порогу.
 */
export function checkTextAnswer(input: string, correct: string): boolean {
  const a = normalizeText(input);
  const b = normalizeText(correct);

  if (a === b) return true;
  if (a.length === 0) return false;

  const distance = levenshtein(a, b);
  return distance <= allowedTypos(b.length);
}
