import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { spring } from "../../../../lib/motion";

interface TestResultProps {
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  onRepeat: () => void;
  onBack: () => void;
  backLabel?: string;
  onNext?: () => void;
  nextLabel?: string;
}

export default function TestResult({
  correct,
  total,
  percent,
  passed,
  onRepeat,
  onBack,
  backLabel,
  onNext,
  nextLabel,
}: TestResultProps) {
  return (
    <div className="test-result">
      <div className="test-result__score">
        {correct} / {total}
      </div>
      <div className="test-result__percent">{percent}%</div>
      <div
        className={`test-result__status ${
          passed ? "test-result__status--passed" : "test-result__status--failed"
        }`}
      >
        {passed ? "Пройдено" : "Не пройдено"}
      </div>

      <div className="test-result__actions">
        <motion.button
          type="button"
          className="test-result__button test-result__button--secondary"
          onClick={onRepeat}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.bouncy}
        >
          Пройти снова
        </motion.button>

        {!passed && (
          <motion.button
            type="button"
            className="test-result__button test-result__button--secondary"
            onClick={onBack}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.bouncy}
          >
            {backLabel ?? "Назад"}
          </motion.button>
        )}

        {passed && onNext && (
          <motion.button
            type="button"
            className="test-result__button test-result__button--primary"
            onClick={onNext}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.bouncy}
          >
            <span>{nextLabel ?? "Далее"}</span>
            <ArrowRight size={18} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
