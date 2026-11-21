import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PhraseToken as PhraseTokenType } from "../../../api/course";
import { spring } from "../../../lib/motion";

interface PhraseTokenProps {
  token: PhraseTokenType;
}

export default function PhraseToken({ token }: PhraseTokenProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const word = token.word;
  const rule = token.grammar_rule;
  const hasInfo = Boolean(word || rule);

  if (!hasInfo) {
    return <span className="phrase-token">{token.text}</span>;
  }

  return (
    <span
      className="phrase-token"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="phrase-token__text"
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        {token.text}
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            id={tooltipId}
            className="tooltip phrase-token__tooltip"
            role="tooltip"
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={spring.bouncy}
          >
            {word && (
              <span className="tooltip__line">
                <strong>{word.hangul}</strong> — {word.translation}
              </span>
            )}
            {rule && (
              <span className="tooltip__line">
                <strong>{rule.title}</strong> — {rule.construction}
              </span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
