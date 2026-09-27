import { useState } from "react";
import SidebarNav from "./SidebarNav";
import SidebarBottom from "./SidebarBottom";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const handleMouseEnter = () => setExpanded(true);
  const handleMouseLeave = () => setExpanded(false);

  return (
    <aside
      className={`sidebar${expanded ? " sidebar--expanded" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarNav expanded={expanded} />
      <SidebarBottom expanded={expanded} />
    </aside>
  );
}
