import { assertExists } from "@/lib/assert";
import { createRoot } from "react-dom/client";
import { App } from "@/adaptive-dither/App";

createRoot(assertExists(document.getElementById("root"))).render(<App />);
