import { motion } from "framer-motion";
import { spring } from "../../../lib/motion";

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
      <div className="letter-test-result__header">
        <h2 className="letter-test-result__title">
          {passed ? "Отлично!" : "Попробуй ещё раз"}
        </h2>
        <p className="letter-test-result__subtitle">
          {correct} из {total} правильных ({percent}%)
        </p>
      </div>

      <div className="letter-test-result__actions">
        <motion.button
          type="button"
          className="btn btn--accent"
          onClick={onRepeat}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.bouncy}
        >
          Пройти ещё раз
        </motion.button>

        <motion.button
          type="button"
          className="btn btn--ghost"
          onClick={onBack}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.bouncy}
        >
          К букве
        </motion.button>

        <motion.button
          type="button"
          className="btn btn--ghost"
          onClick={onClose}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.bouncy}
        >
          Закрыть
        </motion.button>
      </div>
    </div>
  );
}
