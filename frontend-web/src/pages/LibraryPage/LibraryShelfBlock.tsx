import { useEffect, useRef, useState } from "react";

interface Shelf {
  top: number;
  left: number;
  width: number;
}

const SHELF_OVERFLOW = 16; // на сколько полка выходит за карточки слева/справа

export default function LibraryShelfBlock() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const wrap = document.querySelector<HTMLElement>(
      ".library-page__grid-wrap",
    );
    if (!wrap) return;

    const measure = () => {
      const grid = wrap.querySelector<HTMLElement>(".library-grid-block");
      if (!grid) {
        setShelves([]);
        return;
      }

      const cards = Array.from(
        grid.querySelectorAll<HTMLElement>(".library-card-block"),
      );
      if (cards.length === 0) {
        setShelves([]);
        return;
      }

      const gridRect = grid.getBoundingClientRect();
      const rowsMap = new Map<number, HTMLElement[]>();

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const top = Math.round(rect.top - gridRect.top);
        if (!rowsMap.has(top)) rowsMap.set(top, []);
        rowsMap.get(top)!.push(card);
      });

      const next: Shelf[] = [];
      rowsMap.forEach((rowCards, top) => {
        const first = rowCards[0].getBoundingClientRect();
        const last = rowCards[rowCards.length - 1].getBoundingClientRect();
        next.push({
          top: top + rowCards[0].offsetHeight,
          left: first.left - gridRect.left - SHELF_OVERFLOW,
          width: last.right - first.left + SHELF_OVERFLOW * 2,
        });
      });

      setShelves(next);
    };

    const schedule = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measure);
    };

    schedule();

    const ro = new ResizeObserver(schedule);
    ro.observe(wrap);

    const mo = new MutationObserver(schedule);
    mo.observe(wrap, { childList: true, subtree: true });

    window.addEventListener("resize", schedule);

    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", schedule);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (shelves.length === 0) return null;

  return (
    <div className="library-shelf-block" aria-hidden="true">
      {shelves.map((s, i) => (
        <div
          key={i}
          className="library-shelf-block__shelf"
          style={{
            top: `${s.top}px`,
            left: `${s.left}px`,
            width: `${s.width}px`,
          }}
        />
      ))}
    </div>
  );
}
