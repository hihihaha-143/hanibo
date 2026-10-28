export type ShopTabId =
  | "title"
  | "status"
  | "avatar"
  | "frame"
  | "banner"
  | "nickname_color"
  | "icon"
  | "medal"
  | "buff";

export interface ShopTab {
  id: ShopTabId;
  label: string;
}

export const SHOP_TABS: ShopTab[] = [
  { id: "title", label: "Титулы" },
  { id: "status", label: "Надписи" },
  { id: "avatar", label: "Аватарки" },
  { id: "frame", label: "Рамки" },
  { id: "banner", label: "Баннеры" },
  { id: "nickname_color", label: "Цвет ника" },
  { id: "icon", label: "Иконки" },
  { id: "medal", label: "Медали" },
  { id: "buff", label: "Бусты" },
];

export const DEFAULT_SHOP_TAB: ShopTabId = "status";

export function isShopTabId(value: string | null): value is ShopTabId {
  return !!value && SHOP_TABS.some((tab) => tab.id === value);
}
