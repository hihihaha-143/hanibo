export type UserRole = "user" | "admin";

export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface UserTitle {
  id: number;
  code: string;
  title: string;
}

export interface User {
  id: number;
  nickname: string;
  email: string;
  role: UserRole;
  language_level: LanguageLevel | null;
  avatar: string | null;
  selected_title: UserTitle | null;
  timezone: string;
  daily_exp_goal: number;
  exp_today: number;
  exp_today_date: string | null;
  goal_reached: boolean;
  strawberry: number;
  blueberry: number;
  exp: number;
  streak_current: number;
  streak_best: number;
  streak_last_date: string | null;
  streak_extended_today: boolean;
  streak_frozen_today: boolean;
  streak_freezes: number;
  created_at: string;
}
