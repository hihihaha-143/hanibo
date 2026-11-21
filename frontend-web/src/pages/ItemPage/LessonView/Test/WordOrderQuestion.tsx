import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TestQuestionWordOrder } from "../../../../utils/testGenerator";
import { shuffle } from "../../../../utils/test/shared";
import { spring } from "../../../../lib/motion";

interface WordOrderQuestionProps {
  question: TestQuestionWordOrder;
  answered: boolean;
  isCorrect: boolean | null;
  onSubmit: (correct: boolean) => void;
}

export default function WordOrderQuestion({
  question,
  answered,
  isCorrect,
  onSubmit,
}: WordOrderQuestionProps) {
  const [available, setAvailable] = useState<string[]>(() =>
    shuffle(question.tokens),
  );
  const [picked, setPicked] = useState<string[]>([]);
  const [dragFromPicked, setDragFromPicked] = useState<number | null>(null);
  const [dragFromAvailable, setDragFromAvailable] = useState<number | null>(
    null,
  );
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const canCheck = picked.length === question.tokens.length && !answered;

  const handleAvailableClick = (index: number) => {
    if (answered) return;
    const token = available[index];
    setAvailable((a) => a.filter((_, i) => i !== index));
    setPicked((p) => [...p, token]);
  };

  const handlePickedClick = (index: number) => {
    if (answered) return;
    const token = picked[index];
    setPicked((p) => p.filter((_, i) => i !== index));
    setAvailable((a) => [...a, token]);
  };

  const handleAvailableDragStart = (index: number) => {
    if (answered) return;
    setDragFromAvailable(index);
  };

  const handlePickedDragStart = (index: number) => {
    if (answered) return;
    setDragFromPicked(index);
  };

  const handleDropOnPicked = (targetIndex: number) => {
    if (answered) return;

    if (dragFromAvailable !== null) {
      const token = available[dragFromAvailable];
      setAvailable((a) => a.filter((_, i) => i !== dragFromAvailable));
      setPicked((p) => {
        const copy = [...p];
        copy.splice(targetIndex, 0, token);
        return copy;
      });
      setDragFromAvailable(null);
      setDropIndex(null);
      return;
    }

    if (dragFromPicked !== null) {
      if (dragFromPicked === targetIndex) {
        setDragFromPicked(null);
        setDropIndex(null);
        return;
      }
      setPicked((p) => {
        const copy = [...p];
        const [token] = copy.splice(dragFromPicked, 1);
        const insertAt =
          dragFromPicked < targetIndex ? targetIndex - 1 : targetIndex;
        copy.splice(insertAt, 0, token);
        return copy;
      });
      setDragFromPicked(null);
      setDropIndex(null);
    }
  };

  const handleDropOnAvailable = () => {
    if (answered) return;

    if (dragFromPicked !== null) {
      const token = picked[dragFromPicked];
      setPicked((p) => p.filter((_, i) => i !== dragFromPicked));
      setAvailable((a) => [...a, token]);
      setDragFromPicked(null);
      setDropIndex(null);
    }
  };

  const handleCheck = () => {
    if (!canCheck) return;
    onSubmit(arraysEqual(picked, question.correctOrder));
  };

  const renderAvailable = () =>
    available.map((token, index) => (
      <motion.button
        key={`av-${index}-${token}`}
        type="button"
        className="word-order__token"
        draggable={!answered}
        onDragStart={() => handleAvailableDragStart(index)}
        onDragEnd={() => setDragFromAvailable(null)}
        onClick={() => handleAvailableClick(index)}
        disabled={answered}
        whileHover={!answered ? { y: -2 } : undefined}
        whileTap={!answered ? { scale: 0.98 } : undefined}
        transition={spring.bouncy}
      >
        {token}
      </motion.button>
    ));

  const renderPicked = () => {
    if (picked.length === 0) {
      return (
        <div
          className="word-order__placeholder"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDropOnPicked(0)}
        >
          Перетащите сюда слова
        </div>
      );
    }

    return (
      <>
        {picked.map((token, index) => {
          let modifier = "";
          if (answered) {
            const ok = question.correctOrder[index] === token;
            modifier = ok
              ? "word-order__token--correct"
              : "word-order__token--wrong";
          }
          if (dropIndex === index && !answered) {
            modifier += " word-order__token--drop";
          }

          return (
            <motion.button
              key={`pk-${index}-${token}`}
              type="button"
              className={`word-order__token ${modifier}`}
              draggable={!answered}
              onDragStart={() => handlePickedDragStart(index)}
              onDragEnd={() => {
                setDragFromPicked(null);
                setDropIndex(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (dropIndex !== index) setDropIndex(index);
              }}
              onDrop={() => handleDropOnPicked(index)}
              onClick={() => handlePickedClick(index)}
              disabled={answered}
              whileHover={!answered ? { y: -2 } : undefined}
              whileTap={!answered ? { scale: 0.98 } : undefined}
              transition={spring.bouncy}
            >
              {token}
            </motion.button>
          );
        })}
        <div
          className="word-order__tail"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDropOnPicked(picked.length)}
        />
      </>
    );
  };

  return (
    <div className="choose-question choose-question--word-order">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="word-order__hint">{question.phraseTranslation}</div>

      <div
        className="word-order__available"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropOnAvailable}
      >
        <AnimatePresence>{renderAvailable()}</AnimatePresence>
      </div>

      <div className="word-order__picked">{renderPicked()}</div>

      {answered && (
        <motion.div
          className={`choose-question__feedback ${
            isCorrect
              ? "choose-question__feedback--correct"
              : "choose-question__feedback--wrong"
          }`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.base}
          aria-live="polite"
        >
          {isCorrect
            ? "Верно"
            : `Правильный порядок: ${question.correctOrder.join(" ")}`}
        </motion.div>
      )}

      {!answered && (
        <div className="actions word-order__footer">
          <motion.button
            type="button"
            className="btn btn--primary"
            disabled={!canCheck}
            onClick={handleCheck}
            whileHover={canCheck ? { y: -1 } : undefined}
            whileTap={canCheck ? { scale: 0.98 } : undefined}
            transition={spring.bouncy}
          >
            Проверить
          </motion.button>
        </div>
      )}
    </div>
  );
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
