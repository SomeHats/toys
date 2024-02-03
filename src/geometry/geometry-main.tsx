import { Entry, GeometryApp } from "@/geometry/GeometryApp";
import { TickerProvider } from "@/lib/Ticker";
import { assertExists } from "@/lib/assert";
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";

if (import.meta.hot) {
    import.meta.hot.on("vite:beforeUpdate", () => {
        window.location.reload();
    });
}

const pages = import.meta.glob("./experiments/*.tsx", { eager: true });

const entries = Object.entries(pages).map(
    ([path, page]: [string, any]): Entry => {
        const id = path.slice("./experiments/".length, -".tsx".length);
        return {
            id,
            component: page.default as React.FC,
            name: (page.name as string) || id,
        };
    },
);

console.log(entries);

const router = createHashRouter([
    ...entries.map((entry) => ({
        path: `/${entry.id}`,
        element: <GeometryApp entries={entries} current={entry} />,
    })),
    {
        path: "*",
        element: <GeometryApp entries={entries} current={entries[0]} />,
    },
]);

const root = assertExists(document.getElementById("root"));
createRoot(root).render(
    <TickerProvider>
        <RouterProvider router={router} />
    </TickerProvider>,
);
