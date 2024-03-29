import { assertExists } from "@/lib/assert";
import { LeafPatternApp } from "@/trees/LeafPattern";
import { TreesApp } from "@/trees/TreesApp";
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";

if (import.meta.hot) {
    import.meta.hot.on("vite:beforeUpdate", () => {
        window.location.reload();
    });
}

const router = createHashRouter([
    {
        path: "/patterns",
        element: <LeafPatternApp />,
    },
    {
        path: "*",
        element: <TreesApp />,
    },
]);

const root = assertExists(document.getElementById("root"));
createRoot(root).render(<RouterProvider router={router} />);
