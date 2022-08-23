import React from "react";
import { createRoot } from "react-dom/client";
import { assertExists } from "@/lib/assert";
import { App } from "@/splatapus/App";
import { USE_REACT_STRICT_MODE } from "@/splatapus/constants";

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
