import type { AlphabetLetter } from "../../api/alphabet";
import LetterGridBlock from "./LetterGridBlock";

interface ConsonantsBlockProps {
  letters: AlphabetLetter[];
}

export default function ConsonantsBlock({ letters }: ConsonantsBlockProps) {
  const consonants = letters.filter(
    (letter) => letter.category === "consonant",
  );
  return <LetterGridBlock letters={consonants} />;
}
