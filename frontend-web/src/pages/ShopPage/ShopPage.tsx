import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { spring } from "../../lib/motion";
import ChipsBlock from "../../components/ChipsBlock/ChipsBlock";
import { useAuth } from "../../context/useAuth";
import { useShop } from "./useShop";
import { ShopItemCard } from "./ShopItemCard";
import { BuyConfirmModal } from "./BuyConfirmModal";
import { ActivateConfirmModal } from "./ActivateConfirmModal";
import type { ShopItem } from "../../types/shop";
import type { ShopTabId } from "./shopTabs";
import { SHOP_TABS, DEFAULT_SHOP_TAB, isShopTabId } from "./shopTabs";

export function ShopPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    items,
    loading,
    error,
    actionPendingId,
    actionPendingType,
    actionError,
    clearActionError,
    buy,
    equip,
    unequip,
    activate,
  } = useShop();

  const [buyTarget, setBuyTarget] = useState<ShopItem | null>(null);
  const [activateTarget, setActivateTarget] = useState<ShopItem | null>(null);

  const rawTab = searchParams.get("tab");
  const activeTab: ShopTabId = isShopTabId(rawTab) ? rawTab : DEFAULT_SHOP_TAB;

  const handleTabChange = (tabId: ShopTabId) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tabId);
    setSearchParams(next, { replace: false });
  };

  const handleBuyConfirm = async () => {
    if (!buyTarget) return;
    const target = buyTarget;
    setBuyTarget(null);
    await buy(target);
  };

  const handleActivateConfirm = async () => {
    if (!activateTarget) return;
    const target = activateTarget;
    setActivateTarget(null);
    await activate(target);
  };

  const sectionItems = items.filter((item) => item.type === activeTab);

  return (
    <div className="shop-page">
      <header className="shop-page__header">
        <h1 className="shop-page__title">Магазин</h1>
        <p className="shop-page__subtitle">
          Трать чернику на косметику, клубнику — на бусты.
        </p>
      </header>

      <div className="shop-page__top">
        <ChipsBlock
          tabs={SHOP_TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          layoutId="shop-chip-highlight"
        />
      </div>

      {actionError && (
        <div className="shop-page__action-error" role="alert">
          <span>{actionError}</span>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={clearActionError}
          >
            Закрыть
          </button>
        </div>
      )}

      <div className="shop-page__content">
        {loading ? (
          <p className="shop-page__state">Загружаем магазин…</p>
        ) : error ? (
          <p className="shop-page__state shop-page__state--error">{error}</p>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              className="shop-page__panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={spring.soft}
            >
              {sectionItems.length === 0 ? (
                <p className="shop-page__state">
                  В этой категории пока ничего нет.
                </p>
              ) : (
                <div className="shop-page__grid">
                  {sectionItems.map((item) => (
                    <ShopItemCard
                      key={item.id}
                      item={item}
                      user={user}
                      pending={actionPendingId === item.id}
                      pendingType={
                        actionPendingId === item.id ? actionPendingType : null
                      }
                      onBuy={(target) => setBuyTarget(target)}
                      onEquip={(target) => void equip(target)}
                      onUnequip={(target) => void unequip(target)}
                      onActivate={(target) => setActivateTarget(target)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <BuyConfirmModal
        item={buyTarget}
        user={user}
        onConfirm={handleBuyConfirm}
        onCancel={() => setBuyTarget(null)}
      />

      <ActivateConfirmModal
        item={activateTarget}
        onConfirm={handleActivateConfirm}
        onCancel={() => setActivateTarget(null)}
      />
    </div>
  );
}

export default ShopPage;
