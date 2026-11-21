import { createContext } from "react";
import type { UnlockedAchievement } from "../api/alphabet";
import type { NotificationSettings } from "../lib/notificationSettings";

export type NotificationType =
  | "achievement"
  | "streak"
  | "daily"
  | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationContextValue {
  settings: NotificationSettings;
  notifications: AppNotification[];
  unreadCount: number;
  updateSettings: (patch: Partial<NotificationSettings>) => Promise<void>;
  notifyAchievements: (items: UnlockedAchievement[]) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);
