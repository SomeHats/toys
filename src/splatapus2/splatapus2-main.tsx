import React from "react";
import { createRoot } from "react-dom/client";
import { assertExists } from "@/lib/assert";
import { App } from "@/splatapus2/App";
import { USE_REACT_STRICT_MODE } from "@/splatapus/constants";

if (import.meta.hot) {
    import.meta.hot.on("vite:beforeUpdate", () => {
        window.location.reload();
    });
}

const root = assertExists(document.getElementById("root"));
createRoot(root).render(
    USE_REACT_STRICT_MODE ? (
        <React.StrictMode>
            <App />
        </React.StrictMode>
    ) : (
        <App />
    ),
);
