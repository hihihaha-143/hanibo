import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useAuth } from "./useAuth";
import {
  NotificationContext,
  type AppNotification,
  type NotificationType,
} from "./NotificationContext";
import type { UnlockedAchievement } from "../api/alphabet";
import {
  readNotificationSettings,
  saveNotificationSettings,
  type NotificationSettings,
} from "../lib/notificationSettings";

const NOTIFICATIONS_PREFIX = "hanibo:notifications:";
const GOAL_NOTIFIED_PREFIX = "hanibo:notified:goal:";
const STREAK_NOTIFIED_PREFIX = "hanibo:notified:streak:";

interface NotificationsProviderProps {
  children: ReactNode;
}

function notificationId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readNotifications(userId: number): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_PREFIX + userId);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AppNotification[]) : [];
  } catch {
    return [];
  }
}

function saveNotifications(userId: number, items: AppNotification[]): void {
  try {
    localStorage.setItem(
      NOTIFICATIONS_PREFIX + userId,
      JSON.stringify(items.slice(0, 50)),
    );
  } catch {
    // ignore
  }
}

function browserNotify(title: string, text: string): void {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    window.Notification.permission !== "granted"
  ) {
    return;
  }

  try {
    new window.Notification(title, { body: text, tag: "hanibo" });
  } catch {
    // ignore
  }
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>(
    readNotificationSettings,
  );
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const settingsRef = useRef(settings);
  const loadedUserRef = useRef<number | null>(null);
  const skipSaveRef = useRef(false);
  const userId = user?.id;

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    if (!userId) {
      loadedUserRef.current = null;
      setNotifications([]);
      return;
    }
    loadedUserRef.current = userId;
    skipSaveRef.current = true;
    setNotifications(readNotifications(userId));
  }, [userId]);

  useEffect(() => {
    if (!userId || loadedUserRef.current !== userId) return;
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    saveNotifications(userId, notifications);
  }, [userId, notifications]);

  const addNotification = useCallback(
    (type: NotificationType, title: string, text: string) => {
      const current = settingsRef.current;
      const enabled =
        type === "achievement"
          ? current.achievements
          : type === "daily"
            ? current.daily
            : type === "streak"
              ? current.streak
              : true;

      if (!enabled) return;

      const item: AppNotification = {
        id: notificationId(),
        type,
        title,
        text,
        createdAt: new Date().toISOString(),
        read: false,
      };

      setNotifications((previous) => [item, ...previous].slice(0, 50));
      setToasts((previous) => [...previous, item]);

      window.setTimeout(() => {
        setToasts((previous) =>
          previous.filter((toast) => toast.id !== item.id),
        );
      }, 4500);

      if (current.browser) {
        browserNotify(title, text);
      }
    },
    [],
  );

  const notifyAchievements = useCallback(
    (items: UnlockedAchievement[]) => {
      for (const achievement of items) {
        addNotification(
          "achievement",
          "Новое достижение!",
          `${achievement.title} · +${achievement.blueberry_reward} черники`,
        );
      }
    },
    [addNotification],
  );

  const updateSettings = useCallback(
    async (patch: Partial<NotificationSettings>) => {
      let next = { ...settingsRef.current, ...patch };

      if (patch.browser === true) {
        if (!("Notification" in window)) {
          next = { ...next, browser: false };
        } else if (window.Notification.permission === "default") {
          const permission = await window.Notification.requestPermission();
          next = { ...next, browser: permission === "granted" };
        } else if (window.Notification.permission !== "granted") {
          next = { ...next, browser: false };
        }
      }

      settingsRef.current = next;
      setSettings(next);
      saveNotificationSettings(next);
    },
    [],
  );

  const markAllRead = useCallback(() => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true })),
    );
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  useEffect(() => {
    if (!userId || !settings.daily || !user?.goal_reached) return;
    const date =
      user.exp_today_date ?? new Date().toISOString().slice(0, 10);
    const key = GOAL_NOTIFIED_PREFIX + userId + ":" + date;
    if (localStorage.getItem(key)) return;

    localStorage.setItem(key, "1");
    addNotification(
      "daily",
      "Цель дня выполнена",
      `Ты набрал ${user.exp_today} XP. Отличная работа!`,
    );
  }, [
    userId,
    settings.daily,
    user?.goal_reached,
    user?.exp_today,
    user?.exp_today_date,
    addNotification,
  ]);

  useEffect(() => {
    if (!userId || !settings.streak || !user?.streak_extended_today) return;
    const date =
      user.streak_last_date?.slice(0, 10) ??
      new Date().toISOString().slice(0, 10);
    const key = STREAK_NOTIFIED_PREFIX + userId + ":" + date;
    if (localStorage.getItem(key)) return;

    localStorage.setItem(key, "1");
    addNotification(
      "streak",
      "Серия продлена",
      `Ты занимаешься ${user.streak_current} дней подряд. Так держать!`,
    );
  }, [
    userId,
    settings.streak,
    user?.streak_extended_today,
    user?.streak_last_date,
    user?.streak_current,
    addNotification,
  ]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const value = useMemo(
    () => ({
      settings,
      notifications,
      unreadCount,
      updateSettings,
      notifyAchievements,
      markAllRead,
      clearAll,
    }),
    [
      settings,
      notifications,
      unreadCount,
      updateSettings,
      notifyAchievements,
      markAllRead,
      clearAll,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notification-toasts" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="notification-toast"
            role="status"
          >
            <span className="notification-toast__icon">🔔</span>
            <span>
              <strong>{toast.title}</strong>
              <small>{toast.text}</small>
            </span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
