// frontend-web/src/pages/AlphabetPage/VowelsBlock.tsx

import type { AlphabetLetter } from "../../api/alphabet";
import LetterGridBlock from "./LetterGridBlock";

interface VowelsBlockProps {
  letters: AlphabetLetter[];
  showProgress?: boolean;
}

export default function VowelsBlock({
  letters,
  showProgress = false,
}: VowelsBlockProps) {
  const vowels = letters.filter((letter) => letter.category === "vowel");
  return <LetterGridBlock letters={vowels} showProgress={showProgress} />;
}
