import { Volume2 } from "lucide-react";
import type { TestQuestionChoose } from "../../../../utils/testGenerator";

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
  const speak = (text: string, rate: number) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = rate;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="choose-question">
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

      <div className="choose-question__variants">
        {question.variants.map((variant, index) => {
          const isCorrect = question.correctIndices.includes(index);
          let modifier = "";
          if (answered) {
            if (isCorrect) modifier = "choose-question__variant--correct";
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
    </div>
  );
}
