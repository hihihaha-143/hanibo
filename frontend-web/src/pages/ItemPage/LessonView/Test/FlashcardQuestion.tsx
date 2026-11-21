import { useState } from "react";
import { motion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import type { TestQuestionFlashcard } from "../../../../utils/testGenerator";
import SpeakControls from "../../../../components/SpeakButton/SpeakControls";
import { speakKorean } from "../../../../lib/speech";
import { spring } from "../../../../lib/motion";

interface FlashcardQuestionProps {
  question: TestQuestionFlashcard;
  onAnswer: (known: boolean) => void;
  onAutoNext: () => void;
}

const KNOWN_AUTO_DELAY = 1200;

export default function FlashcardQuestion({
  question,
  onAnswer,
  onAutoNext,
}: FlashcardQuestionProps) {
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(false);

  const handleKnown = () => {
    if (flipped) return;
    setKnown(true);
    onAnswer(true);
    setFlipped(true);
    if (question.backAudio) {
      setTimeout(() => speakKorean(question.backAudio!, 1), 400);
    }
    setTimeout(() => {
      onAutoNext();
    }, KNOWN_AUTO_DELAY);
  };

  const handleUnknown = () => {
    if (flipped) return;
    onAnswer(false);
    setFlipped(true);
    if (question.backAudio) {
      setTimeout(() => speakKorean(question.backAudio!, 1), 400);
    }
  };

  useHotkeys(
    "1",
    (e) => {
      e.preventDefault();
      if (flipped) return;
      handleUnknown();
    },
    [flipped],
  );

  useHotkeys(
    "2",
    (e) => {
      e.preventDefault();
      if (flipped) return;
      handleKnown();
    },
    [flipped],
  );

  useHotkeys(
    "enter",
    (e) => {
      e.preventDefault();
      if (!flipped || known) return;
      onAutoNext();
    },
    [flipped, known],
  );

  return (
    <div className="choose-question choose-question--flashcard">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className={`flashcard ${flipped ? "flashcard--flipped" : ""}`}>
        <div className="flashcard__inner">
          <div className="flashcard__face flashcard__face--front">
            <span className="flashcard__text">{question.front}</span>
            {question.frontAudio && (
              <SpeakControls text={question.frontAudio} />
            )}
          </div>

          <div className="flashcard__face flashcard__face--back">
            <span className="flashcard__text">{question.back}</span>
            {question.backAudio && <SpeakControls text={question.backAudio} />}
          </div>
        </div>
      </div>

      {!flipped && (
        <div className="flashcard__actions">
          <motion.button
            type="button"
            className="flashcard__action flashcard__action--unknown"
            onClick={handleUnknown}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={spring.bouncy}
          >
            <span className="flashcard__key">1</span>
            Не знаю
          </motion.button>
          <motion.button
            type="button"
            className="flashcard__action flashcard__action--known"
            onClick={handleKnown}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={spring.bouncy}
          >
            <span className="flashcard__key">2</span>
            Знаю
          </motion.button>
        </div>
      )}

      {flipped && !known && (
        <div className="flashcard__actions">
          <motion.button
            type="button"
            className="flashcard__action flashcard__action--known"
            onClick={onAutoNext}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={spring.bouncy}
          >
            Далее
          </motion.button>
        </div>
      )}
    </div>
  );
}
