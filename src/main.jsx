import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/manrope/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "@fontsource/instrument-serif/400-italic.css";
import App from "./App";
import "./styles/base.css";
import "./styles/sections.css";
import "./styles/preview.css";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
