import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ReactGPT } from "./ReactGPT";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactGPT />
  </StrictMode>
);
