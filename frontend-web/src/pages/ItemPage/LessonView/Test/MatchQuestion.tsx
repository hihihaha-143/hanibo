// frontend-web/src/pages/ItemPage/LessonView/Test/MatchQuestion.tsx

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { TestQuestionMatch } from "../../../../utils/testGenerator";
import { shuffle } from "../../../../utils/test/shared";
import { spring } from "../../../../lib/motion";

interface MatchQuestionProps {
  question: TestQuestionMatch;
  answered: boolean;
  onSubmit: (correct: boolean) => void;
}

// 4 цвета для пар — не пересекаются с --color-success / --color-error
const PAIR_COLORS = ["#7aa2f7", "#bb9af7", "#7dcfff", "#f7768e"];

export default function MatchQuestion({
  question,
  answered,
  onSubmit,
}: MatchQuestionProps) {
  const leftItems = useMemo(
    () => shuffle(question.pairs.map((p) => p.left)),
    [question.id],
  );
  const rightItems = useMemo(
    () => shuffle(question.pairs.map((p) => p.right)),
    [question.id],
  );

  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [draggingLeft, setDraggingLeft] = useState<string | null>(null);

  const correctMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of question.pairs) map[p.left] = p.right;
    return map;
  }, [question.id]);

  // Порядковый номер пары для цвета
  const pairIndexByLeft: Record<string, number> = {};
  Object.keys(pairs).forEach((left, i) => {
    pairIndexByLeft[left] = i;
  });

  const getLeftForRight = (right: string): string | undefined =>
    Object.keys(pairs).find((l) => pairs[l] === right);

  const handleLeftClick = (left: string) => {
    if (answered) return;

    if (pairs[left]) {
      const copy = { ...pairs };
      delete copy[left];
      setPairs(copy);
      return;
    }

    if (selectedRight) {
      attach(left, selectedRight);
      setSelectedRight(null);
      return;
    }

    setSelectedLeft(left === selectedLeft ? null : left);
  };

  const handleRightClick = (right: string) => {
    if (answered) return;

    const existingLeft = getLeftForRight(right);
    if (existingLeft) {
      const copy = { ...pairs };
      delete copy[existingLeft];
      setPairs(copy);
      return;
    }

    if (selectedLeft) {
      attach(selectedLeft, right);
      setSelectedLeft(null);
      return;
    }

    setSelectedRight(right === selectedRight ? null : right);
  };

  const attach = (left: string, right: string) => {
    const copy = { ...pairs };
    delete copy[left];
    for (const l of Object.keys(copy)) {
      if (copy[l] === right) delete copy[l];
    }
    copy[left] = right;
    setPairs(copy);
  };

  const handleDragStartLeft = (left: string) => {
    if (answered) return;
    setDraggingLeft(left);
  };

  const handleDropOnRight = (right: string) => {
    if (answered) return;
    if (!draggingLeft) return;
    attach(draggingLeft, right);
    setDraggingLeft(null);
    setSelectedLeft(null);
  };

  const allPaired = Object.keys(pairs).length === question.pairs.length;
  const canCheck = allPaired && !answered;

  const handleCheck = () => {
    if (!canCheck) return;
    const allCorrect = Object.keys(pairs).every(
      (left) => correctMap[left] === pairs[left],
    );
    onSubmit(allCorrect);
  };

  const renderLeft = (left: string) => {
    const pairIdx = pairIndexByLeft[left];
    const isPaired = pairIdx !== undefined;
    const color = isPaired ? PAIR_COLORS[pairIdx % PAIR_COLORS.length] : null;
    const isSelected = selectedLeft === left;

    let modifier = "";
    if (answered) {
      const correct = correctMap[left] === pairs[left];
      modifier = correct ? "match__item--correct" : "match__item--wrong";
    } else if (isSelected) {
      modifier = "match__item--selected";
    }

    return (
      <motion.div
        key={left}
        className={`match__item ${modifier}`}
        style={
          color && !answered
            ? {
                borderColor: color,
                color,
                background: `${color}22`,
              }
            : undefined
        }
        draggable={!answered}
        onDragStart={() => handleDragStartLeft(left)}
        onClick={() => handleLeftClick(left)}
        whileHover={!answered ? { scale: 1.02 } : undefined}
        whileTap={!answered ? { scale: 0.98 } : undefined}
        transition={spring.bouncy}
      >
        {left}
      </motion.div>
    );
  };

  const renderRight = (right: string) => {
    const left = getLeftForRight(right);
    const isPaired = left !== undefined;
    const pairIdx = isPaired ? pairIndexByLeft[left] : undefined;
    const color =
      pairIdx !== undefined ? PAIR_COLORS[pairIdx % PAIR_COLORS.length] : null;
    const isSelected = selectedRight === right;

    let modifier = "";
    if (answered) {
      const correct = left !== undefined && correctMap[left] === right;
      modifier = correct ? "match__item--correct" : "match__item--wrong";
    } else if (isSelected) {
      modifier = "match__item--selected";
    }

    return (
      <motion.div
        key={right}
        className={`match__item ${modifier}`}
        style={
          color && !answered
            ? {
                borderColor: color,
                color,
                background: `${color}22`,
              }
            : undefined
        }
        onClick={() => handleRightClick(right)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDropOnRight(right)}
        whileHover={!answered ? { scale: 1.02 } : undefined}
        whileTap={!answered ? { scale: 0.98 } : undefined}
        transition={spring.bouncy}
      >
        {right}
      </motion.div>
    );
  };

  return (
    <div className="choose-question choose-question--match">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="match">
        <div className="match__col">{leftItems.map(renderLeft)}</div>
        <div className="match__col">{rightItems.map(renderRight)}</div>
      </div>

      {!answered && (
        <div className="match__footer">
          <motion.button
            type="button"
            className="match__check"
            disabled={!canCheck}
            onClick={handleCheck}
            whileHover={canCheck ? { y: -1, scale: 1.02 } : undefined}
            whileTap={canCheck ? { scale: 0.97 } : undefined}
            transition={spring.bouncy}
          >
            Проверить
          </motion.button>
        </div>
      )}
    </div>
  );
}
