import { apiClient } from "./client";
import type { LibraryItem } from "../types/library";

interface LibraryItemsResponse {
  data: LibraryItem[];
}

export async function fetchLibraryItems(): Promise<LibraryItem[]> {
  const { data } = await apiClient.get<LibraryItemsResponse>("/library/items");
  return data.data;
}
