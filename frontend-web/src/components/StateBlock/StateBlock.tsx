import { motion } from "framer-motion";
import { spring } from "../../lib/motion";

type StateBlockVariant = "loading" | "error" | "empty";

interface StateBlockProps {
  variant: StateBlockVariant;
  text?: string;
  onRetry?: () => void;
}

const DEFAULT_TEXT: Record<StateBlockVariant, string> = {
  loading: "Загрузка…",
  error: "Что-то пошло не так",
  empty: "Пока пусто",
};

export default function StateBlock({
  variant,
  text,
  onRetry,
}: StateBlockProps) {
  return (
    <div className={`state-block state-block--${variant}`}>
      <p className="state-block__text">{text ?? DEFAULT_TEXT[variant]}</p>
      {variant === "error" && onRetry && (
        <motion.button
          type="button"
          className="btn btn--primary btn--sm state-block__retry"
          onClick={onRetry}
          whileHover={{ y: -1, scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={spring.bouncy}
        >
          Повторить
        </motion.button>
      )}
    </div>
  );
}
