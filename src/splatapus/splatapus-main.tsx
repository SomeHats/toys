import React from "react";
import { createRoot } from "react-dom/client";
import { assertExists } from "../lib/assert";
import { App } from "./App";

const root = assertExists(document.getElementById("root"));
createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
