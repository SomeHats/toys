import { assertExists } from "@/lib/assert";
import { WiresAppRenderer } from "@/wires/WiresApp2";
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
        <WiresAppRenderer />
    </React.StrictMode>,
);
