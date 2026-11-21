import type { TestQuestionCorrectSpelling } from "../../../../utils/testGenerator";
import SpeakControls from "../../../../components/SpeakButton/SpeakControls";

interface CorrectSpellingQuestionProps {
  question: TestQuestionCorrectSpelling;
  selectedIndex: number | null;
  answered: boolean;
  onSelect: (index: number) => void;
}

export default function CorrectSpellingQuestion({
  question,
  selectedIndex,
  answered,
  onSelect,
}: CorrectSpellingQuestionProps) {
  const isCorrect = question.correctIndex === selectedIndex;

  return (
    <div className="choose-question choose-question--correct-spelling">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="choose-question__prompt">
        <span className="choose-question__prompt-text">{question.prompt}</span>
        {question.promptAudio && <SpeakControls text={question.promptAudio} />}
      </div>

      <div className="choose-question__variants">
        {question.variants.map((variant, index) => {
          const variantIsCorrect = index === question.correctIndex;
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
              className={`choose-question__variant choose-question__variant--hangul ${modifier}`}
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
          {isCorrect
            ? "Верно"
            : `Правильно: ${question.variants[question.correctIndex]}`}
        </div>
      )}
    </div>
  );
}
