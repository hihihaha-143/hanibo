import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PhraseToken as PhraseTokenType } from "../../../api/course";
import { spring } from "../../../lib/motion";
import type { PhraseToken } from "../../../api/course";


interface PhraseTokenProps {
  token: PhraseTokenType;
}

export default function PhraseToken({ token }: PhraseTokenProps) {
  const [hovered, setHovered] = useState(false);
  const word = token.word;
  const rule = token.grammar_rule;

  if (!word && !rule) {
    return <span className="phrase-token">{token.text}</span>;
  }

  return (
    <span
      className="phrase-token"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="phrase-token__text">{token.text}</span>

      <AnimatePresence>
        {hovered && (
          <motion.span
            className="phrase-token__tooltip"
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={spring.bouncy}
          >
            {word && (
              <span className="phrase-token__tooltip-line">
                <strong>{word.hangul}</strong> — {word.translation}
              </span>
            )}
            {rule && (
              <span className="phrase-token__tooltip-line">
                <strong>{rule.title}</strong> — {rule.construction}
              </span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
