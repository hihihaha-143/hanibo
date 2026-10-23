// frontend-web/src/pages/AlphabetPage/VowelsBlock.tsx

import LetterGridBlock from "./Modal/LetterGridBlock"; // <--- исправленный путь
import type { AlphabetLetter } from "../../api/alphabet";

interface VowelsBlockProps {
  letters: AlphabetLetter[];
  showProgress: boolean;
}

export default function VowelsBlock({
  letters,
  showProgress,
}: VowelsBlockProps) {
  const vowels = letters.filter((l) => l.category === "vowel");

  return <LetterGridBlock letters={vowels} showProgress={showProgress} />;
}
