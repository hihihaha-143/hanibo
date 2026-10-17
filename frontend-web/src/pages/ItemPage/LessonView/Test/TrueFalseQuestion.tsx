import { Volume2 } from "lucide-react";
import type { TestQuestionTrueFalse } from "../../../../utils/testGenerator";

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
  const speak = (text: string, rate: number) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = rate;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const options: { value: boolean; label: string; key: number }[] = [
    { value: true, label: "Верно", key: 1 },
    { value: false, label: "Неверно", key: 2 },
  ];

  return (
    <div className="choose-question choose-question--true-false">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="choose-question__prompt">
        <span className="choose-question__prompt-text">{question.prompt}</span>
        {question.promptAudio && (
          <div className="choose-question__speak">
            <button
              type="button"
              className="choose-question__speak-button"
              onClick={() => speak(question.promptAudio!, 0.5)}
              title="Медленно"
            >
              <Volume2 size={16} />
              <span>0.5</span>
            </button>
            <button
              type="button"
              className="choose-question__speak-button"
              onClick={() => speak(question.promptAudio!, 1)}
              title="Обычно"
            >
              <Volume2 size={16} />
              <span>1</span>
            </button>
          </div>
        )}
      </div>

      <div className="choose-question__variants choose-question__variants--tf">
        {options.map(({ value, label, key }) => {
          const isCorrect = value === question.correct;
          let modifier = "";
          if (answered) {
            if (isCorrect) modifier = "choose-question__variant--correct";
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
    </div>
  );
}
