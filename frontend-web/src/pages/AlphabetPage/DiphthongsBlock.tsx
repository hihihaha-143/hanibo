// frontend-web/src/pages/AlphabetPage/DiphthongsBlock.tsx

import type { AlphabetLetter } from "../../api/alphabet";
import LetterGridBlock from "./LetterGridBlock";

interface DiphthongsBlockProps {
  letters: AlphabetLetter[];
  showProgress?: boolean;
}

export default function DiphthongsBlock({
  letters,
  showProgress = false,
}: DiphthongsBlockProps) {
  const diphthongs = letters.filter(
    (letter) => letter.category === "diphthong",
  );
  return <LetterGridBlock letters={diphthongs} showProgress={showProgress} />;
}
