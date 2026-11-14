import { apiClient } from "./client";

// ---------- True / False ----------

export interface TrueFalseQuestion {
  word_id: number;
  hangul: string;
  translation: string;
  is_correct: boolean;
}

export async function getTrueFalse(): Promise<TrueFalseQuestion> {
  const { data } = await apiClient.get<TrueFalseQuestion>(
    "/minigames/true-false",
  );
  return data;
}

// ---------- Audio Choose ----------

export interface AudioChooseWord {
  id: number;
  hangul: string;
  translation: string;
}

export interface AudioChooseResponse {
  target: AudioChooseWord;
  distractors: AudioChooseWord[];
}

export async function getAudioChoose(): Promise<AudioChooseResponse> {
  const { data } = await apiClient.get<AudioChooseResponse>(
    "/minigames/audio-choose",
  );
  return data;
}

// ---------- Match ----------

export interface MatchPairWord {
  id: number;
  hangul: string;
  translation: string;
}

export interface MatchResponse {
  pairs: MatchPairWord[];
}

export async function getMatch(): Promise<MatchResponse> {
  const { data } = await apiClient.get<MatchResponse>("/minigames/match");
  return data;
}

// ---------- Syllable Gap ----------

export interface SyllableGapQuestion {
  word_id: number;
  hangul: string;
  translation: string;
  prompt: string;
  correct: string;
  variants: string[];
  correct_index: number;
}

export async function getSyllableGap(): Promise<SyllableGapQuestion> {
  const { data } = await apiClient.get<SyllableGapQuestion>(
    "/minigames/syllable-gap",
  );
  return data;
}

// ---------- Syllable Order ----------

export interface SyllableOrderQuestion {
  word_id: number;
  hangul: string;
  translation: string;
  syllables: string[];
}

export async function getSyllableOrder(): Promise<SyllableOrderQuestion> {
  const { data } = await apiClient.get<SyllableOrderQuestion>(
    "/minigames/syllable-order",
  );
  return data;
}

// ---------- Speed ----------

export async function getSpeed(): Promise<AudioChooseResponse> {
  const { data } = await apiClient.get<AudioChooseResponse>("/minigames/speed");
  return data;
}

// ---------- Correct Spelling ----------

export interface CorrectSpellingQuestion {
  word_id: number;
  translation: string;
  hangul: string;
  variants: string[];
  correct_index: number;
}

export async function getCorrectSpelling(): Promise<CorrectSpellingQuestion> {
  const { data } = await apiClient.get<CorrectSpellingQuestion>(
    "/minigames/correct-spelling",
  );
  return data;
}

// ---------- Награда ----------

export interface RewardResponse {
  reward: number;
  percent: number;
  blueberry: number;
}

export async function postReward(
  correct: number,
  total: number,
): Promise<RewardResponse> {
  const { data } = await apiClient.post<RewardResponse>("/minigames/reward", {
    correct,
    total,
  });
  return data;
}
