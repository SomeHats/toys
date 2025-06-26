import { assertExists } from "@/lib/assert";
import { TxdrawApp } from "@/txdraw/App";
import { createRoot } from "react-dom/client";

if (import.meta.hot) {
    import.meta.hot.on("vite:beforeUpdate", () => {
        window.location.reload();
    });
}

const root = assertExists(document.getElementById("root"));
createRoot(root).render(<TxdrawApp />);
