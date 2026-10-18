import { useState } from "react";
import { motion } from "framer-motion";
import { spring } from "../../lib/motion";
import type { AlphabetLetter } from "../../api/alphabet";
import LetterModalBlock from "./LetterModalBlock";

interface LetterGridBlockProps {
  letters: AlphabetLetter[];
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

export default function LetterGridBlock({ letters }: LetterGridBlockProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedLetter =
    selectedIndex !== null ? (letters[selectedIndex] ?? null) : null;

  const handlePrev = () => {
    setSelectedIndex((idx) => (idx !== null && idx > 0 ? idx - 1 : idx));
  };

  const handleNext = () => {
    setSelectedIndex((idx) =>
      idx !== null && idx < letters.length - 1 ? idx + 1 : idx,
    );
  };

  return (
    <>
      <motion.div
        className="letter-grid-block"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {letters.map((letter, index) => (
          <motion.button
            key={letter.id}
            type="button"
            className="letter-grid-block__card"
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring.base}
            onClick={() => setSelectedIndex(index)}
          >
            <span className="letter-grid-block__symbol">{letter.symbol}</span>
            <span className="letter-grid-block__romanization">
              {letter.romanization}
            </span>
          </motion.button>
        ))}
      </motion.div>

      <LetterModalBlock
        letter={selectedLetter}
        onClose={() => setSelectedIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={selectedIndex !== null && selectedIndex > 0}
        hasNext={selectedIndex !== null && selectedIndex < letters.length - 1}
      />
    </>
  );
}
