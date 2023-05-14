import { assertExists } from "@/lib/assert";
import { CatApp } from "@/webgl/CatApp";
import { createRoot } from "react-dom/client";

createRoot(assertExists(document.getElementById("root"))).render(<CatApp />);
