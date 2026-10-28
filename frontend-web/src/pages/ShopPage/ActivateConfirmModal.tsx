import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { spring } from "../../lib/motion";
import type { ShopItem } from "../../types/shop";

interface ActivateConfirmModalProps {
  item: ShopItem | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ActivateConfirmModal({
  item,
  onConfirm,
  onCancel,
}: ActivateConfirmModalProps) {
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

  return createPortal(
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          className="modal activate-confirm-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
        >
          <motion.div
            className="modal__panel activate-confirm-modal__panel"
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

            <h2 className="activate-confirm-modal__title">
              Активировать «{item.title}»?
            </h2>

            {item.description && (
              <p className="activate-confirm-modal__description">
                {item.description}
              </p>
            )}

            <div className="activate-confirm-modal__actions">
              <motion.button
                type="button"
                className="btn btn--accent activate-confirm-modal__button"
                onClick={onConfirm}
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={spring.bouncy}
              >
                Активировать
              </motion.button>
              <button
                type="button"
                className="activate-confirm-modal__button activate-confirm-modal__button--cancel"
                onClick={onCancel}
              >
                Позже
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
