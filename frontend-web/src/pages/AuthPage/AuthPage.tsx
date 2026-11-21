import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";

interface AuthPageProps {
  title: string;
  generalError?: string;
  switchText: string;
  switchLinkTo: string;
  switchLinkLabel: string;
  children: ReactNode;
}

export default function AuthPage({
  title,
  generalError,
  switchText,
  switchLinkTo,
  switchLinkLabel,
  children,
}: AuthPageProps) {
  return (
    <main className="auth-page">
      <div className="auth-page__card">
        <div className="auth-page__logo">
          <img src={logo} alt="hanibo" />
        </div>

        <h1 className="auth-page__title">{title}</h1>

        {generalError && (
          <div className="auth-page__error-general" role="alert">
            {generalError}
          </div>
        )}

        {children}

        {(switchText || switchLinkLabel) && (
          <p className="auth-page__switch">
            {switchText} <Link to={switchLinkTo}>{switchLinkLabel}</Link>
          </p>
        )}
      </div>
    </main>
  );
}
