import { useState } from "react";
import type { TestQuestion } from "../../../../utils/testGenerator";
import ChooseQuestion from "./ChooseQuestion";
import ChooseGrammarQuestion from "./ChooseGrammarQuestion";
import TestResult from "./TestResult";

interface TestProps {
  questions: TestQuestion[];
  onFinish: (correct: number, total: number, passed: boolean) => void;
  onRepeat: () => void;
  onBack: () => void;
  backLabel?: string;
  onNext?: () => void;
  nextLabel?: string;
}

export default function Test({
  questions,
  onFinish,
  onRepeat,
  onBack,
  backLabel,
  onNext,
  nextLabel,
}: TestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = questions.length;

  // Защита: если вопросов нет — сразу показываем «пустой» результат.
  if (total === 0) {
    return (
      <div className="test">
        <div className="test__empty">Вопросы для этого теста не найдены.</div>
        <div className="test__footer">
          <button type="button" className="test__next" onClick={onBack}>
            {backLabel ?? "Назад"}
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
    if (current.correctIndices.includes(index)) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      const percent = (correctCount / total) * 100;
      const passed = percent > 70;
      setFinished(true);
      onFinish(correctCount, total, passed);
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswered(false);
      setSelectedIndex(null);
    }
  };

  const handleRepeatInternal = () => {
    setCurrentIndex(0);
    setAnswered(false);
    setSelectedIndex(null);
    setCorrectCount(0);
    setFinished(false);
    onRepeat();
  };

  if (finished) {
    const percent = Math.round((correctCount / total) * 100);
    const passed = percent > 70;
    return (
      <TestResult
        correct={correctCount}
        total={total}
        percent={percent}
        passed={passed}
        onRepeat={handleRepeatInternal}
        onBack={onBack}
        backLabel={backLabel}
        onNext={onNext}
        nextLabel={nextLabel}
      />
    );
  }

  return (
    <div className="test">
      <div className="test__progress">
        <div
          className="test__progress-bar"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      <div className="test__counter">
        {currentIndex + 1} / {total}
      </div>

      <div className="test__question">
        {current.type === "choose" && (
          <ChooseQuestion
            question={current}
            selectedIndex={selectedIndex}
            answered={answered}
            onSelect={handleSelect}
          />
        )}
        {current.type === "choose-grammar" && (
          <ChooseGrammarQuestion
            question={current}
            selectedIndex={selectedIndex}
            answered={answered}
            onSelect={handleSelect}
          />
        )}
      </div>

      {answered && (
        <div className="test__footer">
          <button type="button" className="test__next" onClick={handleNext}>
            Далее
          </button>
        </div>
      )}
    </div>
  );
}
