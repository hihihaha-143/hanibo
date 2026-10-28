import { apiClient } from "./client";
import type { ShopItem, UserItem } from "../types/shop";
import type { User } from "../types/user";

interface ShopItemsResponse {
  data: ShopItem[];
}

interface InventoryResponse {
  data: UserItem[];
}

interface UserActionResponse {
  user: User;
}

interface BuyResponse {
  user: User;
  item: ShopItem;
}

export async function fetchShopItems(): Promise<ShopItem[]> {
  const { data } = await apiClient.get<ShopItemsResponse>("/shop/items");
  return data.data;
}

export async function fetchInventory(): Promise<UserItem[]> {
  const { data } = await apiClient.get<InventoryResponse>("/shop/inventory");
  return data.data;
}

export async function buyShopItem(itemId: number): Promise<BuyResponse> {
  const { data } = await apiClient.post<BuyResponse>(
    `/shop/items/${itemId}/buy`,
  );
  return data;
}

export async function equipShopItem(itemId: number): Promise<User> {
  const { data } = await apiClient.post<UserActionResponse>(
    `/shop/items/${itemId}/equip`,
  );
  return data.user;
}

export async function unequipShopItem(itemId: number): Promise<User> {
  const { data } = await apiClient.post<UserActionResponse>(
    `/shop/items/${itemId}/unequip`,
  );
  return data.user;
}

export async function activateShopItem(itemId: number): Promise<BuyResponse> {
  const { data } = await apiClient.post<BuyResponse>(
    `/shop/items/${itemId}/activate`,
  );
  return data;
}
