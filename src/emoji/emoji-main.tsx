import { EmojiListing } from "@/emoji/EmojiListing";
import { PostDemo } from "@/emoji/PostDemo";
import { assertExists } from "@/lib/assert";
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";

const router = createHashRouter([
    {
        path: "/emoji",
        element: <EmojiListing />,
    },
    {
        path: "*",
        element: <PostDemo />,
    },
]);
console.log(router);

const root = assertExists(document.getElementById("root"));
createRoot(root).render(<RouterProvider router={router} />);
