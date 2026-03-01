import { assertExists } from "@/lib/assert";
import { App } from "@/photobook/App";
import React from "react";
import { createRoot } from "react-dom/client";

const root = assertExists(document.getElementById("root"));
createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
