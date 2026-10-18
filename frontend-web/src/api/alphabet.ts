import { apiClient } from "./client";

export type AlphabetCategory = "vowel" | "diphthong" | "consonant";

export interface AlphabetExample {
  id: number;
  word: string;
  romanization: string | null;
  meaning: string;
}

export interface AlphabetLetter {
  id: number;
  symbol: string;
  romanization: string;
  category: AlphabetCategory;
  description: string | null;
  examples: AlphabetExample[];
}

interface AlphabetResponse {
  data: AlphabetLetter[];
}

export async function getAlphabet(): Promise<AlphabetLetter[]> {
  const { data } = await apiClient.get<AlphabetResponse>("/alphabet");
  return data.data;
}
