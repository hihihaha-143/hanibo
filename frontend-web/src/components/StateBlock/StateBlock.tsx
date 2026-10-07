

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
        <button type="button" className="state-block__retry" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
}
