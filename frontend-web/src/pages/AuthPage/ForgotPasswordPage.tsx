import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { forgotPassword } from "../../api/auth";
import AuthPage from "./AuthPage";
import AuthField from "./AuthField";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        setError("Слишком много запросов. Попробуйте позже.");
      } else {
        setError("Не удалось отправить письмо. Попробуйте позже.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage
      title="Восстановление пароля"
      generalError={error}
      switchText="Вспомнили пароль?"
      switchLinkTo="/login"
      switchLinkLabel="Войти"
    >
      {sent ? (
        <div className="auth-success" role="status">
          Если аккаунт с таким email существует, мы отправили ссылку для
          сброса пароля. Она действует 1 час.
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <p className="auth-hint">
            Укажите email, на который зарегистрирован аккаунт.
          </p>
          <AuthField
            id="forgot-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
          />
          <button
            type="submit"
            className="btn btn--accent btn--lg btn--block"
            disabled={loading}
          >
            {loading ? "Отправляем…" : "Отправить ссылку"}
          </button>
          <Link to="/login" className="auth-back-link">
            Назад ко входу
          </Link>
        </form>
      )}
    </AuthPage>
  );
}
