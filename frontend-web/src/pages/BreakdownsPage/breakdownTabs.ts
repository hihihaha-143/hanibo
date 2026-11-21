export type BreakdownsTabId = "home" | "catalog" | "account";

export const BREAKDOWN_TABS: { id: BreakdownsTabId; label: string }[] = [
  { id: "home", label: "Главная" },
  { id: "catalog", label: "Каталог" },
  { id: "account", label: "Аккаунт" },
];

export const DEFAULT_BREAKDOWN_TAB: BreakdownsTabId = "home";

export function isBreakdownsTabId(value: string | null): value is BreakdownsTabId {
  return BREAKDOWN_TABS.some((tab) => tab.id === value);
}
