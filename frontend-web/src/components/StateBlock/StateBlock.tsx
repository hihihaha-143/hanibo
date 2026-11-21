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
    <div
      className={`state-block state-block--${variant}`}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      aria-busy={variant === "loading"}
    >
      {variant === "loading" && (
        <span className="state-block__spinner" aria-hidden="true" />
      )}
      <p className="state-block__text">{text ?? DEFAULT_TEXT[variant]}</p>
      {variant === "error" && onRetry && (
        <motion.button
          type="button"
          className="btn btn--primary btn--sm state-block__retry"
          onClick={onRetry}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.bouncy}
        >
          Повторить
        </motion.button>
      )}
    </div>
  );
}
