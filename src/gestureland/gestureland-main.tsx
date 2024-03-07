import { AppWrapper } from "@/gestureland/App";
import { assertExists } from "@/lib/assert";
import { createRoot } from "react-dom/client";

if (import.meta.hot) {
    import.meta.hot.on("vite:beforeUpdate", () => {
        window.location.reload();
    });
}

const root = assertExists(document.getElementById("root"));
createRoot(root).render(<AppWrapper />);
