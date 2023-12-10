import { assertExists } from "@/lib/assert";
import { TreesApp } from "@/trees/TreesApp";
import { createRoot } from "react-dom/client";

const root = assertExists(document.getElementById("root"));
createRoot(root).render(<TreesApp />);
