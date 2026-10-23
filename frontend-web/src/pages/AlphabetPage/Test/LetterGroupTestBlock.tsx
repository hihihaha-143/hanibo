import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { spring } from "../../../lib/motion";
import type { AlphabetCategory, AlphabetLetter } from "../../../api/alphabet";
import { generateLetterGroupTest } from "../../../utils/letterGroupTestGenerator";
import Test from "../../ItemPage/LessonView/Test/Test";
import TestResult from "../../ItemPage/LessonView/Test/TestResult";

interface LetterGroupTestBlockProps {
  letters: AlphabetLetter[];
  category: AlphabetCategory;
  onBack: () => void;
}

interface FinishResult {
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
}

const CATEGORY_TITLE: Record<AlphabetCategory, string> = {
  vowel: "гласные",
  consonant: "согласные",
  diphthong: "дифтонги",
};

export default function LetterGroupTestBlock({
  letters,
  category,
  onBack,
}: LetterGroupTestBlockProps) {
  const [round, setRound] = useState(0);
  const [finished, setFinished] = useState<FinishResult | null>(null);

  const questions = useMemo(
    () => generateLetterGroupTest(letters, category),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [letters, category, round],
  );

  const handleFinish = (correct: number, total: number, passed: boolean) => {
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    setFinished({ correct, total, percent, passed });
  };

  const handleRepeat = () => {
    setFinished(null);
    setRound((r) => r + 1);
  };

  return (
    <div className="letter-group-test-block">
      <div className="letter-group-test-block__head">
        <motion.button
          type="button"
          className="letter-group-test-block__back"
          onClick={onBack}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.bouncy}
        >
          ← К алфавиту
        </motion.button>
        <span className="letter-group-test-block__title">
          Тест: {CATEGORY_TITLE[category]}
        </span>
      </div>

      <div className="letter-group-test-block__body">
        {finished ? (
          <TestResult
            correct={finished.correct}
            total={finished.total}
            percent={finished.percent}
            passed={finished.passed}
            onRepeat={handleRepeat}
            onBack={onBack}
            backLabel="К алфавиту"
          />
        ) : (
          <Test
            key={round}
            questions={questions}
            onFinish={handleFinish}
            onRepeat={handleRepeat}
            onBack={onBack}
            backLabel="К алфавиту"
          />
        )}
      </div>
    </div>
  );
}
