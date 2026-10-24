import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { spring } from "../../../lib/motion";
import type {
  AlphabetCategory,
  AlphabetLetter,
  GroupLetterInput,
} from "../../../api/alphabet";
import { submitAlphabetGroupProgress } from "../../../api/alphabet";
import { generateLetterGroupTest } from "../../../utils/letterGroupTestGenerator";
import { generateAssimilationTest } from "../../../utils/assimilationTestGenerator";
import { generateMixedAlphabetTest } from "../../../utils/mixedAlphabetTestGenerator";
import type { TestQuestion } from "../../../utils/test";
import Test from "../../ItemPage/LessonView/Test/Test";
import TestResult from "../../ItemPage/LessonView/Test/TestResult";
import LetterScoreToast, { type LetterScoreItem } from "./LetterScoreToast";
import { useAuth } from "../../../context/useAuth";
import { fireConfetti } from "../../../lib/confetti";

interface LetterGroupTestBlockProps {
  letters: AlphabetLetter[];
  category: AlphabetCategory;
  onBack: () => void;
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
  letterSymbol: string;
  letterScores: LetterScoreItem[];
}

const CATEGORY_TITLE: Record<AlphabetCategory, string> = {
  vowel: "гласные",
  consonant: "согласные",
  diphthong: "дифтонги",
  assimilation: "ассимиляция",
  all: "всё",
};

export default function LetterGroupTestBlock({
  letters,
  category,
  onBack,
}: LetterGroupTestBlockProps) {
  const { refreshUser } = useAuth();
  const [round, setRound] = useState(0);
  const [finished, setFinished] = useState<FinishResult | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const perLetterRef = useRef<Map<number, { correct: number; total: number }>>(
    new Map(),
  );

  const questions = useMemo(() => {
    if (category === "all") return generateMixedAlphabetTest(letters);
    if (category === "assimilation") return generateAssimilationTest(letters);
    return generateLetterGroupTest(letters, category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letters, category, round]);

  const resetPerLetter = () => {
    perLetterRef.current = new Map();
  };

  const handleAnswer = (question: TestQuestion, isCorrect: boolean) => {
    const letterId = question.letterId;
    if (!letterId) return;
    if (question.type === "flashcard") return;

    const current = perLetterRef.current.get(letterId) ?? {
      correct: 0,
      total: 0,
    };
    current.total += 1;
    if (isCorrect) current.correct += 1;
    perLetterRef.current.set(letterId, current);
  };

  const handleFinish = async (
    correct: number,
    total: number,
    passed: boolean,
  ) => {
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    setFinished({ correct, total, percent, passed });

    const lettersPayload: GroupLetterInput[] = [];
    perLetterRef.current.forEach((value, letterId) => {
      if (value.total > 0) {
        lettersPayload.push({
          letter_id: letterId,
          correct: value.correct,
          total: value.total,
        });
      }
    });

    if (lettersPayload.length === 0) return;

    try {
      const result = await submitAlphabetGroupProgress(
        category,
        lettersPayload,
      );

      await refreshUser();

      if (result.any_reached_max) {
        fireConfetti();
      }

      if (
        result.exp_earned > 0 ||
        result.blueberries_earned > 0 ||
        result.letters.some((l) => l.score_added > 0)
      ) {
        const symbolById = new Map(letters.map((l) => [l.id, l.symbol]));

        const letterScores: LetterScoreItem[] = result.letters
          .filter((l) => l.score_added > 0)
          .map((l) => ({
            symbol: symbolById.get(l.letter_id) ?? `#${l.letter_id}`,
            scoreAdded: l.score_added,
          }));

        setToast({
          scoreAdded: 0,
          blueberriesEarned: result.blueberries_earned,
          expEarned: result.exp_earned,
          letterSymbol: `— ${CATEGORY_TITLE[category]}`,
          letterScores,
        });
      }
    } catch {
      // гость или ошибка сети
    }
  };

  const handleRepeat = () => {
    setFinished(null);
    setToast(null);
    resetPerLetter();
    setRound((r) => r + 1);
  };

  return (
    <div className="letter-group-test-block">
      <div className="letter-group-test-block__head">
        <motion.button
          type="button"
          className="letter-group-test-block__back"
          onClick={onBack}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.bouncy}
        >
          ← К алфавиту
        </motion.button>
        <span className="letter-group-test-block__title">
          Тест: {CATEGORY_TITLE[category]}
        </span>
      </div>

      <div className="letter-group-test-block__body">
        {finished ? (
          <TestResult
            correct={finished.correct}
            total={finished.total}
            percent={finished.percent}
            passed={finished.passed}
            onRepeat={handleRepeat}
            onBack={onBack}
            backLabel="К алфавиту"
          />
        ) : (
          <Test
            key={round}
            questions={questions}
            onFinish={handleFinish}
            onRepeat={handleRepeat}
            onBack={onBack}
            backLabel="К алфавиту"
            onAnswer={handleAnswer}
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
            letterSymbol={toast.letterSymbol}
            letterScores={toast.letterScores}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
