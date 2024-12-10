import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { WorkFlow } from "./App.tsx";
import "./api/mock/mock.ts"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WorkFlow />
  </React.StrictMode>
);
