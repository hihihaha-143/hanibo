import { motion } from "framer-motion";
import { useTheme } from "../../context/useTheme";
import { spring } from "../../lib/motion";

interface MobileNavSheetProps {
  onClose: () => void;
}

export default function MobileNavSheet({ onClose }: MobileNavSheetProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="mobile-nav-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Bottom sheet */}
      <motion.div
        className="mobile-nav-sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={spring.bouncy}
      >
        <label className="theme-switch">
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          <span className="theme-switch__slider" />
        </label>
      </motion.div>
    </>
  );
}
