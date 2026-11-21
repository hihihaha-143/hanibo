import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  CheckCircle,
  Globe,
  LockKeyhole,
  LogOut,
  Moon,
  Save,
  Settings as SettingsIcon,
  Sun,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useTheme } from "../../context/useTheme";
import { useNotifications } from "../../context/useNotifications";
import {
  updatePassword,
  updateProfile,
  updateSettings,
} from "../../api/auth";

function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;
    const first = data?.errors && Object.values(data.errors)[0]?.[0];
    return first || data?.message || "Не удалось сохранить изменения.";
  }
  return "Не удалось сохранить изменения.";
}

const TIMEZONES = [
  "Asia/Seoul",
  "Asia/Yekaterinburg",
  "Europe/Moscow",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "UTC",
];

interface SettingsPageProps {
  embedded?: boolean;
}

export default function SettingsPage({ embedded = false }: SettingsPageProps) {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const {
    settings: notificationSettings,
    updateSettings: updateNotificationSettings,
  } = useNotifications();
  const [browserError, setBrowserError] = useState("");

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileStatus, setProfileStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [profileError, setProfileError] = useState("");

  const [dailyGoal, setDailyGoal] = useState(String(user?.daily_exp_goal ?? 150));
  const [timezone, setTimezone] = useState(user?.timezone ?? "UTC");
  const [learningStatus, setLearningStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const [learningError, setLearningError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const [passwordError, setPasswordError] = useState("");

  if (!user) return null;

  const timezones = Array.from(new Set([timezone, ...TIMEZONES]));

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setProfileError("");
    setProfileStatus("saving");
    try {
      const updated = await updateProfile({ nickname, email });
      updateUser(updated);
      setProfileStatus("saved");
    } catch (error) {
      setProfileStatus("idle");
      setProfileError(errorMessage(error));
    }
  };

  const saveLearning = async (event: FormEvent) => {
    event.preventDefault();
    setLearningError("");
    setLearningStatus("saving");
    try {
      const result = await updateSettings({
        daily_exp_goal: Number(dailyGoal),
        timezone,
      });
      updateUser(result.user);
      setLearningStatus("saved");
    } catch (error) {
      setLearningStatus("idle");
      setLearningError(errorMessage(error));
    }
  };

  const savePassword = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordStatus("saving");
    try {
      await updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStatus("saved");
    } catch (error) {
      setPasswordStatus("idle");
      setPasswordError(errorMessage(error));
    }
  };

  const toggleNotification = async (
    key: "achievements" | "streak" | "daily" | "browser",
  ) => {
    setBrowserError("");
    await updateNotificationSettings({
      [key]: !notificationSettings[key],
    });
    if (key === "browser" && !notificationSettings.browser) {
      if (!("Notification" in window)) {
        setBrowserError("Этот браузер не поддерживает системные уведомления.");
      } else if (window.Notification.permission !== "granted") {
        setBrowserError("Разрешение на уведомления не выдано.");
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className={embedded ? "profile-settings" : "page settings-page"}>
      {!embedded && (
        <Link to="/profile" className="settings-page__back">
          <ArrowLeft size={16} />
          В профиль
        </Link>
      )}

      {!embedded && (
        <header className="settings-page__header">
        <span className="settings-page__eyebrow">
          <SettingsIcon size={16} />
          Управление аккаунтом
        </span>
        <h1>Настройки</h1>
          <p>Профиль, внешний вид, обучение, уведомления и безопасность.</p>
        </header>
      )}

      <div className="settings-grid">
        <section className="card settings-card">
          <div className="settings-card__head">
            <span className="settings-card__icon">
              <UserRound size={19} />
            </span>
            <div>
              <h2>Аккаунт</h2>
              <p>Как тебя видят другие ученики</p>
            </div>
          </div>

          <form className="settings-form" onSubmit={saveProfile}>
            <label className="settings-field">
              <span>Никнейм</span>
              <input
                className="input"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                minLength={3}
                maxLength={32}
                required
              />
            </label>
            <label className="settings-field">
              <span>Email</span>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            {profileError && (
              <p className="settings-message settings-message--error" role="alert">
                <AlertCircle size={15} />
                {profileError}
              </p>
            )}
            {profileStatus === "saved" && (
              <p className="settings-message settings-message--success">
                <CheckCircle size={15} />
                Аккаунт обновлён
              </p>
            )}
            <button
              type="submit"
              className="btn btn--accent btn--sm"
              disabled={profileStatus === "saving"}
            >
              <Save size={15} />
              {profileStatus === "saving" ? "Сохраняем…" : "Сохранить"}
            </button>
          </form>
        </section>

        <section className="card settings-card">
          <div className="settings-card__head">
            <span className="settings-card__icon">
              {theme === "dark" ? <Moon size={19} /> : <Sun size={19} />}
            </span>
            <div>
              <h2>Внешний вид</h2>
              <p>Тема интерфейса применяется сразу</p>
            </div>
          </div>

          <div className="settings-theme">
            <button
              type="button"
              className={
                "settings-theme__option" +
                (theme === "light" ? " settings-theme__option--active" : "")
              }
              onClick={() => setTheme("light")}
              aria-pressed={theme === "light"}
            >
              <Sun size={19} />
              <span>
                <strong>Светлая</strong>
                <small>Дневной режим</small>
              </span>
            </button>
            <button
              type="button"
              className={
                "settings-theme__option" +
                (theme === "dark" ? " settings-theme__option--active" : "")
              }
              onClick={() => setTheme("dark")}
              aria-pressed={theme === "dark"}
            >
              <Moon size={19} />
              <span>
                <strong>Тёмная</strong>
                <small>Для вечера</small>
              </span>
            </button>
          </div>
        </section>

        <section className="card settings-card">
          <div className="settings-card__head">
            <span className="settings-card__icon">
              <Globe size={19} />
            </span>
            <div>
              <h2>Обучение</h2>
              <p>Цель и часовой пояс влияют на серию и опыт</p>
            </div>
          </div>

          <form className="settings-form" onSubmit={saveLearning}>
            <label className="settings-field">
              <span>Дневная цель по опыту</span>
              <input
                className="input"
                type="number"
                min={10}
                max={1000}
                value={dailyGoal}
                onChange={(event) => setDailyGoal(event.target.value)}
                required
              />
              <small>От 10 до 1000 XP. Сейчас: {dailyGoal} XP.</small>
            </label>
            <label className="settings-field">
              <span>Часовой пояс</span>
              <select
                className="select"
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
              >
                {timezones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </label>
            {learningError && (
              <p className="settings-message settings-message--error" role="alert">
                <AlertCircle size={15} />
                {learningError}
              </p>
            )}
            {learningStatus === "saved" && (
              <p className="settings-message settings-message--success">
                <CheckCircle size={15} />
                Настройки обучения сохранены
              </p>
            )}
            <button
              type="submit"
              className="btn btn--accent btn--sm"
              disabled={learningStatus === "saving"}
            >
              <Save size={15} />
              {learningStatus === "saving" ? "Сохраняем…" : "Сохранить"}
            </button>
          </form>
        </section>

        <section className="card settings-card">
          <div className="settings-card__head">
            <span className="settings-card__icon">
              <Bell size={19} />
            </span>
            <div>
              <h2>Уведомления</h2>
              <p>Локальные напоминания в этом браузере</p>
            </div>
          </div>

          <div className="settings-switches">
            <NotificationRow
              label="Новые достижения"
              hint="Уведомление о новой награде"
              checked={notificationSettings.achievements}
              onChange={() => void toggleNotification("achievements")}
            />
            <NotificationRow
              label="Серия"
              hint="Напоминать о сохранении серии"
              checked={notificationSettings.streak}
              onChange={() => void toggleNotification("streak")}
            />
            <NotificationRow
              label="Дневная цель"
              hint="Сообщать о выполнении цели"
              checked={notificationSettings.daily}
              onChange={() => void toggleNotification("daily")}
            />
            <NotificationRow
              label="Уведомления браузера"
              hint="Системные уведомления, если разрешено"
              checked={notificationSettings.browser}
              onChange={() => void toggleNotification("browser")}
            />
          </div>
          {browserError && (
            <p className="settings-message settings-message--error" role="alert">
              <AlertCircle size={15} />
              {browserError}
            </p>
          )}
        </section>

        <section className="card settings-card settings-card--wide">
          <div className="settings-card__head">
            <span className="settings-card__icon">
              <LockKeyhole size={19} />
            </span>
            <div>
              <h2>Безопасность</h2>
              <p>Смена пароля</p>
            </div>
          </div>

          <form className="settings-form settings-form--row" onSubmit={savePassword}>
            <label className="settings-field">
              <span>Текущий пароль</span>
              <input
                className="input"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <label className="settings-field">
              <span>Новый пароль</span>
              <input
                className="input"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
            <label className="settings-field">
              <span>Повторите пароль</span>
              <input
                className="input"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
            {passwordError && (
              <p className="settings-message settings-message--error" role="alert">
                <AlertCircle size={15} />
                {passwordError}
              </p>
            )}
            {passwordStatus === "saved" && (
              <p className="settings-message settings-message--success">
                <CheckCircle size={15} />
                Пароль обновлён
              </p>
            )}
            <button
              type="submit"
              className="btn btn--accent btn--sm"
              disabled={passwordStatus === "saving"}
            >
              <Save size={15} />
              {passwordStatus === "saving" ? "Сохраняем…" : "Сменить пароль"}
            </button>
          </form>
        </section>

        <section className="card settings-card settings-card--danger">
          <div>
            <h2>Выход</h2>
            <p>Завершить сеанс на этом устройстве.</p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
            <LogOut size={15} />
            Выйти
          </button>
        </section>
      </div>
    </div>
  );
}

function NotificationRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="settings-switch-row">
      <span>
        <strong>{label}</strong>
        <small>{hint}</small>
      </span>
      <input
        type="checkbox"
        className="settings-switch-row__input"
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      <span className="settings-switch-row__track" aria-hidden="true">
        <span />
      </span>
    </label>
  );
}
