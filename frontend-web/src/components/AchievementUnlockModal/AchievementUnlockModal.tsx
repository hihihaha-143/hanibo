import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { spring } from "../../lib/motion";
import type { UnlockedAchievement } from "../../api/alphabet";
import blueberryImg from "../../assets/blueberry.png";

interface AchievementUnlockModalProps {
  achievements: UnlockedAchievement[];
  onClose: () => void;
}

export default function AchievementUnlockModal({
  achievements,
  onClose,
}: AchievementUnlockModalProps) {
  useEffect(() => {
    if (achievements.length === 0) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [achievements.length, onClose]);

  return createPortal(
    <AnimatePresence>
      {achievements.length > 0 && (
        <motion.div
          className="modal achievement-unlock-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="modal__panel achievement-unlock-modal__panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={spring.base}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal__close"
              onClick={onClose}
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>

            <div className="achievement-unlock-modal__header">
              <Trophy size={28} className="achievement-unlock-modal__trophy" />
              <h2 className="achievement-unlock-modal__title">
                {achievements.length === 1
                  ? "Новое достижение!"
                  : `Новых достижений: ${achievements.length}`}
              </h2>
            </div>

            <div className="achievement-unlock-modal__list">
              {achievements.map((a) => (
                <div key={a.id} className="achievement-unlock-modal__item">
                  {a.image ? (
                    <img
                      src={a.image}
                      alt={a.title}
                      className="achievement-unlock-modal__image"
                    />
                  ) : (
                    <div className="achievement-unlock-modal__icon">
                      <Trophy size={22} />
                    </div>
                  )}
                  <div className="achievement-unlock-modal__info">
                    <span className="achievement-unlock-modal__item-title">
                      {a.title}
                    </span>
                    {a.description && (
                      <span className="achievement-unlock-modal__item-desc">
                        {a.description}
                      </span>
                    )}

                    {(a.blueberry_reward > 0 || a.bonus_title) && (
                      <div className="achievement-unlock-modal__bonuses">
                        {a.blueberry_reward > 0 && (
                          <span className="achievement-unlock-modal__bonus">
                            <img
                              src={blueberryImg}
                              alt="Черника"
                              className="achievement-unlock-modal__bonus-icon"
                            />
                            +{a.blueberry_reward}
                          </span>
                        )}
                        {a.bonus_title && (
                          <span className="achievement-unlock-modal__bonus">
                            <Trophy
                              size={14}
                              className="achievement-unlock-modal__bonus-icon"
                            />
                            Титул: {a.bonus_title.title}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              type="button"
              className="btn btn--accent achievement-unlock-modal__button"
              onClick={onClose}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={spring.bouncy}
            >
              Круто
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
