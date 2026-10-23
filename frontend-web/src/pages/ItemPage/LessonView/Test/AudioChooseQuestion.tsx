import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import type { TestQuestionAudioChoose } from "../../../../utils/testGenerator";
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
  const speak = (rate: number) => {
    const utterance = new SpeechSynthesisUtterance(question.audioText);
    utterance.lang = "ko-KR";
    utterance.rate = rate;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const handleSpeakSlow = () => speak(0.5);
  const handleSpeakNormal = () => speak(1);

  return (
    <div className="choose-question choose-question--audio-choose">
      <div className="choose-question__instruction">{question.instruction}</div>

      <div className="audio-choose__player">
        <motion.button
          type="button"
          className="audio-choose__play-button"
          onClick={handleSpeakNormal}
          title="Прослушать"
          whileHover={{ y: -1, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring.bouncy}
        >
          <Volume2 size={32} />
        </motion.button>

        <div className="audio-choose__speeds">
          <motion.button
            type="button"
            className="btn btn--ghost choose-question__speak-button"
            onClick={handleSpeakSlow}
            title="Медленно"
            whileHover={{ y: -1, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring.bouncy}
          >
            <Volume2 size={16} />
            <span>0.5</span>
          </motion.button>
          <motion.button
            type="button"
            className="btn btn--ghost choose-question__speak-button"
            onClick={handleSpeakNormal}
            title="Обычно"
            whileHover={{ y: -1, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring.bouncy}
          >
            <Volume2 size={16} />
            <span>1</span>
          </motion.button>
        </div>
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
              whileHover={!answered ? { y: -1, scale: 1.01 } : undefined}
              whileTap={!answered ? { scale: 0.98 } : undefined}
              transition={spring.bouncy}
            >
              <span className="choose-question__variant-key">{index + 1}</span>
              <span className="choose-question__variant-text">{variant}</span>
            </motion.button>
          );
        })}
      </div>

      {answered && (
        <motion.div
          className={
            "choose-question__feedback " +
            (question.correctIndices.includes(selectedIndex ?? -1)
              ? "choose-question__feedback--correct"
              : "choose-question__feedback--wrong")
          }
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.base}
        >
          {question.correctIndices.includes(selectedIndex ?? -1)
            ? `Верно: ${question.promptHangul} — ${question.promptTranslation}`
            : `Правильно: ${question.promptHangul} — ${question.promptTranslation}`}
        </motion.div>
      )}
    </div>
  );
}
