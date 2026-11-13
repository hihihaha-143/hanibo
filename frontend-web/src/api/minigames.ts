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
