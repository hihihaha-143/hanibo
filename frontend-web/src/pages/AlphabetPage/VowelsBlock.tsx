import type { AlphabetLetter } from "../../api/alphabet";
import LetterGridBlock from "./LetterGridBlock";

interface VowelsBlockProps {
  letters: AlphabetLetter[];
}

export default function VowelsBlock({ letters }: VowelsBlockProps) {
  const vowels = letters.filter((letter) => letter.category === "vowel");
  return <LetterGridBlock letters={vowels} />;
}
