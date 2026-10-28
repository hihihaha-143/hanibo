import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { spring } from "../../lib/motion";
import type { ShopItem } from "../../types/shop";
import type { User } from "../../types/user";
import blueberryIcon from "../../assets/blueberry.png";
import strawberryIcon from "../../assets/strawberry.png";

interface BuyConfirmModalProps {
  item: ShopItem | null;
  user: User | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BuyConfirmModal({
  item,
  user,
  onConfirm,
  onCancel,
}: BuyConfirmModalProps) {
  const isOpen = item !== null;

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onCancel]);

  const currencyIcon =
    item?.currency === "strawberry" ? strawberryIcon : blueberryIcon;

  const balance =
    item?.currency === "strawberry"
      ? (user?.strawberry ?? 0)
      : (user?.blueberry ?? 0);

  return createPortal(
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          className="modal buy-confirm-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
        >
          <motion.div
            className="modal__panel buy-confirm-modal__panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={spring.base}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal__close"
              onClick={onCancel}
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>

            <h2 className="buy-confirm-modal__title">Купить «{item.title}»?</h2>

            <div className="buy-confirm-modal__price">
              <img src={currencyIcon} alt={item.currency} />
              <span>{item.price}</span>
            </div>

            <p className="buy-confirm-modal__balance">У тебя: {balance}</p>

            <div className="buy-confirm-modal__actions">
              <motion.button
                type="button"
                className="btn btn--accent buy-confirm-modal__button"
                onClick={onConfirm}
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={spring.bouncy}
              >
                Купить
              </motion.button>
              <button
                type="button"
                className="buy-confirm-modal__button buy-confirm-modal__button--cancel"
                onClick={onCancel}
              >
                Отмена
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
