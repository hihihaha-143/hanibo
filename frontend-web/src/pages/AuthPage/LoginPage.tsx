import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import AuthPage from "./AuthPage";
import AuthField from "./AuthField";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawFrom = (location.state as { from?: unknown } | null)?.from;
  const redirectTo =
    typeof rawFrom === "string" &&
    rawFrom.startsWith("/") &&
    !rawFrom.startsWith("//")
      ? rawFrom
      : "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const { status, data } = err.response;

        if (status === 422 && data?.errors) {
          setErrors({
            email: data.errors.email?.[0],
            password: data.errors.password?.[0],
          });
        } else if (status === 401) {
          setErrors({ general: data?.message ?? "Неверный email или пароль." });
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
      title="Войти"
      generalError={errors.general}
      switchText="Нет аккаунта?"
      switchLinkTo="/register"
      switchLinkLabel="Зарегистрироваться"
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          passwordToggle
        />

        <button
          type="submit"
          className="btn btn--accent btn--lg btn--block"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Входим…" : "Войти"}
        </button>
      </form>
    </AuthPage>
  );
}
