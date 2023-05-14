import { assertExists } from "@/lib/assert";
import { PaletteApp } from "@/palette/PaletteApp";
import { SupportProvider } from "@/palette/support";
import React from "react";
import { createRoot } from "react-dom/client";

if (import.meta.hot) {
    import.meta.hot.on("vite:beforeUpdate", () => {
        window.location.reload();
    });
}

const root = assertExists(document.getElementById("root"));
createRoot(root).render(
    <React.StrictMode>
        <SupportProvider>
            <PaletteApp />
        </SupportProvider>
    </React.StrictMode>,
);
