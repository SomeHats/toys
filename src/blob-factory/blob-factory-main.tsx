import { BlobFactoryRenderer } from "@/blob-factory/BlobFactory";
import { assertExists } from "@/lib/assert";
import { sizeFromContentRect, useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { useState } from "react";
import { createRoot } from "react-dom/client";

createRoot(assertExists(document.getElementById("root"))).render(<App />);

function App() {
    const [container, setContainer] = useState<Element | null>(null);
    const size = useResizeObserver(container, sizeFromContentRect);

    return (
        <div ref={setContainer} className="absolute inset-0 touch-none">
            {size && <BlobFactoryRenderer size={size} />}
        </div>
    );
}
