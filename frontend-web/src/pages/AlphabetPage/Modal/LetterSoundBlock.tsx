import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { spring } from "../../../lib/motion";

interface LetterSoundBlockProps {
  ipa: string | null;
  note: string | null;
  sampleSyllable: string | null;
  sampleRomanization: string | null;
  onSpeak: (text: string, rate?: number) => void;
}

export default function LetterSoundBlock({
  ipa,
  note,
  sampleSyllable,
  sampleRomanization,
  onSpeak,
}: LetterSoundBlockProps) {
  if (!ipa && !note && !sampleSyllable) return null;

  return (
    <div className="letter-sound-block">
      <div className="letter-sound-block__header">
        <span className="letter-sound-block__title">Звук</span>
        {ipa && <span className="letter-sound-block__ipa">[{ipa}]</span>}
      </div>

      {note && <p className="letter-sound-block__note">{note}</p>}

      {sampleSyllable && (
        <div className="letter-sound-block__sample-row">
          <span className="letter-sound-block__sample-syllable">
            {sampleSyllable}
          </span>
          {sampleRomanization && (
            <span className="letter-sound-block__sample-romanization">
              {sampleRomanization}
            </span>
          )}

          <div className="letter-sound-block__speak">
            <motion.button
              type="button"
              className="btn btn--ghost letter-sound-block__speak-button"
              onClick={() => onSpeak(sampleSyllable, 0.5)}
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
              className="btn btn--ghost letter-sound-block__speak-button"
              onClick={() => onSpeak(sampleSyllable, 1)}
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
      )}
    </div>
  );
}
