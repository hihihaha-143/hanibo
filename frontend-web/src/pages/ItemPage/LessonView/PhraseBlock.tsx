import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Phrase } from "../../../api/course";
import PhraseToken from "./PhraseToken";
import { spring } from "../../../lib/motion";

interface PhraseBlockProps {
  phrase: Phrase;
}

const SPEED_OPTIONS = [
  { rate: 0.5, label: "0.5", title: "Медленно" },
  { rate: 1, label: "1", title: "Обычно" },
];

export default function PhraseBlock({ phrase }: PhraseBlockProps) {
  const speak = (text: string, rate: number) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = rate;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const renderTokens = () => {
    if (phrase.tokens.length === 0) {
      return <span className="phrase-block__plain">{phrase.hangul}</span>;
    }

    return phrase.tokens.map((token, index) => (
      <span key={index}>
        <PhraseToken token={token} />
        {token.space_after && "\u00A0\u00A0"}
      </span>
    ));
  };

  return (
    <div className="phrase-block">
      <div className="phrase-block__hangul">
        <span className="phrase-block__tokens">{renderTokens()}</span>
        <div className="phrase-block__speak">
          {SPEED_OPTIONS.map(({ rate, label, title }) => (
            <motion.button
              key={rate}
              type="button"
              className="phrase-block__speak-button"
              onClick={() => speak(phrase.hangul, rate)}
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

      <div className="phrase-block__translation">{phrase.translation}</div>
    </div>
  );
}
