import { App } from "@/infinite-scroll/InfiniteScrollApp";
import { assertExists } from "@/lib/assert";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(assertExists(document.getElementById("root"))).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
