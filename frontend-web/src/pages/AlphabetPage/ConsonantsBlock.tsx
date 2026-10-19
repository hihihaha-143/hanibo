// frontend-web/src/pages/AlphabetPage/ConsonantsBlock.tsx

import type { AlphabetLetter } from "../../api/alphabet";
import LetterGridBlock from "./LetterGridBlock";

interface ConsonantsBlockProps {
  letters: AlphabetLetter[];
  showProgress?: boolean;
}

export default function ConsonantsBlock({
  letters,
  showProgress = false,
}: ConsonantsBlockProps) {
  const consonants = letters.filter(
    (letter) => letter.category === "consonant",
  );
  return <LetterGridBlock letters={consonants} showProgress={showProgress} />;
}
