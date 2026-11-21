import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import AuthPage from "./AuthPage";
import AuthField from "./AuthField";

interface FormErrors {
  nickname?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  general?: string;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setErrors({ password_confirmation: "Пароли не совпадают" });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await register({
        nickname,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate("/", { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const { status, data } = err.response;

        if (status === 422 && data?.errors) {
          setErrors({
            nickname: data.errors.nickname?.[0],
            email: data.errors.email?.[0],
            password: data.errors.password?.[0],
            password_confirmation:
              data.errors.password_confirmation?.[0],
          });
        } else {
          setErrors({ general: "Что-то пошло не так. Попробуйте позже." });
        }
      } else {
        setErrors({ general: "Нет связи с сервером." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPage
      title="Регистрация"
      generalError={errors.general}
      switchText="Уже есть аккаунт?"
      switchLinkTo="/login"
      switchLinkLabel="Войти"
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="nickname"
          label="Ник"
          type="text"
          autoComplete="username"
          value={nickname}
          onChange={setNickname}
          error={errors.nickname}
        />

        <AuthField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />

        <AuthField
          id="password"
          label="Пароль"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          passwordToggle
        />

        <p className="auth-password-hint">
          Минимум 8 символов, заглавная буква и цифра
        </p>

        <AuthField
          id="password_confirmation"
          label="Повторите пароль"
          type="password"
          autoComplete="new-password"
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
          error={errors.password_confirmation}
          passwordToggle
        />

        <button
          type="submit"
          className="btn btn--accent btn--lg btn--block"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Регистрируем…" : "Зарегистрироваться"}
        </button>
      </form>
    </AuthPage>
  );
}
