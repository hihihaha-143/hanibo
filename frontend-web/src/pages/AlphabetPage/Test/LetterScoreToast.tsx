import { useEffect } from "react";
import { motion } from "framer-motion";
import { Star, X } from "lucide-react";
import { spring } from "../../../lib/motion";
import blueberryImg from "../../../assets/blueberry.png";

export interface LetterScoreItem {
  symbol: string;
  scoreAdded: number;
}

interface LetterScoreToastProps {
  scoreAdded: number;
  blueberriesEarned: number;
  expEarned: number;
  letterSymbol: string;
  letterScores?: LetterScoreItem[];
  onClose: () => void;
}

export default function LetterScoreToast({
  scoreAdded,
  blueberriesEarned,
  expEarned,
  letterSymbol,
  letterScores,
  onClose,
}: LetterScoreToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const hasLetterScores = letterScores && letterScores.length > 0;

  return (
    <motion.div
      className="letter-score-toast"
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      transition={spring.bouncy}
    >
      <div className="letter-score-toast__content">
        <div className="letter-score-toast__rewards">
          {scoreAdded > 0 && (
            <div className="letter-score-toast__reward">
              <Star size={16} className="letter-score-toast__icon --star" />
              <span>+{scoreAdded}</span>
            </div>
          )}
          {blueberriesEarned > 0 && (
            <div className="letter-score-toast__reward">
              <img
                src={blueberryImg}
                alt="Черника"
                className="letter-score-toast__icon --blueberry-img"
              />
              <span>+{blueberriesEarned}</span>
            </div>
          )}
          {expEarned > 0 && (
            <div className="letter-score-toast__reward">
              <span className="letter-score-toast__icon --exp">🔥</span>
              <span>+{expEarned} EXP</span>
            </div>
          )}
        </div>
        {hasLetterScores && (
          <div className="letter-score-toast__letters">
            {letterScores.map((item, idx) => (
              <span
                key={`${item.symbol}-${idx}`}
                className="letter-score-toast__letter"
              >
                <span className="letter-score-toast__letter-symbol">
                  {item.symbol}
                </span>
                <span className="letter-score-toast__letter-score">
                  +{item.scoreAdded}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        className="letter-score-toast__close"
        onClick={onClose}
        aria-label="Закрыть"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
