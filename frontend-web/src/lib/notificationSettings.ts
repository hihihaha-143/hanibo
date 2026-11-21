export interface NotificationSettings {
  achievements: boolean;
  streak: boolean;
  daily: boolean;
  browser: boolean;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  achievements: true,
  streak: true,
  daily: false,
  browser: false,
};

const KEY = "hanibo:settings:notifications";

export function readNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_NOTIFICATION_SETTINGS };
    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...(JSON.parse(raw) as Partial<NotificationSettings>),
    };
  } catch {
    return { ...DEFAULT_NOTIFICATION_SETTINGS };
  }
}

export function saveNotificationSettings(
  settings: NotificationSettings,
): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
