// frontend-web/src/pages/AlphabetPage/LetterModalBlock.tsx

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { spring } from "../../lib/motion";
import type { AlphabetLetter } from "../../api/alphabet";
import LetterWritingBlock from "./LetterWritingBlock";
import LetterSoundBlock from "./LetterSoundBlock";
import LetterFamilyBlock from "./LetterFamilyBlock";
import LetterConfusionBlock from "./LetterConfusionBlock";
import LetterTestBlock from "./LetterTestBlock";

interface LetterModalBlockProps {
  letter: AlphabetLetter | null;
  allLetters?: AlphabetLetter[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

function speak(text: string, rate = 1) {
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = rate;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function LetterModalBlock({
  letter,
  allLetters = [],
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: LetterModalBlockProps) {
  const [view, setView] = useState<"card" | "test">("card");

  // при смене буквы или закрытии — возвращаемся к карточке
  useEffect(() => {
    setView("card");
  }, [letter?.id]);

  useEffect(() => {
    if (!letter) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (view === "test") return; // в тесте стрелки не листают буквы
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [letter, hasPrev, hasNext, onClose, onPrev, onNext, view]);

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

            {view === "test" ? (
              <LetterTestBlock
                letter={letter}
                allLetters={allLetters}
                onBack={() => setView("card")}
              />
            ) : (
              <>
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
                      onClick={() => speak(letter.symbol, 1)}
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

                <div className="letter-modal-block__blocks">
                  <LetterSoundBlock
                    ipa={letter.sound_ipa}
                    note={letter.sound_note}
                    sampleSyllable={letter.sample_syllable}
                    sampleRomanization={letter.sample_romanization}
                    onSpeak={speak}
                  />

                  <LetterWritingBlock symbol={letter.symbol} />

                  <LetterFamilyBlock
                    symbols={letter.family_symbols}
                    note={letter.family_note}
                    currentSymbol={letter.symbol}
                  />

                  <LetterConfusionBlock items={letter.confusion} />
                </div>

                <div className="letter-modal-block__examples">
                  {letter.examples.map((example) => (
                    <div
                      key={example.id}
                      className="letter-modal-block__example"
                    >
                      <div className="letter-modal-block__example-main">
                        <span className="letter-modal-block__example-word">
                          {example.word}
                        </span>
                        {example.romanization && (
                          <span className="letter-modal-block__example-romanization">
                            {example.romanization}
                          </span>
                        )}
                        <span className="letter-modal-block__example-meaning">
                          {example.meaning}
                        </span>
                      </div>

                      <div className="letter-modal-block__example-speak">
                        <motion.button
                          type="button"
                          className="letter-modal-block__speak-button"
                          onClick={() => speak(example.word, 0.5)}
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
                          className="letter-modal-block__speak-button"
                          onClick={() => speak(example.word, 1)}
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
                  ))}
                </div>

                <div className="letter-modal-block__test-cta">
                  <motion.button
                    type="button"
                    className="letter-modal-block__test-button"
                    onClick={() => setView("test")}
                    whileHover={{ y: -1, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring.bouncy}
                  >
                    Пройти тест по букве
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
