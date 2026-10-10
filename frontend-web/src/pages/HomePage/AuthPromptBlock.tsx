import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { spring } from "../../lib/motion";

const MotionLink = motion.create(Link);

export default function AuthPromptBlock() {
  return (
    <div className="auth-prompt-block">
      <p className="auth-prompt-block__text">
        Войдите или зарегистрируйтесь, чтобы отслеживать прогресс
      </p>
      <MotionLink
        to="/login"
        className="auth-prompt-block__button"
        whileHover={{ y: -1, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={spring.bouncy}
      >
        <LogIn size={18} />
        <span>Войти</span>
      </MotionLink>
    </div>
  );
}
