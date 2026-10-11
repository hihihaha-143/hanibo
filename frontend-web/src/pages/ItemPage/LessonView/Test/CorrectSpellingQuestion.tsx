import { motion } from "framer-motion";
import type { TestQuestionCorrectSpelling } from "../../../../utils/testGenerator";
import { spring } from "../../../../lib/motion";

interface CorrectSpellingQuestionProps {
  question: TestQuestionCorrectSpelling;
  selectedIndex: number | null;
  answered: boolean;
  onSelect: (index: number) => void;
}

export default function CorrectSpellingQuestion({
  question,
  selectedIndex,
  answered,
  onSelect,
}: CorrectSpellingQuestionProps) {
  return (
    <div className="choose-question choose-question--correct-spelling">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="choose-question__prompt">
        <span className="choose-question__prompt-text">{question.prompt}</span>
      </div>

      <div className="choose-question__variants">
        {question.variants.map((variant, index) => {
          const isCorrect = index === question.correctIndex;
          let modifier = "";
          if (answered) {
            if (isCorrect) modifier = "choose-question__variant--correct";
            else if (index === selectedIndex)
              modifier = "choose-question__variant--wrong";
          }
          return (
            <motion.button
              key={index}
              type="button"
              className={`choose-question__variant choose-question__variant--hangul ${modifier}`}
              onClick={() => onSelect(index)}
              disabled={answered}
              whileHover={!answered ? { y: -1, scale: 1.01 } : undefined}
              whileTap={!answered ? { scale: 0.98 } : undefined}
              transition={spring.bouncy}
            >
              <span className="choose-question__variant-key">{index + 1}</span>
              <span className="choose-question__variant-text">{variant}</span>
            </motion.button>
          );
        })}
      </div>

      {answered && (
        <motion.div
          className={
            "choose-question__feedback " +
            (question.correctIndex === selectedIndex
              ? "choose-question__feedback--correct"
              : "choose-question__feedback--wrong")
          }
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.base}
        >
          {question.correctIndex === selectedIndex
            ? "Верно"
            : `Правильно: ${question.variants[question.correctIndex]}`}
        </motion.div>
      )}
    </div>
  );
}
