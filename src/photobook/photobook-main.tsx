import { assertExists } from "@/lib/assert";
import { App } from "@/photobook/App";
import { handleOAuthCallback } from "@/photobook/googlePhotos";
import React from "react";
import { createRoot } from "react-dom/client";

// If this page was opened as an OAuth callback popup, stash the token
// in localStorage and close. Don't render the app.
if (handleOAuthCallback()) {
    // window.close() was already attempted. If we're still here,
    // show a message so the user knows to close manually.
    document.body.textContent = "Sign-in complete — you can close this tab.";
} else {
    const root = assertExists(document.getElementById("root"));
    createRoot(root).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
}
