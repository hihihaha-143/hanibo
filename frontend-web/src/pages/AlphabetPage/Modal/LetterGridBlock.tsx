import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { spring } from "../../../lib/motion";
import type { AlphabetLetter, AlphabetProgress } from "../../../api/alphabet";
import LetterModalBlock from "../Modal/LetterModalBlock";

interface LetterGridBlockProps {
  letters: AlphabetLetter[];
  showProgress?: boolean;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring.base,
  },
};

export default function LetterGridBlock({
  letters,
  showProgress = false,
}: LetterGridBlockProps) {
  const [lettersState, setLettersState] = useState<AlphabetLetter[]>(letters);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setLettersState(letters);
  }, [letters]);

  const selectedLetter =
    selectedIndex !== null ? (lettersState[selectedIndex] ?? null) : null;

  const handlePrev = () => {
    setSelectedIndex((idx) => (idx !== null && idx > 0 ? idx - 1 : idx));
  };

  const handleNext = () => {
    setSelectedIndex((idx) =>
      idx !== null && idx < lettersState.length - 1 ? idx + 1 : idx,
    );
  };

  const handleProgressUpdated = (
    letterId: number,
    progress: AlphabetProgress,
  ) => {
    setLettersState((prev) =>
      prev.map((letter) =>
        letter.id === letterId ? { ...letter, progress } : letter,
      ),
    );
  };

  const isAssimilation = letters.some((l) => l.category === "assimilation");
  const gridClassName = `letter-grid-block${
    isAssimilation ? " letter-grid-block--assimilation" : ""
  }`;

  return (
    <>
      <motion.div
        className={gridClassName}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {lettersState.map((letter, index) => {
          const percent =
            letter.progress.max_score > 0
              ? (letter.progress.score / letter.progress.max_score) * 100
              : 0;
          const isMastered = letter.progress.score >= letter.progress.max_score;

          return (
            <motion.button
              key={letter.id}
              type="button"
              className={`letter-grid-block__card${
                isMastered ? " letter-grid-block__card--mastered" : ""
              }`}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={spring.base}
              onClick={() => setSelectedIndex(index)}
            >
              <span
                className="letter-grid-block__fill"
                style={{ height: `${percent}%` }}
              />
              <span className="letter-grid-block__content">
                <span className="letter-grid-block__symbol">
                  {letter.symbol}
                </span>

                {showProgress && (
                  <span className="letter-grid-block__progress-text">
                    {letter.progress.score} / {letter.progress.max_score}
                  </span>
                )}
              </span>
              {isMastered && (
                <span className="letter-grid-block__shine" aria-hidden />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <LetterModalBlock
        letter={selectedLetter}
        allLetters={lettersState}
        onClose={() => setSelectedIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={selectedIndex !== null && selectedIndex > 0}
        hasNext={
          selectedIndex !== null && selectedIndex < lettersState.length - 1
        }
        onProgressUpdated={handleProgressUpdated}
      />
    </>
  );
}
