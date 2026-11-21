import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { spring } from "../../lib/motion";
import { useAuth } from "../../context/useAuth";

const MotionLink = motion.create(Link);

export default function AuthPromptBlock() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || isAuthenticated) return null;

  return (
    <div className="auth-prompt-block">
      <p className="auth-prompt-block__text">
        Войдите или зарегистрируйтесь, чтобы отслеживать прогресс
      </p>
      <MotionLink
        to="/login"
        className="btn btn--accent btn--block auth-prompt-block__button"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={spring.bouncy}
      >
        <LogIn size={18} aria-hidden="true" />
        <span>Войти</span>
      </MotionLink>
    </div>
  );
}
