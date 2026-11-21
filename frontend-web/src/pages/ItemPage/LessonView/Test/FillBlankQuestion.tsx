import { useState } from "react";
import { motion } from "framer-motion";
import type { TestQuestionFillBlank } from "../../../../utils/testGenerator";
import { checkTextAnswer } from "../../../../utils/test/shared";
import SpeakControls from "../../../../components/SpeakButton/SpeakControls";
import PhraseToken from "../PhraseToken";
import { spring } from "../../../../lib/motion";

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

  const renderPhrase = () =>
    question.phraseTokens.map((token, index) => (
      <span key={index}>
        {index === question.gapIndex ? (
          <span className="fill-blank__gap">_</span>
        ) : (
          <PhraseToken token={token} />
        )}
        {token.space_after && "\u00A0\u00A0"}
      </span>
    ));

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
        <SpeakControls text={phraseHangul} />
      </div>

      {question.mode === "choice" && (
        <div className="choose-question__variants">
          {question.variants.map((variant, index) => {
            const variantIsCorrect = index === question.correctIndex;
            let modifier = "";
            if (answered) {
              if (variantIsCorrect) {
                modifier = "choose-question__variant--correct";
              } else if (index === selectedIndex) {
                modifier = "choose-question__variant--wrong";
              }
            }
            return (
              <button
                key={index}
                type="button"
                className={`choose-question__variant ${modifier}`}
                onClick={() => onSelect(index)}
                disabled={answered}
              >
                <span className="choose-question__variant-key">
                  {index + 1}
                </span>
                <span className="choose-question__variant-text">{variant}</span>
              </button>
            );
          })}
        </div>
      )}

      {question.mode === "input" && (
        <div className="text-input">
          <input
            type="text"
            className="input text-input__field"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите слово"
            aria-label="Пропущенное слово"
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
      )}

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
