import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import MobileNavBar from "./MobileNavBar";
import MobileNavSheet from "./MobileNavSheet";

export default function MobileNav() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <MobileNavBar
        sheetOpen={sheetOpen}
        onToggleSheet={() => setSheetOpen((v) => !v)}
      />
      <AnimatePresence>
        {sheetOpen && (
          <MobileNavSheet
            key="mobile-nav-sheet"
            onClose={() => setSheetOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
