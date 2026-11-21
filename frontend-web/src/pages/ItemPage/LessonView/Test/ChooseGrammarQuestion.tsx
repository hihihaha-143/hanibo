import type { TestQuestionChooseGrammar } from "../../../../utils/testGenerator";
import PhraseBlock from "../PhraseBlock";

interface ChooseGrammarQuestionProps {
  question: TestQuestionChooseGrammar;
  selectedIndex: number | null;
  answered: boolean;
  onSelect: (index: number) => void;
}

export default function ChooseGrammarQuestion({
  question,
  selectedIndex,
  answered,
  onSelect,
}: ChooseGrammarQuestionProps) {
  const isCorrect =
    selectedIndex !== null && question.correctIndices.includes(selectedIndex);
  const correctAnswer = question.correctIndices
    .map((index) => question.variants[index])
    .join(", ");

  return (
    <div className="choose-question">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="choose-question__prompt">
        <PhraseBlock phrase={question.promptPhrase} />
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
