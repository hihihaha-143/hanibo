import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import type { TestQuestionChoose } from "../../../../utils/testGenerator";
import { spring } from "../../../../lib/motion";

interface ChooseQuestionProps {
  question: TestQuestionChoose;
  selectedIndex: number | null;
  answered: boolean;
  onSelect: (index: number) => void;
}

const SPEED_OPTIONS = [
  { rate: 0.5, label: "0.5", title: "Медленно" },
  { rate: 1, label: "1", title: "Обычно" },
];

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
            {SPEED_OPTIONS.map(({ rate, label, title }) => (
              <motion.button
                key={rate}
                type="button"
                className="choose-question__speak-button"
                onClick={() => speak(question.promptAudio!, rate)}
                title={title}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.94 }}
                transition={spring.bouncy}
              >
                <Volume2 size={16} />
                <span>{label}</span>
              </motion.button>
            ))}
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
