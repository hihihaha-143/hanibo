import { useCallback, useEffect, useState } from "react";
import {
  activateShopItem,
  buyShopItem,
  equipShopItem,
  fetchShopItems,
  unequipShopItem,
} from "../../api/shop";
import type { ShopItem } from "../../types/shop";
import type { User } from "../../types/user";
import { useAuth } from "../../context/useAuth";

type PendingAction = "buy" | "equip" | "unequip" | "activate";

interface UseShopResult {
  items: ShopItem[];
  loading: boolean;
  error: string | null;
  actionError: string | null;
  clearActionError: () => void;
  actionPendingId: number | null;
  actionPendingType: PendingAction | null;
  reload: () => Promise<void>;
  buy: (item: ShopItem) => Promise<void>;
  equip: (item: ShopItem) => Promise<void>;
  unequip: (item: ShopItem) => Promise<void>;
  activate: (item: ShopItem) => Promise<void>;
}

export function useShop(): UseShopResult {
  const { updateUser } = useAuth();

  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const clearActionError = useCallback(() => setActionError(null), []);

  const [actionPendingId, setActionPendingId] = useState<number | null>(null);
  const [actionPendingType, setActionPendingType] =
    useState<PendingAction | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchShopItems();
      setItems(data);
    } catch {
      setError("Не удалось загрузить магазин.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const applyUser = useCallback(
    (updated: User | null) => {
      if (updated) {
        updateUser(updated);
      }
    },
    [updateUser],
  );

  const buy = useCallback(
    async (item: ShopItem) => {
      setActionError(null);
      setActionPendingId(item.id);
      setActionPendingType("buy");

      try {
        const result = await buyShopItem(item.id);
        applyUser(result.user);
        await reload();
      } catch {
        setActionError("Не удалось купить предмет. Попробуйте ещё раз.");
      } finally {
        setActionPendingId(null);
        setActionPendingType(null);
      }
    },
    [applyUser, reload],
  );

  const equip = useCallback(
    async (item: ShopItem) => {
      setActionError(null);
      setActionPendingId(item.id);
      setActionPendingType("equip");

      try {
        const updatedUser = await equipShopItem(item.id);
        applyUser(updatedUser);
        await reload();
      } catch {
        setActionError("Не удалось надеть предмет. Попробуйте ещё раз.");
      } finally {
        setActionPendingId(null);
        setActionPendingType(null);
      }
    },
    [applyUser, reload],
  );

  const unequip = useCallback(
    async (item: ShopItem) => {
      setActionError(null);
      setActionPendingId(item.id);
      setActionPendingType("unequip");

      try {
        const updatedUser = await unequipShopItem(item.id);
        applyUser(updatedUser);
        await reload();
      } catch {
        setActionError("Не удалось снять предмет. Попробуйте ещё раз.");
      } finally {
        setActionPendingId(null);
        setActionPendingType(null);
      }
    },
    [applyUser, reload],
  );

  const activate = useCallback(
    async (item: ShopItem) => {
      setActionError(null);
      setActionPendingId(item.id);
      setActionPendingType("activate");

      try {
        const result = await activateShopItem(item.id);
        applyUser(result.user);
        await reload();
      } catch {
        setActionError("Не удалось активировать предмет. Попробуйте ещё раз.");
      } finally {
        setActionPendingId(null);
        setActionPendingType(null);
      }
    },
    [applyUser, reload],
  );

  return {
    items,
    loading,
    error,
    actionError,
    clearActionError,
    actionPendingId,
    actionPendingType,
    reload,
    buy,
    equip,
    unequip,
    activate,
  };
}
