import { motion } from "framer-motion";
import type { TestQuestionChooseGrammar } from "../../../../utils/testGenerator";
import PhraseBlock from "../PhraseBlock";
import { spring } from "../../../../lib/motion";

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
  return (
    <div className="choose-question choose-question--grammar">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="choose-question__prompt">
        <PhraseBlock phrase={question.promptPhrase} />
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
            <motion.button
              key={index}
              type="button"
              className={`choose-question__variant ${modifier}`}
              onClick={() => onSelect(index)}
              disabled={answered}
              whileHover={answered ? undefined : { y: -1, scale: 1.02 }}
              whileTap={answered ? undefined : { scale: 0.97 }}
              transition={spring.bouncy}
            >
              {variant}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
