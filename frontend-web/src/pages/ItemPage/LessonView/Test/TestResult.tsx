import { ArrowRight } from "lucide-react";

interface TestResultProps {
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  onRepeat: () => void;
  onBack: () => void;
  backLabel?: string;
  onNext?: () => void;
  nextLabel?: string;
}

export default function TestResult({
  correct,
  total,
  percent,
  passed,
  onRepeat,
  onBack,
  backLabel,
  onNext,
  nextLabel,
}: TestResultProps) {
  return (
    <div className="test-result">
      <div className="test-result__score">
        {correct} / {total}
      </div>
      <div className="test-result__percent">{percent}%</div>
      <div
        className={`test-result__status ${
          passed ? "test-result__status--passed" : "test-result__status--failed"
        }`}
      >
        {passed ? "Пройдено" : "Не пройдено"}
      </div>

      <div className="test-result__actions">
        <button
          type="button"
          className="test-result__button test-result__button--secondary"
          onClick={onRepeat}
        >
          Пройти снова
        </button>

        {!passed && (
          <button
            type="button"
            className="test-result__button test-result__button--secondary"
            onClick={onBack}
          >
            {backLabel ?? "Назад"}
          </button>
        )}

        {passed && onNext && (
          <button
            type="button"
            className="test-result__button test-result__button--primary"
            onClick={onNext}
          >
            <span>{nextLabel ?? "Далее"}</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
