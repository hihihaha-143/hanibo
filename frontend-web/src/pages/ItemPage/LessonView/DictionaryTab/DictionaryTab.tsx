import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { CourseItemWord } from "../../../../api/course";
import {
  generateWordsTest,
  type TestQuestion,
} from "../../../../utils/testGenerator";
import { setWordsPercent } from "../../../../utils/progress";
import WordListBlock from "./WordListBlock";
import Test from "../Test/Test";
import { spring } from "../../../../lib/motion";

interface DictionaryTabProps {
  itemId: number;
  words: CourseItemWord[];
  onGoToGrammar: () => void;
  onProgressChange: () => void;
}

type Mode = "cards" | "test";

export default function DictionaryTab({
  itemId,
  words,
  onGoToGrammar,
  onProgressChange,
}: DictionaryTabProps) {
  const [mode, setMode] = useState<Mode>("cards");
  const [questions, setQuestions] = useState<TestQuestion[]>([]);

  const startTest = () => {
    setQuestions(generateWordsTest(words));
    setMode("test");
  };

  const handleFinish = (correct: number, total: number, _isPassed: boolean) => {
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    setWordsPercent(itemId, percent);
    onProgressChange();
  };

  const handleRepeat = () => {
    setQuestions(generateWordsTest(words));
  };

  const handleBack = () => {
    setMode("cards");
  };

  if (mode === "test") {
    return (
      <div className="dictionary-tab">
        <Test
          questions={questions}
          onFinish={handleFinish}
          onRepeat={handleRepeat}
          onBack={handleBack}
          backLabel="К словарю"
          onNext={onGoToGrammar}
          nextLabel="К грамматике"
        />
      </div>
    );
  }

  return (
    <div className="dictionary-tab">
      <WordListBlock words={words} />

      <div className="dictionary-tab__footer">
        <motion.button
          type="button"
          className="btn btn--primary dictionary-tab__test-button"
          onClick={startTest}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.bouncy}
        >
          <span>Пройти тест</span>
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}
