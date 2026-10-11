// frontend-web/src/pages/ItemPage/LessonView/Test/FlashcardQuestion.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import type { TestQuestionFlashcard } from "../../../../utils/testGenerator";
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

  const speak = (text: string, rate: number) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = rate;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const handleKnown = () => {
    if (flipped) return;
    setKnown(true);
    onAnswer(true);
    setFlipped(true);
    if (question.backAudio) {
      setTimeout(() => speak(question.backAudio!, 1), 400);
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
      setTimeout(() => speak(question.backAudio!, 1), 400);
    }
  };

  // 1 — Не знаю
  useHotkeys(
    "1",
    (e) => {
      e.preventDefault();
      if (flipped) return;
      handleUnknown();
    },
    [flipped],
  );

  // 2 — Знаю
  useHotkeys(
    "2",
    (e) => {
      e.preventDefault();
      if (flipped) return;
      handleKnown();
    },
    [flipped],
  );

  // Enter — Далее (после «Не знаю»)
  useHotkeys(
    "enter",
    (e) => {
      e.preventDefault();
      if (!flipped) return;
      if (known) return;
      onAutoNext();
    },
    [flipped, known],
  );

  return (
    <div className="choose-question choose-question--flashcard">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className={`flashcard ${flipped ? "flashcard--flipped" : ""}`}>
        <div className="flashcard__inner">
          {/* FRONT */}
          <div className="flashcard__face flashcard__face--front">
            <span className="flashcard__text">{question.front}</span>
            {question.frontAudio && (
              <div className="choose-question__speak">
                <motion.button
                  type="button"
                  className="choose-question__speak-button"
                  onClick={() => speak(question.frontAudio!, 0.5)}
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
                  onClick={() => speak(question.frontAudio!, 1)}
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

          {/* BACK */}
          <div className="flashcard__face flashcard__face--back">
            <span className="flashcard__text">{question.back}</span>
            {question.backAudio && (
              <div className="choose-question__speak">
                <motion.button
                  type="button"
                  className="choose-question__speak-button"
                  onClick={() => speak(question.backAudio!, 0.5)}
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
                  onClick={() => speak(question.backAudio!, 1)}
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
        </div>
      </div>

      {!flipped && (
        <div className="flashcard__actions">
          <motion.button
            type="button"
            className="flashcard__action flashcard__action--unknown"
            onClick={handleUnknown}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.bouncy}
          >
            <span className="flashcard__key">1</span>
            Не знаю
          </motion.button>
          <motion.button
            type="button"
            className="flashcard__action flashcard__action--known"
            onClick={handleKnown}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
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
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.bouncy}
          >
            Далее
          </motion.button>
        </div>
      )}
    </div>
  );
}
