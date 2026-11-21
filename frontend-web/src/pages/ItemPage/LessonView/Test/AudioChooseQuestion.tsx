import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import type { TestQuestionAudioChoose } from "../../../../utils/testGenerator";
import SpeakControls from "../../../../components/SpeakButton/SpeakControls";
import { speakKorean } from "../../../../lib/speech";
import { spring } from "../../../../lib/motion";

interface AudioChooseQuestionProps {
  question: TestQuestionAudioChoose;
  selectedIndex: number | null;
  answered: boolean;
  onSelect: (index: number) => void;
}

export default function AudioChooseQuestion({
  question,
  selectedIndex,
  answered,
  onSelect,
}: AudioChooseQuestionProps) {
  const isCorrect =
    selectedIndex !== null && question.correctIndices.includes(selectedIndex);

  return (
    <div className="choose-question choose-question--audio-choose">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="audio-choose__player">
        <motion.button
          type="button"
          className="audio-choose__play-button"
          onClick={() => speakKorean(question.audioText, 1)}
          title="Прослушать"
          aria-label="Прослушать"
          whileHover={{ y: -1, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={spring.bouncy}
        >
          <Volume2 size={32} aria-hidden="true" />
        </motion.button>

        <SpeakControls
          text={question.audioText}
          className="audio-choose__speeds"
        />
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
          {isCorrect ? "Верно" : "Неверно"}: {question.promptHangul} —{" "}
          {question.promptTranslation}
        </div>
      )}
    </div>
  );
}
