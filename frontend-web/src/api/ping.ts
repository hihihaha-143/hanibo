import { apiClient } from "./client";

export interface PingResponse {
  message: string;
  timestamp: string;
}

export async function ping(): Promise<PingResponse> {
  const { data } = await apiClient.get<PingResponse>("/ping");
  return data;
}
