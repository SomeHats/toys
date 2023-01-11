import React from "react";
import { createRoot } from "react-dom/client";
import { assertExists } from "@/lib/assert";
import { WiresApp } from "@/wires/WiresApp";

if (import.meta.hot) {
    import.meta.hot.on("vite:beforeUpdate", () => {
        window.location.reload();
    });
}

const root = assertExists(document.getElementById("root"));
createRoot(root).render(
    <React.StrictMode>
        <WiresApp />
    </React.StrictMode>,
);
