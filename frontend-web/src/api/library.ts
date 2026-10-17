import { apiClient } from "./client";
import type { LibraryItem } from "../types/library";

interface LibraryItemsResponse {
  data: LibraryItem[];
}

interface LibraryItemResponse {
  data: LibraryItem;
}

export async function fetchLibraryItems(): Promise<LibraryItem[]> {
  const { data } = await apiClient.get<LibraryItemsResponse>("/library/items");
  return data.data;
}

export async function fetchLibraryItem(
  id: number | string,
): Promise<LibraryItem> {
  const { data } = await apiClient.get<LibraryItemResponse>(
    `/library/items/${id}`,
  );
  return data.data;
}
