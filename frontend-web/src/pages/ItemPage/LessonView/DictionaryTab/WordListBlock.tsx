import { motion } from "framer-motion";
import type { CourseItemWord } from "../../../../api/course";
import WordCard from "./WordCard";

interface WordListBlockProps {
  words: CourseItemWord[];
}

export default function WordListBlock({ words }: WordListBlockProps) {
  return (
    <motion.div
      className="word-list-block"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04 } },
      }}
    >
      {words.map((word) => (
        <WordCard key={word.id} word={word} />
      ))}
    </motion.div>
  );
}
