import { useState } from "react";
import { motion } from "framer-motion";
import SidebarNav from "./SidebarNav";
import SidebarBottom from "./SidebarBottom";
import { spring } from "../../../lib/motion";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      className="sidebar"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      animate={{ width: expanded ? 220 : 64 }}
      transition={spring.bouncy}
      initial={false}
    >
      <SidebarNav expanded={expanded} />
      <SidebarBottom expanded={expanded} />
    </motion.aside>
  );
}
