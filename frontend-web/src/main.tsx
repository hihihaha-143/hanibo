import { createRoot } from "react-dom/client";
import "./lib/pdf";
import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider } from "./context/AuthProvider";
import App from "./App";
import "./styles/main.scss";

import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/700.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>,
);
