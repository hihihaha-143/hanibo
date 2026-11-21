import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import AuthPage from "./AuthPage";
import AuthField from "./AuthField";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LOCK_KEY = "hanibo:login-lock-until";

function readLock(): number {
  try {
    return Number(localStorage.getItem(LOCK_KEY) || 0);
  } catch {
    return 0;
  }
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(readLock);
  const [now, setNow] = useState(0);

  const rawFrom = (location.state as { from?: unknown } | null)?.from;
  const redirectTo =
    typeof rawFrom === "string" &&
    rawFrom.startsWith("/") &&
    !rawFrom.startsWith("//")
      ? rawFrom
      : "/";

  const secondsLeft = Math.max(0, Math.ceil((lockUntil - now) / 1000));
  const isLocked = secondsLeft > 0;

  useEffect(() => {
    setNow(Date.now());
  }, []);

  useEffect(() => {
    if (!isLocked) return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [isLocked]);

  useEffect(() => {
    if (!isLocked && attempts >= 3) setAttempts(0);
  }, [isLocked, attempts]);

  useEffect(() => {
    if (isLocked || lockUntil === 0) return;
    try {
      localStorage.removeItem(LOCK_KEY);
    } catch {
      // ignore
    }
  }, [isLocked, lockUntil]);

  const lockFor = (seconds: number) => {
    const until = Date.now() + seconds * 1000;
    setLockUntil(until);
    setNow(Date.now());
    try {
      localStorage.setItem(LOCK_KEY, String(until));
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isLocked || isSubmitting) return;

    setErrors({});
    setIsSubmitting(true);

    try {
      await login({ email, password });
      setAttempts(0);
      setLockUntil(0);
      try {
        localStorage.removeItem(LOCK_KEY);
      } catch {
        // ignore
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const { status, data } = err.response;

        if (status === 422 && data?.errors) {
          setErrors({
            email: data.errors.email?.[0],
            password: data.errors.password?.[0],
          });
        } else if (status === 429) {
          lockFor(30);
          setErrors({
            general: "Слишком много попыток. Подождите 30 секунд.",
          });
        } else if (status === 401) {
          const next = attempts + 1;
          setAttempts(next);
          if (next >= 3) {
            lockFor(30);
          }
          setErrors({
            general:
              next >= 3
                ? "Слишком много попыток. Подождите 30 секунд."
                : data?.message ?? "Неверный email/никнейм или пароль.",
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
      title="Войти"
      generalError={
        isLocked
          ? `Слишком много попыток. Подождите ${secondsLeft} сек.`
          : errors.general
      }
      switchText="Нет аккаунта?"
      switchLinkTo="/register"
      switchLinkLabel="Зарегистрироваться"
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="email"
          label="Email или никнейм"
          type="text"
          autoComplete="username"
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

        <Link to="/forgot-password" className="auth-forgot-link">
          Забыли пароль?
        </Link>

        <button
          type="submit"
          className="btn btn--accent btn--lg btn--block"
          disabled={isSubmitting || isLocked}
        >
          {isLocked
            ? `Подождите ${secondsLeft} сек.`
            : isSubmitting
              ? "Входим…"
              : "Войти"}
        </button>
      </form>

      <p className="auth-guest-link">
        <Link to="/">Продолжить как гость</Link>
      </p>
    </AuthPage>
  );
}
