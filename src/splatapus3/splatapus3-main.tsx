import { assertExists } from "@/lib/assert";
import { USE_REACT_STRICT_MODE } from "@/splatapus/constants";
import { App } from "@/splatapus3/App";
import React from "react";
import { createRoot } from "react-dom/client";

if (import.meta.hot) {
    import.meta.hot.on("vite:beforeUpdate", () => {
        window.location.reload();
    });
}

const root = assertExists(document.getElementById("root"));
createRoot(root).render(
    USE_REACT_STRICT_MODE ?
        <React.StrictMode>
            <App />
        </React.StrictMode>
    :   <App />,
);
