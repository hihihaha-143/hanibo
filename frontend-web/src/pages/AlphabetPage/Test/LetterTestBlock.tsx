import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { spring } from "../../../lib/motion";
import type { AlphabetLetter, AlphabetProgress } from "../../../api/alphabet";
import { submitAlphabetProgress } from "../../../api/alphabet";
import { generateLetterTest } from "../../../utils/letterTestGenerator";
import Test from "../../ItemPage/LessonView/Test/Test";
import LetterTestResult from "./LetterTestResult";
import LetterScoreToast from "./LetterScoreToast";
import { useAuth } from "../../../context/useAuth";
import { fireConfetti } from "../../../lib/confetti";

interface LetterTestBlockProps {
  letter: AlphabetLetter;
  allLetters: AlphabetLetter[];
  onBack: () => void;
  onClose: () => void;
  onProgressUpdated?: (letterId: number, progress: AlphabetProgress) => void;
}

interface FinishResult {
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
}

interface ToastState {
  scoreAdded: number;
  blueberriesEarned: number;
  expEarned: number;
}

export default function LetterTestBlock({
  letter,
  allLetters,
  onBack,
  onClose,
  onProgressUpdated,
}: LetterTestBlockProps) {
  const { refreshUser } = useAuth();
  const [round, setRound] = useState(0);
  const [finished, setFinished] = useState<FinishResult | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const questions = useMemo(
    () => generateLetterTest(letter, allLetters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [letter.id, allLetters, round],
  );

  const handleFinish = async (
    correct: number,
    total: number,
    passed: boolean,
  ) => {
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    setFinished({ correct, total, percent, passed });

    try {
      const result = await submitAlphabetProgress(letter.id, correct, total);

      // Обновляем данные юзера (черника, опыт)
      await refreshUser();

      onProgressUpdated?.(letter.id, {
        score: result.score,
        attempts: result.attempts,
        mistakes: result.mistakes,
        max_score: result.max_score,
      });

      if (result.reached_max) {
        fireConfetti();
      }

      if (
        result.score_added > 0 ||
        result.blueberries_earned > 0 ||
        result.exp_earned > 0
      ) {
        setToast({
          scoreAdded: result.score_added,
          blueberriesEarned: result.blueberries_earned,
          expEarned: result.exp_earned,
        });
      }
    } catch {
      // гость или ошибка сети
    }
  };

  const handleRepeat = () => {
    setFinished(null);
    setToast(null);
    setRound((r) => r + 1);
  };

  return (
    <div className="letter-test-block">
      <div className="letter-test-block__head">
        <motion.button
          type="button"
          className="letter-test-block__back"
          onClick={onBack}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.bouncy}
        >
          ← К букве
        </motion.button>
        <span className="letter-test-block__title">
          Тест по букве {letter.symbol}
        </span>
      </div>

      <div className="letter-test-block__body">
        {finished ? (
          <LetterTestResult
            correct={finished.correct}
            total={finished.total}
            percent={finished.percent}
            passed={finished.passed}
            onRepeat={handleRepeat}
            onBack={onBack}
            onClose={onClose}
          />
        ) : (
          <Test
            key={round}
            questions={questions}
            onFinish={handleFinish}
            onRepeat={handleRepeat}
            onBack={onBack}
            backLabel="К букве"
          />
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <LetterScoreToast
            key="score-toast"
            scoreAdded={toast.scoreAdded}
            blueberriesEarned={toast.blueberriesEarned}
            expEarned={toast.expEarned}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
