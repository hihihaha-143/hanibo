// frontend-web/src/pages/AlphabetPage/LetterTestBlock.tsx

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { spring } from "../../lib/motion";
import type { AlphabetLetter } from "../../api/alphabet";
import { generateLetterTest } from "../../utils/letterTestGenerator";
import Test from "../ItemPage/LessonView/Test/Test";

interface LetterTestBlockProps {
  letter: AlphabetLetter;
  allLetters: AlphabetLetter[];
  onBack: () => void;
}

export default function LetterTestBlock({
  letter,
  allLetters,
  onBack,
}: LetterTestBlockProps) {
  const [round, setRound] = useState(0);

  const questions = useMemo(
    () => generateLetterTest(letter, allLetters),
    // round в зависимостях — чтобы при "Повторить" генерились новые дистракторы
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [letter.id, allLetters, round],
  );

  const handleFinish = (_correct: number, _total: number, _passed: boolean) => {
    // результат показывается внутри TestResult; здесь ничего не делаем
  };

  const handleRepeat = () => {
    setRound((r) => r + 1);
  };

  return (
    <div className="letter-test-block">
      <div className="letter-test-block__head">
        <motion.button
          type="button"
          className="letter-test-block__back"
          onClick={onBack}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.bouncy}
        >
          ← К букве
        </motion.button>
        <span className="letter-test-block__title">
          Тест по букве {letter.symbol}
        </span>
      </div>

      <Test
        key={round}
        questions={questions}
        onFinish={handleFinish}
        onRepeat={handleRepeat}
        onBack={onBack}
        backLabel="К букве"
      />
    </div>
  );
}
