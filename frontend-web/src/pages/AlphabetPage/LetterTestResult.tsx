// frontend-web/src/pages/AlphabetPage/LetterTestResult.tsx

import { motion } from "framer-motion";
import { spring } from "../../lib/motion";

interface LetterTestResultProps {
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  onRepeat: () => void;
  onBack: () => void;
  onClose: () => void;
}

export default function LetterTestResult({
  correct,
  total,
  percent,
  passed,
  onRepeat,
  onBack,
  onClose,
}: LetterTestResultProps) {
  return (
    <div className="letter-test-result">
      <div className="letter-test-result__score">
        {correct} / {total}
      </div>
      <div className="letter-test-result__percent">{percent}%</div>
      <div
        className={`letter-test-result__status ${
          passed
            ? "letter-test-result__status--passed"
            : "letter-test-result__status--failed"
        }`}
      >
        {passed ? "Пройдено" : "Не пройдено"}
      </div>

      <div className="letter-test-result__actions">
        <motion.button
          type="button"
          className="letter-test-result__button letter-test-result__button--secondary"
          onClick={onRepeat}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.bouncy}
        >
          Пройти снова
        </motion.button>

        {passed ? (
          <motion.button
            type="button"
            className="letter-test-result__button letter-test-result__button--primary"
            onClick={onBack}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.bouncy}
          >
            К букве
          </motion.button>
        ) : (
          <motion.button
            type="button"
            className="letter-test-result__button letter-test-result__button--primary"
            onClick={onClose}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.bouncy}
          >
            Закрыть
          </motion.button>
        )}
      </div>
    </div>
  );
}
