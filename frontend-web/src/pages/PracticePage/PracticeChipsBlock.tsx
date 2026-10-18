import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { spring, menuItemVariants } from "../../lib/motion";
import type { PracticeTab, PracticeTabId } from "./practiceTabs";

interface PracticeChipsBlockProps {
  tabs: PracticeTab[];
  activeTab: PracticeTabId;
  onTabChange: (tabId: PracticeTabId) => void;
}

export default function PracticeChipsBlock({
  tabs,
  activeTab,
  onTabChange,
}: PracticeChipsBlockProps) {
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
    "practice-chips-block",
    showLeftFade ? "practice-chips-block--fade-left" : "",
    showRightFade ? "practice-chips-block--fade-right" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <div className="practice-chips-block__scroller" ref={scrollerRef}>
        <div
          className="practice-chips-block__sentinel"
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
                  ? "practice-chips-block__chip practice-chips-block__chip--active"
                  : "practice-chips-block__chip"
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
                  className="practice-chips-block__highlight"
                  layoutId="practice-chip-highlight"
                  transition={spring.bouncy}
                />
              )}
              <span className="practice-chips-block__label">{tab.label}</span>
            </motion.button>
          );
        })}

        <div
          className="practice-chips-block__sentinel"
          ref={endSentinelRef}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
