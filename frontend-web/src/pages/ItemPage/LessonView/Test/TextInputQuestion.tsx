// frontend-web/src/pages/ItemPage/LessonView/Test/TextInputQuestion.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import type { TestQuestionTextInput } from "../../../../utils/testGenerator";
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

  const speak = (text: string, rate: number) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = rate;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

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
        {question.promptAudio && (
          <div className="choose-question__speak">
            <motion.button
              type="button"
              className="choose-question__speak-button"
              onClick={() => speak(question.promptAudio!, 0.5)}
              title="Медленно"
              whileHover={{ y: -1, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={spring.bouncy}
            >
              <Volume2 size={16} />
              <span>0.5</span>
            </motion.button>
            <motion.button
              type="button"
              className="choose-question__speak-button"
              onClick={() => speak(question.promptAudio!, 1)}
              title="Обычно"
              whileHover={{ y: -1, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={spring.bouncy}
            >
              <Volume2 size={16} />
              <span>1</span>
            </motion.button>
          </div>
        )}
      </div>

      <div className="text-input">
        <input
          type="text"
          className="text-input__field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={question.placeholder}
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
          {isCorrect ? "Верно" : `Правильный ответ: ${question.correctAnswer}`}
        </motion.div>
      )}
    </div>
  );
}
