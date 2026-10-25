import { apiClient } from "./client";

export type AlphabetCategory =
  | "vowel"
  | "diphthong"
  | "consonant"
  | "assimilation"
  | "all";

export interface AlphabetExample {
  id: number;
  word: string;
  romanization: string | null;
  meaning: string;
}

export interface AlphabetConfusion {
  symbol: string;
  hint: string;
}

export interface AlphabetProgress {
  score: number;
  attempts: number;
  mistakes: number;
  max_score: number;
}

export interface AlphabetLetter {
  id: number;
  symbol: string;
  romanization: string;
  category: AlphabetCategory;
  description: string | null;
  sound_ipa: string | null;
  sound_note: string | null;
  sample_syllable: string | null;
  sample_romanization: string | null;
  family_symbols: string[];
  family_note: string | null;
  confusion: AlphabetConfusion[];
  examples: AlphabetExample[];
  progress: AlphabetProgress;
}

interface AlphabetResponse {
  data: AlphabetLetter[];
}

export async function getAlphabet(): Promise<AlphabetLetter[]> {
  const { data } = await apiClient.get<AlphabetResponse>("/alphabet");
  return data.data;
}

export interface UnlockedAchievementTitle {
  id: number;
  code: string;
  title: string;
}

export interface UnlockedAchievement {
  id: number;
  code: string;
  title: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  category_id: number;
  is_hidden: boolean;
  sort_order: number;
  blueberry_reward: number;
  bonus_title: UnlockedAchievementTitle | null;
}

export interface SubmitProgressResult {
  passed: boolean;
  percent: number;
  score_added: number;
  score: number;
  attempts: number;
  mistakes: number;
  max_score: number;
  blueberries_earned: number;
  total_blueberries: number;
  exp_earned: number;
  total_exp: number;
  reached_max: boolean;
  unlocked_achievements: UnlockedAchievement[];
}

interface SubmitProgressResponse {
  data: SubmitProgressResult;
}

export async function submitAlphabetProgress(
  letterId: number,
  correct: number,
  total: number,
): Promise<SubmitProgressResult> {
  const { data } = await apiClient.post<SubmitProgressResponse>(
    `/alphabet/${letterId}/progress`,
    { correct, total },
  );
  return data.data;
}

// ---------- групповой тест ----------

export interface GroupLetterInput {
  letter_id: number;
  correct: number;
  total: number;
}

export interface GroupLetterResult {
  letter_id: number;
  score_added: number;
  score: number;
  attempts: number;
  mistakes: number;
  max_score: number;
  reached_max: boolean;
}

export interface SubmitGroupProgressResult {
  passed: boolean;
  percent: number;
  blueberries_earned: number;
  total_blueberries: number;
  exp_earned: number;
  total_exp: number;
  letters: GroupLetterResult[];
  any_reached_max: boolean;
  unlocked_achievements: UnlockedAchievement[];
}

interface SubmitGroupProgressResponse {
  data: SubmitGroupProgressResult;
}

export async function submitAlphabetGroupProgress(
  category: AlphabetCategory,
  letters: GroupLetterInput[],
): Promise<SubmitGroupProgressResult> {
  const { data } = await apiClient.post<SubmitGroupProgressResponse>(
    "/alphabet/group/progress",
    { category, letters },
  );
  return data.data;
}
