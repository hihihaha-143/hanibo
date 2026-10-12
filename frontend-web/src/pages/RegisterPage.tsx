import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/useAuth";
import logo from "../assets/logo.jpg";
import axios from "axios";

interface FormErrors {
  nickname?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
    <div className="auth-page">
      <div className="auth-page__card">
        <div className="auth-page__logo">
          <img src={logo} alt="hanibo" />
        </div>

        <h1 className="auth-page__title">Регистрация</h1>

        {errors.general && (
          <div className="auth-page__error-general">{errors.general}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="nickname">
              Ник
            </label>
            <input
              id="nickname"
              className="auth-form__input"
              type="text"
              autoComplete="username"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            {errors.nickname && (
              <span className="auth-form__error">{errors.nickname}</span>
            )}
          </div>

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
                autoComplete="new-password"
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

          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="password_confirmation">
              Повторите пароль
            </label>
            <input
              id="password_confirmation"
              className="auth-form__input"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Регистрируем…" : "Зарегистрироваться"}
          </button>
        </form>

        <p className="auth-page__switch">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
