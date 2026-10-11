// frontend-web/src/pages/ItemPage/LessonView/Test/FillBlankQuestion.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import type { TestQuestionFillBlank } from "../../../../utils/testGenerator";
import { checkTextAnswer } from "../../../../utils/test/shared";
import { spring } from "../../../../lib/motion";
import PhraseToken from "../PhraseToken";

interface FillBlankQuestionProps {
  question: TestQuestionFillBlank;
  answered: boolean;
  isCorrect: boolean | null;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onSubmit: (value: string) => void;
}

export default function FillBlankQuestion({
  question,
  answered,
  isCorrect,
  selectedIndex,
  onSelect,
  onSubmit,
}: FillBlankQuestionProps) {
  const [value, setValue] = useState("");

  const speak = (text: string, rate: number) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = rate;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const phraseHangul = question.phraseTokens.map((t) => t.text).join(" ");

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

  const renderPhrase = () => {
    return question.phraseTokens.map((token, index) => (
      <span key={index}>
        {index === question.gapIndex ? (
          <span className="fill-blank__gap">_</span>
        ) : (
          <PhraseToken token={token} />
        )}
        {token.space_after && "\u00A0\u00A0"}
      </span>
    ));
  };

  const isAnswerClose =
    question.mode === "input" &&
    answered &&
    isCorrect === false &&
    checkTextAnswer(value, question.correctAnswer);

  return (
    <div className="choose-question choose-question--fill-blank">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="choose-question__prompt">
        <span className="choose-question__prompt-text">{renderPhrase()}</span>
        <div className="choose-question__speak">
          <motion.button
            type="button"
            className="choose-question__speak-button"
            onClick={() => speak(phraseHangul, 0.5)}
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
            onClick={() => speak(phraseHangul, 1)}
            title="Обычно"
            whileHover={{ y: -1, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring.bouncy}
          >
            <Volume2 size={16} />
            <span>1</span>
          </motion.button>
        </div>
      </div>

      {question.mode === "choice" && (
        <div className="choose-question__variants">
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
                {variant}
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
            placeholder="Введите слово"
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
            : question.mode === "input"
              ? isAnswerClose
                ? `Почти! Правильный ответ: ${question.correctAnswer}`
                : `Правильный ответ: ${question.correctAnswer}`
              : `Правильный ответ: ${question.variants[question.correctIndex]}`}
        </motion.div>
      )}
    </div>
  );
}
