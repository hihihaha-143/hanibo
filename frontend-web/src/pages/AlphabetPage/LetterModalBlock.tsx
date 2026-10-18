import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { spring } from "../../lib/motion";
import type { AlphabetLetter } from "../../api/alphabet";
import LetterWritingBlock from "./LetterWritingBlock";

interface LetterModalBlockProps {
  letter: AlphabetLetter | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function LetterModalBlock({
  letter,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: LetterModalBlockProps) {
  useEffect(() => {
    if (!letter) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [letter, hasPrev, hasNext, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {letter && (
        <motion.div
          className="letter-modal-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="letter-modal-block__panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={spring.base}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="letter-modal-block__close"
              onClick={onClose}
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>

            <div className="letter-modal-block__head">
              <button
                type="button"
                className="letter-modal-block__arrow"
                onClick={onPrev}
                disabled={!hasPrev}
                aria-label="Предыдущая буква"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="letter-modal-block__letter">
                <button
                  type="button"
                  className="letter-modal-block__symbol"
                  onClick={() => speak(letter.symbol)}
                  aria-label="Озвучить букву"
                >
                  {letter.symbol}
                </button>
                <span className="letter-modal-block__romanization">
                  {letter.romanization}
                </span>
              </div>

              <button
                type="button"
                className="letter-modal-block__arrow"
                onClick={onNext}
                disabled={!hasNext}
                aria-label="Следующая буква"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <LetterWritingBlock symbol={letter.symbol} />

            <div className="letter-modal-block__examples">
              {letter.examples.map((example) => (
                <button
                  key={example.id}
                  type="button"
                  className="letter-modal-block__example"
                  onClick={() => speak(example.word)}
                >
                  <div className="letter-modal-block__example-head">
                    <span className="letter-modal-block__example-word">
                      {example.word}
                    </span>
                    <Volume2 size={16} className="letter-modal-block__icon" />
                  </div>
                  {example.romanization && (
                    <span className="letter-modal-block__example-romanization">
                      {example.romanization}
                    </span>
                  )}
                  <span className="letter-modal-block__example-meaning">
                    {example.meaning}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
