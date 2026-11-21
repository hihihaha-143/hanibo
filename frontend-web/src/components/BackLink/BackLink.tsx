import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { spring } from "../../lib/motion";

const MotionLink = motion.create(Link);

interface BackLinkProps {
  to: string;
  children?: ReactNode;
}

export default function BackLink({ to, children = "Назад" }: BackLinkProps) {
  return (
    <MotionLink
      to={to}
      className="back-link"
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={spring.bouncy}
    >
      <ArrowLeft size={18} aria-hidden="true" />
      <span>{children}</span>
    </MotionLink>
  );
}
