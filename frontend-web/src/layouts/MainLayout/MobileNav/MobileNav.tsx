import { useState } from "react";
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
      <MobileNavSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
