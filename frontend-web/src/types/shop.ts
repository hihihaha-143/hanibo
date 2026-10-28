export type ShopItemType =
  | "title"
  | "status"
  | "avatar"
  | "frame"
  | "banner"
  | "nickname_color"
  | "icon"
  | "medal"
  | "buff";

export type ShopCurrency = "blueberry" | "strawberry";

export interface ShopItem {
  id: number;
  code: string;
  type: ShopItemType;
  title: string;
  description: string | null;
  price: number;
  currency: ShopCurrency;
  image: string | null;
  color: string | null;
  text: string | null;
  max_active: number;
  is_hidden: boolean;
  is_purchasable: boolean;
  sort_order: number;
  owned: boolean;
  active: boolean;
  quantity: number | null;
}

export interface UserItem {
  id: number;
  shop_item_id: number;
  quantity: number;
  purchased_at: string | null;
  active: boolean;
  item: ShopItem | null;
}
