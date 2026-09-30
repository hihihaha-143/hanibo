import type { CourseItemWord } from "../../../../api/course";
import WordCard from "./WordCard";

interface WordListBlockProps {
  words: CourseItemWord[];
}

export default function WordListBlock({ words }: WordListBlockProps) {
  return (
    <div className="word-list-block">
      {words.map((word) => (
        <WordCard key={word.id} word={word} />
      ))}
    </div>
  );
}
