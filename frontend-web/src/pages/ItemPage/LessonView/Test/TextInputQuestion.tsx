import { useState } from "react";
import { motion } from "framer-motion";
import type { TestQuestionTextInput } from "../../../../utils/testGenerator";
import SpeakControls from "../../../../components/SpeakButton/SpeakControls";
import { spring } from "../../../../lib/motion";

interface TextInputQuestionProps {
  question: TestQuestionTextInput;
  answered: boolean;
  isCorrect: boolean | null;
  onSubmit: (value: string) => void;
}

export default function TextInputQuestion({
  question,
  answered,
  isCorrect,
  onSubmit,
}: TextInputQuestionProps) {
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

  return (
    <div className="choose-question choose-question--text-input">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="choose-question__prompt">
        <span className="choose-question__prompt-text">{question.prompt}</span>
        {question.promptAudio && <SpeakControls text={question.promptAudio} />}
      </div>

      <div className="text-input">
        <input
          type="text"
          className="input text-input__field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={question.placeholder ?? "Введите ответ"}
          aria-label="Ответ"
          disabled={answered}
          autoFocus
        />

        {!answered && (
          <motion.button
            type="button"
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={value.trim().length === 0}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={spring.bouncy}
          >
            Ответить
          </motion.button>
        )}
      </div>

      {answered && (
        <motion.div
          className={`choose-question__feedback ${
            isCorrect
              ? "choose-question__feedback--correct"
              : "choose-question__feedback--wrong"
          }`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.base}
          aria-live="polite"
        >
          {isCorrect ? "Верно" : `Правильный ответ: ${question.correctAnswer}`}
        </motion.div>
      )}
    </div>
  );
}
