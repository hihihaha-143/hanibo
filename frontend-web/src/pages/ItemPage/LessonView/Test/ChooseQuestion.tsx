import type { TestQuestionChoose } from "../../../../utils/testGenerator";
import SpeakControls from "../../../../components/SpeakButton/SpeakControls";

interface ChooseQuestionProps {
  question: TestQuestionChoose;
  selectedIndex: number | null;
  answered: boolean;
  onSelect: (index: number) => void;
}

export default function ChooseQuestion({
  question,
  selectedIndex,
  answered,
  onSelect,
}: ChooseQuestionProps) {
  const isCorrect =
    selectedIndex !== null && question.correctIndices.includes(selectedIndex);
  const correctAnswer = question.correctIndices
    .map((index) => question.variants[index])
    .join(", ");

  return (
    <div className="choose-question">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="choose-question__prompt">
        <span className="choose-question__prompt-text">{question.prompt}</span>
        {question.promptAudio && <SpeakControls text={question.promptAudio} />}
      </div>

      <div className="choose-question__variants">
        {question.variants.map((variant, index) => {
          const variantIsCorrect = question.correctIndices.includes(index);
          let modifier = "";
          if (answered) {
            if (variantIsCorrect) modifier = "choose-question__variant--correct";
            else if (index === selectedIndex)
              modifier = "choose-question__variant--wrong";
          }
          return (
            <button
              key={index}
              type="button"
              className={`choose-question__variant ${modifier}`}
              onClick={() => onSelect(index)}
              disabled={answered}
            >
              <span className="choose-question__variant-key">{index + 1}</span>
              <span className="choose-question__variant-text">{variant}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`choose-question__feedback ${
            isCorrect
              ? "choose-question__feedback--correct"
              : "choose-question__feedback--wrong"
          }`}
          aria-live="polite"
        >
          {isCorrect ? "Верно" : `Правильный ответ: ${correctAnswer}`}
        </div>
      )}
    </div>
  );
}
