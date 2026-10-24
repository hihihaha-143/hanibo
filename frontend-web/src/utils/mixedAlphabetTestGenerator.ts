// frontend-web/src/utils/mixedAlphabetTestGenerator.ts

import type { AlphabetLetter } from "../api/alphabet";
import type { TestQuestion } from "./test";
import { shuffle } from "./test";
import {
  generateLetterGroupTest,
  pickPrioritizedLetters,
} from "./letterGroupTestGenerator";
import { generateAssimilationTest } from "./assimilationTestGenerator";

const MIXED_SELECTED_COUNT = 5;

export function generateMixedAlphabetTest(
  letters: AlphabetLetter[],
): TestQuestion[] {
  if (letters.length === 0) return [];

  const selected = pickPrioritizedLetters(letters, MIXED_SELECTED_COUNT);
  const questions: TestQuestion[] = [];

  for (const item of selected) {
    if (item.category === "assimilation") {
      const q = generateAssimilationTest([item]);
      questions.push(...q);
    } else {
      const pool = letters.filter((l) => l.category === item.category);
      const q = generateLetterGroupTest(pool, item.category, {
        forcedLetterId: item.id,
      }).filter((question) => question.letterId === item.id);
      questions.push(...q);
    }
  }

  return shuffle(questions);
}
