import { App } from "@/adaptive-dither/App";
import { assertExists } from "@/lib/assert";
import { createRoot } from "react-dom/client";

createRoot(assertExists(document.getElementById("root"))).render(<App />);
