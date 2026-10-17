import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/useAuth";
import logo from "../assets/logo.jpg";
import axios from "axios";

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
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

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
    <div className="auth-page">
      <div className="auth-page__card">
        <div className="auth-page__logo">
          <img src={logo} alt="hanibo" />
        </div>

        <h1 className="auth-page__title">Войти</h1>

        {errors.general && (
          <div className="auth-page__error-general">{errors.general}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="auth-form__input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <span className="auth-form__error">{errors.email}</span>
            )}
          </div>

          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="password">
              Пароль
            </label>
            <div className="auth-form__input-wrap">
              <input
                id="password"
                className="auth-form__input"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-form__toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="auth-form__error">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Входим…" : "Войти"}
          </button>
        </form>

        <p className="auth-page__switch">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
