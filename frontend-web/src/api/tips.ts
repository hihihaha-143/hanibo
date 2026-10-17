import { apiClient } from "./client";

export type TipType = "advice" | "fact";

export interface Tip {
  type: TipType;
  content: string;
}

export async function getRandomTip(): Promise<Tip> {
  const { data } = await apiClient.get<Tip>("/tips/random");
  return data;
}
