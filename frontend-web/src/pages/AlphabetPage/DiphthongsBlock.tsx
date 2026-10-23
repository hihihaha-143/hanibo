import LetterGridBlock from "./Modal/LetterGridBlock";
import type { AlphabetLetter } from "../../api/alphabet";

interface DiphthongsBlockProps {
  letters: AlphabetLetter[];
  showProgress: boolean;
}

export default function DiphthongsBlock({
  letters,
  showProgress,
}: DiphthongsBlockProps) {
  const diphthongs = letters.filter((l) => l.category === "diphthong");

  return <LetterGridBlock letters={diphthongs} showProgress={showProgress} />;
}
