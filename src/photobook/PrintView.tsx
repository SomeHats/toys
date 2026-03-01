import { PageRenderer } from "@/photobook/PageRenderer";
import { useBookState } from "@/photobook/useBookState";

/**
 * The print view renders all pages at print size with no UI chrome.
 * It's hidden on screen and only appears when printing via CSS.
 */
export function PrintView() {
    const { book } = useBookState();

    return (
        <div className="print-view hidden">
            {book.pages.map((page) => (
                <div key={page.id} className="print-page">
                    <PageRenderer page={page} />
                </div>
            ))}
        </div>
    );
}
