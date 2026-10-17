import { useState } from "react";
import { motion } from "framer-motion";
import type { TestQuestionSyllableGap } from "../../../../utils/testGenerator";
import { spring } from "../../../../lib/motion";

interface SyllableGapQuestionProps {
  question: TestQuestionSyllableGap;
  answered: boolean;
  isCorrect: boolean | null;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onSubmit: (value: string) => void;
}

export default function SyllableGapQuestion({
  question,
  answered,
  isCorrect,
  selectedIndex,
  onSelect,
  onSubmit,
}: SyllableGapQuestionProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (answered) return;
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderPrompt = () => {
    const parts = question.prompt.split("_");
    return (
      <>
        <span>{parts[0]}</span>
        <span className="syllable-gap__gap">_</span>
        <span>{parts[1] ?? ""}</span>
      </>
    );
  };

  return (
    <div className="choose-question choose-question--syllable-gap">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="choose-question__prompt">
        <span className="choose-question__prompt-text">{renderPrompt()}</span>
      </div>

      {question.mode === "choice" && (
        <div className="choose-question__variants choose-question__variants--syllable">
          {question.variants.map((variant, index) => {
            const isCorrectVariant = index === question.correctIndex;
            let modifier = "";
            if (answered) {
              if (isCorrectVariant) {
                modifier = "choose-question__variant--correct";
              } else if (index === selectedIndex) {
                modifier = "choose-question__variant--wrong";
              }
            }
            return (
              <motion.button
                key={index}
                type="button"
                className={`choose-question__variant ${modifier}`}
                onClick={() => onSelect(index)}
                disabled={answered}
                whileHover={!answered ? { y: -1, scale: 1.01 } : undefined}
                whileTap={!answered ? { scale: 0.98 } : undefined}
                transition={spring.bouncy}
              >
                <span className="choose-question__variant-key">
                  {index + 1}
                </span>
                <span className="choose-question__variant-text">{variant}</span>
              </motion.button>
            );
          })}
        </div>
      )}

      {question.mode === "input" && (
        <div className="text-input">
          <input
            type="text"
            className="text-input__field"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите слог"
            disabled={answered}
            autoFocus
          />
          {!answered && (
            <motion.button
              type="button"
              className="text-input__submit"
              onClick={handleSubmit}
              disabled={value.trim().length === 0}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={spring.bouncy}
            >
              Ответить
            </motion.button>
          )}
        </div>
      )}

      {answered && (
        <motion.div
          className={
            isCorrect
              ? "choose-question__feedback choose-question__feedback--correct"
              : "choose-question__feedback choose-question__feedback--wrong"
          }
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.base}
        >
          {isCorrect
            ? "Верно"
            : question.mode === "choice"
              ? `Правильно: ${question.variants[question.correctIndex]}`
              : `Правильно: ${question.correctAnswer}`}
        </motion.div>
      )}
    </div>
  );
}
