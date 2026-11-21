import { motion } from "framer-motion";
import type { CourseItemWord } from "../../../../api/course";
import PhraseBlock from "../PhraseBlock";
import SpeakControls from "../../../../components/SpeakButton/SpeakControls";
import { spring } from "../../../../lib/motion";

interface WordCardProps {
  word: CourseItemWord;
}

export default function WordCard({ word }: WordCardProps) {
  const phrase = word.phrases[0] ?? null;

  return (
    <motion.div
      className="card word-card"
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={spring.base}
    >
      <div className="word-card__main">
        <span className="word-card__hangul">{word.hangul}</span>
        <span className="word-card__translation">{word.translation}</span>

        <SpeakControls text={word.hangul} className="word-card__speak" />
      </div>

      {phrase && <PhraseBlock phrase={phrase} />}
    </motion.div>
  );
}
