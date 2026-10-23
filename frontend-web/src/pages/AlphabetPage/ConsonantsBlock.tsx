import LetterGridBlock from "./Modal/LetterGridBlock";
import type { AlphabetLetter } from "../../api/alphabet";

interface ConsonantsBlockProps {
  letters: AlphabetLetter[];
  showProgress: boolean;
}

export default function ConsonantsBlock({
  letters,
  showProgress,
}: ConsonantsBlockProps) {
  const consonants = letters.filter((l) => l.category === "consonant");

  return <LetterGridBlock letters={consonants} showProgress={showProgress} />;
}
