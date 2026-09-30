import { ArrowRight } from "lucide-react";
import type { CourseItemWord } from "../../../../api/course";
import WordListBlock from "./WordListBlock";

interface DictionaryTabProps {
  words: CourseItemWord[];
}

export default function DictionaryTab({ words }: DictionaryTabProps) {
  const handleStartTest = () => {
    // TODO: переход на тест по словарю — позже
    console.log("start dictionary test");
  };

  return (
    <div className="dictionary-tab">
      <WordListBlock words={words} />

      <div className="dictionary-tab__footer">
        <button
          type="button"
          className="dictionary-tab__test-button"
          onClick={handleStartTest}
        >
          <span>Пройти тест</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
