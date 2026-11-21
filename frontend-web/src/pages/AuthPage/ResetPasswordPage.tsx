import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { resetPassword } from "../../api/auth";
import AuthPage from "./AuthPage";
import AuthField from "./AuthField";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== confirmation) {
      setError("Пароли не совпадают.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email,
        token,
        password,
        password_confirmation: confirmation,
      });
      setDone(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Не удалось обновить пароль. Ссылка могла истечь.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <AuthPage
        title="Сброс пароля"
        generalError="Ссылка неполная. Запросите новую."
        switchText=""
        switchLinkTo="/login"
        switchLinkLabel=""
      >
        <Link to="/forgot-password" className="btn btn--accent btn--block">
          Запросить новую ссылку
        </Link>
      </AuthPage>
    );
  }

  return (
    <AuthPage
      title="Новый пароль"
      generalError={error}
      switchText=""
      switchLinkTo="/login"
      switchLinkLabel=""
    >
      {done ? (
        <div className="auth-success" role="status">
          Пароль обновлён. Теперь можно войти с новым паролем.
          <Link to="/login" className="btn btn--accent btn--block">
            Войти
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <p className="auth-hint">Для аккаунта: {email}</p>
          <AuthField
            id="new-password"
            label="Новый пароль"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            passwordToggle
          />
          <AuthField
            id="new-password-confirmation"
            label="Повторите пароль"
            type="password"
            autoComplete="new-password"
            value={confirmation}
            onChange={setConfirmation}
            passwordToggle
          />
          <p className="auth-password-hint">
            Минимум 8 символов, заглавная буква и цифра
          </p>
          <button
            type="submit"
            className="btn btn--accent btn--lg btn--block"
            disabled={loading}
          >
            {loading ? "Сохраняем…" : "Сохранить пароль"}
          </button>
          <Link to="/login" className="auth-back-link">
            Назад ко входу
          </Link>
        </form>
      )}
    </AuthPage>
  );
}
