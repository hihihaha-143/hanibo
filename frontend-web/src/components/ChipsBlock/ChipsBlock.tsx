import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { spring, menuItemVariants } from "../../lib/motion";

export interface ChipTab<T extends string> {
  id: T;
  label: string;
}

interface ChipsBlockProps<T extends string> {
  tabs: ChipTab<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  layoutId: string;
  baseClassName?: string;
}

export default function ChipsBlock<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  layoutId,
  baseClassName = "chips-block",
}: ChipsBlockProps<T>) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const startSentinelRef = useRef<HTMLDivElement | null>(null);
  const endSentinelRef = useRef<HTMLDivElement | null>(null);

  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const startSentinel = startSentinelRef.current;
    const endSentinel = endSentinelRef.current;

    if (!scroller || !startSentinel || !endSentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === startSentinel) {
            setShowLeftFade(!entry.isIntersecting);
          } else if (entry.target === endSentinel) {
            setShowRightFade(!entry.isIntersecting);
          }
        }
      },
      { root: scroller, threshold: 0 },
    );

    observer.observe(startSentinel);
    observer.observe(endSentinel);

    return () => observer.disconnect();
  }, []);

  const rootClassName = [
    baseClassName,
    showLeftFade ? `${baseClassName}--fade-left` : "",
    showRightFade ? `${baseClassName}--fade-right` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <div className={`${baseClassName}__scroller`} ref={scrollerRef}>
        <div
          className={`${baseClassName}__sentinel`}
          ref={startSentinelRef}
          aria-hidden="true"
        />

        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <motion.button
              key={tab.id}
              type="button"
              className={
                isActive
                  ? `${baseClassName}__chip ${baseClassName}__chip--active`
                  : `${baseClassName}__chip`
              }
              onClick={() => onTabChange(tab.id)}
              variants={menuItemVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              transition={spring.base}
            >
              {isActive && (
                <motion.span
                  className={`${baseClassName}__highlight`}
                  layoutId={layoutId}
                  transition={spring.bouncy}
                />
              )}
              <span className={`${baseClassName}__label`}>{tab.label}</span>
            </motion.button>
          );
        })}

        <div
          className={`${baseClassName}__sentinel`}
          ref={endSentinelRef}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
