import React from "react";
import { createRoot } from "react-dom/client";
import { assertExists } from "@/lib/assert";
import { SplineTime } from "@/spline-time/SplineTime";

if (import.meta.hot) {
    import.meta.hot.on("vite:beforeUpdate", () => {
        window.location.reload();
    });
}

const root = assertExists(document.getElementById("root"));
createRoot(root).render(
    <React.StrictMode>
        <SplineTime />
    </React.StrictMode>,
);
