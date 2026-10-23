import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import type { CourseItemWord } from "../../../../api/course";
import PhraseBlock from "../PhraseBlock";
import { spring } from "../../../../lib/motion";

interface WordCardProps {
  word: CourseItemWord;
}

const SPEED_OPTIONS = [
  { rate: 0.5, label: "0.5", title: "Медленно" },
  { rate: 1, label: "1", title: "Обычно" },
];

export default function WordCard({ word }: WordCardProps) {
  const phrase = word.phrases[0] ?? null;

  const speak = (text: string, rate: number) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = rate;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      className="word-card"
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={spring.base}
    >
      <div className="word-card__main">
        <span className="word-card__hangul">{word.hangul}</span>
        <span className="word-card__translation">{word.translation}</span>

        <div className="word-card__speak">
          {SPEED_OPTIONS.map(({ rate, label, title }) => (
            <motion.button
              key={rate}
              type="button"
              className="btn btn--ghost word-card__speak-button"
              onClick={() => speak(word.hangul, rate)}
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
      </div>

      {phrase && <PhraseBlock phrase={phrase} />}
    </motion.div>
  );
}
