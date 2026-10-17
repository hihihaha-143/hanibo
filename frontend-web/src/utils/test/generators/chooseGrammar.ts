// frontend-web/src/utils/test/generators/chooseGrammar.ts

import type { GrammarRule } from "../../../api/course";
import type { TestQuestionChooseGrammar } from "../types";
import { shuffle } from "../shared";

/**
 * Минимальный тип правила для дистракторов.
 * Полное правило не нужно — только id и title.
 */
interface GrammarRuleLike {
  id: number;
  title: string;
}

/**
 * Генерирует вопросы типа "choose-grammar".
 *
 * Логика:
 * - Промпт — фраза (пример) из правил урока.
 * - Правильный ответ — правило урока, к которому привязана фраза.
 * - Дистракторы — правила из пула (poolRules).
 *
 * Возвращает НЕперемешанный массив — перемешивание делает вызывающий код.
 */
export function generateChooseGrammarQuestions(
  rules: GrammarRule[],
  poolRules: GrammarRuleLike[],
): TestQuestionChooseGrammar[] {
  // Собираем фразы урока с правильными ответами (только правила урока).
  const phraseMap = new Map<
    number,
    { phrase: GrammarRule["phrases"][number]; correctIds: number[] }
  >();

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

  const questions: TestQuestionChooseGrammar[] = [];

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

  return questions;
}
