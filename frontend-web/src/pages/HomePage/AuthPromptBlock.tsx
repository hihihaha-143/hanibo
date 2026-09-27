import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function AuthPromptBlock() {
  return (
    <div className="auth-prompt-block">
      <p className="auth-prompt-block__text">
        Войдите или зарегистрируйтесь, чтобы отслеживать прогресс
      </p>
      <Link to="/login" className="auth-prompt-block__button">
        <LogIn size={18} />
        <span>Войти</span>
      </Link>
    </div>
  );
}
