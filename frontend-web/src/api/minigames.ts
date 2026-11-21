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

// ---------- Text Input ----------

export interface TextInputQuestion {
  word_id: number;
  translation: string;
  hangul: string;
}

export async function getTextInput(): Promise<TextInputQuestion> {
  const { data } = await apiClient.get<TextInputQuestion>(
    "/minigames/text-input",
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
  window.dispatchEvent(new Event("hanibo:achievements-sync"));
  return data;
}

// =====================================================
// ФРАЗЫ
// =====================================================

// ---------- True / False ----------

export interface PhraseTrueFalseQuestion {
  phrase_id: number;
  hangul: string;
  translation: string;
  is_correct: boolean;
}

export async function getPhraseTrueFalse(): Promise<PhraseTrueFalseQuestion> {
  const { data } = await apiClient.get<PhraseTrueFalseQuestion>(
    "/minigames/phrase/true-false",
  );
  return data;
}

// ---------- Audio Choose ----------

export interface PhraseAudioChooseResponse {
  target: AudioChooseWord;
  distractors: AudioChooseWord[];
}

export async function getPhraseAudioChoose(): Promise<PhraseAudioChooseResponse> {
  const { data } = await apiClient.get<PhraseAudioChooseResponse>(
    "/minigames/phrase/audio-choose",
  );
  return data;
}

// ---------- Match ----------

export async function getPhraseMatch(): Promise<MatchResponse> {
  const { data } = await apiClient.get<MatchResponse>(
    "/minigames/phrase/match",
  );
  return data;
}

// ---------- Speed ----------

export async function getPhraseSpeed(): Promise<PhraseAudioChooseResponse> {
  const { data } = await apiClient.get<PhraseAudioChooseResponse>(
    "/minigames/phrase/speed",
  );
  return data;
}

// ---------- Correct Spelling ----------

export interface PhraseCorrectSpellingQuestion {
  phrase_id: number;
  translation: string;
  hangul: string;
  variants: string[];
  correct_index: number;
}

export async function getPhraseCorrectSpelling(): Promise<PhraseCorrectSpellingQuestion> {
  const { data } = await apiClient.get<PhraseCorrectSpellingQuestion>(
    "/minigames/phrase/correct-spelling",
  );
  return data;
}

// ---------- Order (сборка фразы из токенов) ----------

export interface PhraseOrderToken {
  order: number;
  text: string;
  space_after: boolean;
}

export interface PhraseOrderQuestion {
  phrase_id: number;
  hangul: string;
  translation: string;
  tokens: PhraseOrderToken[];
  correct_text: string;
}

export async function getPhraseOrder(): Promise<PhraseOrderQuestion> {
  const { data } = await apiClient.get<PhraseOrderQuestion>(
    "/minigames/phrase/order",
  );
  return data;
}
