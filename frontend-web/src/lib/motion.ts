import type { Transition, Variants } from "framer-motion";

// =============================================================================
// SPRING PRESETS
// =============================================================================

export const spring: Record<string, Transition> = {
  soft: { type: "spring", stiffness: 200, damping: 20 },
  base: { type: "spring", stiffness: 300, damping: 18 },
  bouncy: { type: "spring", stiffness: 400, damping: 14 },
  jelly: { type: "spring", stiffness: 500, damping: 10 },
};

// =============================================================================
// VARIANTS — для пунктов меню
// =============================================================================

export const menuItemVariants: Variants = {
  idle: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
  },
  tap: {
    scale: 0.95,
  },
};

// =============================================================================
// VARIANTS — для активного индикатора (если нужно)
// =============================================================================

export const indicatorVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};
