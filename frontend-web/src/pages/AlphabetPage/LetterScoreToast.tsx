// frontend-web/src/pages/AlphabetPage/LetterScoreToast.tsx

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { spring } from "../../lib/motion";

interface LetterScoreToastProps {
  scoreAdded: number;
  letterSymbol: string;
  onClose: () => void;
}

const VISIBLE_MS = 2200;

export default function LetterScoreToast({
  scoreAdded,
  letterSymbol,
  onClose,
}: LetterScoreToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return createPortal(
    <motion.div
      className="letter-score-toast"
      initial={{ opacity: 0, x: 60, scale: 0.7 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={spring.jelly}
      onClick={onClose}
    >
      <span className="letter-score-toast__plus">+{scoreAdded}</span>
      <span className="letter-score-toast__text">к букве {letterSymbol}</span>
    </motion.div>,
    document.body,
  );
}
