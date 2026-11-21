import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { spring } from "../../lib/motion";
import { speakKorean } from "../../lib/speech";

interface SpeakControlsProps {
  text: string;
  className?: string;
}

const SPEEDS = [
  { rate: 0.5, label: "0.5", title: "Прослушать медленно" },
  { rate: 1, label: "1", title: "Прослушать в обычном темпе" },
];

export default function SpeakControls({ text, className }: SpeakControlsProps) {
  return (
    <div className={className ? `speak-controls ${className}` : "speak-controls"}>
      {SPEEDS.map(({ rate, label, title }) => (
        <motion.button
          key={rate}
          type="button"
          className="speak-button"
          onClick={() => speakKorean(text, rate)}
          title={title}
          aria-label={title}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.94 }}
          transition={spring.bouncy}
        >
          <Volume2 size={16} aria-hidden="true" />
          <span>{label}</span>
        </motion.button>
      ))}
    </div>
  );
}
