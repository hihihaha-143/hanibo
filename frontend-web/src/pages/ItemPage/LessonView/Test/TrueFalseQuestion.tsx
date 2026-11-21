import type { TestQuestionTrueFalse } from "../../../../utils/testGenerator";
import SpeakControls from "../../../../components/SpeakButton/SpeakControls";

interface TrueFalseQuestionProps {
  question: TestQuestionTrueFalse;
  selectedValue: boolean | null;
  answered: boolean;
  onSelect: (value: boolean) => void;
}

export default function TrueFalseQuestion({
  question,
  selectedValue,
  answered,
  onSelect,
}: TrueFalseQuestionProps) {
  const options: { value: boolean; label: string; key: number }[] = [
    { value: true, label: "Верно", key: 1 },
    { value: false, label: "Неверно", key: 2 },
  ];

  const isCorrect = selectedValue === question.correct;

  return (
    <div className="choose-question choose-question--true-false">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="choose-question__prompt">
        <span className="choose-question__prompt-text">{question.prompt}</span>
        {question.promptAudio && <SpeakControls text={question.promptAudio} />}
      </div>

      <div className="choose-question__variants choose-question__variants--tf">
        {options.map(({ value, label, key }) => {
          const optionIsCorrect = value === question.correct;
          let modifier = "";
          if (answered) {
            if (optionIsCorrect) modifier = "choose-question__variant--correct";
            else if (value === selectedValue)
              modifier = "choose-question__variant--wrong";
          }
          return (
            <button
              key={String(value)}
              type="button"
              className={`choose-question__variant ${modifier}`}
              onClick={() => onSelect(value)}
              disabled={answered}
            >
              <span className="choose-question__variant-key">{key}</span>
              <span className="choose-question__variant-text">{label}</span>
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
          {isCorrect ? "Верно" : "Неверно"}
        </div>
      )}
    </div>
  );
}
