import { useId, useState } from "react";
import type { ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFieldProps {
  id: string;
  label: string;
  type: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  error?: string;
  passwordToggle?: boolean;
}

export default function AuthField({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  error,
  passwordToggle = false,
}: AuthFieldProps) {
  const [visible, setVisible] = useState(false);
  const errorId = useId();
  const inputType = passwordToggle && visible ? "text" : type;
  const hasError = Boolean(error);

  const input = (
    <input
      id={id}
      className="input"
      type={inputType}
      autoComplete={autoComplete}
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(event.target.value)
      }
      required
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
    />
  );

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>

      {passwordToggle ? (
        <div className="input-wrap">
          {input}
          <button
            type="button"
            className="password-toggle"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
            title={visible ? "Скрыть пароль" : "Показать пароль"}
          >
            {visible ? (
              <EyeOff size={20} aria-hidden="true" />
            ) : (
              <Eye size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      ) : (
        input
      )}

      {error && (
        <span className="field__error" id={errorId}>
          {error}
        </span>
      )}
    </div>
  );
}
