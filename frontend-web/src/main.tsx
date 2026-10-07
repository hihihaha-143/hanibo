import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeProvider";
import App from "./App";
import "./styles/main.scss";


import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/700.css";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
