import type { TestQuestion } from "../../../utils/testGenerator";
import { setFinalPercent } from "../../../utils/progress";
import Test from "./Test/Test";

interface FinalTestTabProps {
  itemId: number;
  questions: TestQuestion[];
  onRepeat: () => void;
  onBack: () => void;
  onNext?: () => void;
  nextLabel?: string;
}

export default function FinalTestTab({
  itemId,
  questions,
  onRepeat,
  onBack,
  onNext,
  nextLabel,
}: FinalTestTabProps) {
  const handleFinish = (correct: number, total: number, _isPassed: boolean) => {
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    setFinalPercent(itemId, percent);
  };

  return (
    <div className="final-test-tab">
      <Test
        questions={questions}
        onFinish={handleFinish}
        onRepeat={onRepeat}
        onBack={onBack}
        backLabel="В курс"
        onNext={onNext}
        nextLabel={nextLabel}
      />
    </div>
  );
}
