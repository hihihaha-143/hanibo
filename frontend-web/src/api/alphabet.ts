import { apiClient } from "./client";

export type AlphabetCategory = "vowel" | "diphthong" | "consonant";

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
}

interface AlphabetResponse {
  data: AlphabetLetter[];
}

export async function getAlphabet(): Promise<AlphabetLetter[]> {
  const { data } = await apiClient.get<AlphabetResponse>("/alphabet");
  return data.data;
}
  