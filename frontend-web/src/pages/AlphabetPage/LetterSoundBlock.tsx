import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { spring } from "../../lib/motion";

interface LetterSoundBlockProps {
  ipa: string | null;
  note: string | null;
  sampleSyllable: string | null;
  sampleRomanization: string | null;
  onSpeak: (text: string, rate: number) => void;
}

export default function LetterSoundBlock({
  ipa,
  note,
  sampleSyllable,
  sampleRomanization,
  onSpeak,
}: LetterSoundBlockProps) {
  if (!ipa && !note) return null;

  return (
    <div className="letter-sound-block">
      <div className="letter-sound-block__header">
        <span className="letter-sound-block__label">Произношение</span>
        {sampleSyllable && (
          <div className="letter-sound-block__speak">
            <motion.button
              type="button"
              className="letter-sound-block__speak-button"
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
              className="letter-sound-block__speak-button"
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
        )}
      </div>

      {(ipa || sampleSyllable) && (
        <div className="letter-sound-block__sound">
          {ipa && <span className="letter-sound-block__ipa">[{ipa}]</span>}
          {sampleSyllable && (
            <span className="letter-sound-block__sample">
              {sampleSyllable}
              {sampleRomanization && (
                <span className="letter-sound-block__roman">
                  {" "}
                  {sampleRomanization}
                </span>
              )}
            </span>
          )}
        </div>
      )}

      {note && <p className="letter-sound-block__note">{note}</p>}
    </div>
  );
}
