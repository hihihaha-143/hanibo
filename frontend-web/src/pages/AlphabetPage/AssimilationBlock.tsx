import LetterGridBlock from "./Modal/LetterGridBlock";
import type { AlphabetLetter } from "../../api/alphabet";

interface AssimilationBlockProps {
  letters: AlphabetLetter[];
  showProgress: boolean;
}

export default function AssimilationBlock({
  letters,
  showProgress,
}: AssimilationBlockProps) {
  const assimilation = letters.filter((l) => l.category === "assimilation");

  return <LetterGridBlock letters={assimilation} showProgress={showProgress} />;
}
