import type { AlphabetLetter } from "../../api/alphabet";
import LetterGridBlock from "./LetterGridBlock";

interface DiphthongsBlockProps {
  letters: AlphabetLetter[];
}

export default function DiphthongsBlock({ letters }: DiphthongsBlockProps) {
  const diphthongs = letters.filter(
    (letter) => letter.category === "diphthong",
  );
  return <LetterGridBlock letters={diphthongs} />;
}
