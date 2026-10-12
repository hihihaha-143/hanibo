export type UserRole = "user" | "admin";

export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface User {
  id: number;
  nickname: string;
  email: string;
  role: UserRole;
  language_level: LanguageLevel | null;
  avatar: string | null;
  strawberry: number;
  blueberry: number;
  exp: number;
  streak_current: number;
  streak_best: number;
  streak_last_date: string | null;
  created_at: string;
}
