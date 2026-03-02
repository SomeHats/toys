import { ImportButton, useExportBook } from "@/photobook/ImportExport";
import { PageEditor } from "@/photobook/PageEditor";
import { PhotoSidebar } from "@/photobook/PhotoSidebar";
import { PrintView } from "@/photobook/PrintView";
import { clearAllData } from "@/photobook/storage";
import type { LayoutId } from "@/photobook/types";
import { LAYOUTS } from "@/photobook/types";
import { BookProvider, useBookState } from "@/photobook/useBookState";
import classNames from "classnames";
import { useState } from "react";

export function App() {
    return (
        <BookProvider>
            <Editor />
            <PrintView />
        </BookProvider>
    );
}

function Editor() {
    const { book, loading } = useBookState();
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const exportBook = useExportBook();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-stone-100">
                <p className="font-bold tracking-wide text-stone-400">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="editor-ui flex h-screen overflow-hidden bg-stone-100">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex">
                <PhotoSidebar />
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="z-40 h-14 shrink-0 border-b border-stone-200 bg-white/80 backdrop-blur-sm">
                    <div className="mx-auto flex h-full max-w-2xl items-center justify-between px-5">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 lg:hidden"
                                title="Photos"
                            >
                                <PhotosIcon />
                            </button>
                            <h1 className="text-lg font-bold tracking-wide text-stone-700">
                                {book.title}
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <ImportButton />
                            <HeaderButton onClick={() => void exportBook()}>
                                Export
                            </HeaderButton>
                            <HeaderButton
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            "Delete all pages and photos? This cannot be undone.",
                                        )
                                    ) {
                                        void clearAllData().then(() =>
                                            window.location.reload(),
                                        );
                                    }
                                }}
                            >
                                Clear
                            </HeaderButton>
                            <HeaderButton onClick={() => window.print()}>
                                Print / PDF
                            </HeaderButton>
                        </div>
                    </div>
                </header>

                {/* Page list — scrollable */}
                <main className="min-h-0 flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-2xl px-5 py-8">
                        {book.pages.length === 0 && <EmptyState />}

                        <div className="flex flex-col gap-8">
                            {book.pages.map((page, i) => (
                                <PageEditor
                                    key={page.id}
                                    page={page}
                                    pageIndex={i}
                                    totalPages={book.pages.length}
                                />
                            ))}
                        </div>

                        {/* Add page button */}
                        <div className="relative mt-8 flex justify-center">
                            <button
                                onClick={() => setShowAddMenu(!showAddMenu)}
                                className="group flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold tracking-wide text-stone-500 shadow-md ring-1 ring-stone-200 transition-all hover:shadow-lg hover:ring-stone-300"
                            >
                                <PlusIcon />
                                <span className="transition-transform duration-200 ease-out-back group-hover:scale-105">
                                    Add Page
                                </span>
                            </button>

                            {showAddMenu && (
                                <AddPageMenu
                                    onClose={() => setShowAddMenu(false)}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <PhotoSidebar onClose={() => setSidebarOpen(false)} />
                    <div
                        className="flex-1 bg-black/30"
                        onClick={() => setSidebarOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}

function AddPageMenu({ onClose }: { onClose: () => void }) {
    const { addPage } = useBookState();

    const handleAdd = (layout: LayoutId) => {
        addPage(layout);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-10" onClick={onClose} />
            <div className="absolute bottom-full z-20 mb-2 w-64 rounded-lg bg-white py-2 shadow-xl ring-1 ring-stone-200">
                {Object.entries(LAYOUTS).map(([id, layout]) => (
                    <button
                        key={id}
                        onClick={() => handleAdd(id as LayoutId)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-bold tracking-wide text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-800"
                    >
                        <LayoutThumbnail layoutId={id as LayoutId} />
                        {layout.name}
                    </button>
                ))}
            </div>
        </>
    );
}

function LayoutThumbnail({ layoutId }: { layoutId: LayoutId }) {
    const base = "h-8 w-8 rounded border border-stone-200 bg-stone-50 p-0.5";

    switch (layoutId) {
        case "cover":
            return (
                <div className={classNames(base, "flex flex-col")}>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="h-px w-3 bg-stone-300" />
                    </div>
                    <div className="h-[45%] rounded-sm bg-stone-300" />
                </div>
            );
        case "single-photo":
            return (
                <div className={classNames(base, "flex items-center p-1")}>
                    <div className="h-full w-full rounded-sm bg-stone-300" />
                </div>
            );
        case "two-photos-horizontal":
            return (
                <div className={classNames(base, "flex gap-0.5 p-1")}>
                    <div className="h-full flex-1 rounded-sm bg-stone-300" />
                    <div className="h-full flex-1 rounded-sm bg-stone-300" />
                </div>
            );
        case "two-photos-vertical":
            return (
                <div className={classNames(base, "flex flex-col gap-0.5 p-1")}>
                    <div className="w-full flex-1 rounded-sm bg-stone-300" />
                    <div className="w-full flex-1 rounded-sm bg-stone-300" />
                </div>
            );
        case "photo-with-journal":
            return (
                <div className={classNames(base, "flex flex-col gap-0.5 p-1")}>
                    <div className="h-[60%] w-full rounded-sm bg-stone-300" />
                    <div className="flex flex-1 items-center">
                        <div className="h-px w-full bg-stone-300" />
                    </div>
                </div>
            );
        case "journal-full":
            return (
                <div
                    className={classNames(
                        base,
                        "flex flex-col items-center justify-center gap-0.5 p-1.5",
                    )}
                >
                    <div className="h-px w-full bg-stone-300" />
                    <div className="h-px w-4/5 bg-stone-300" />
                    <div className="h-px w-full bg-stone-300" />
                </div>
            );
    }
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center py-20 text-center">
            <div className="mb-4 text-6xl text-stone-300">
                <BookIcon />
            </div>
            <h2 className="mb-2 text-xl font-bold tracking-wide text-stone-500">
                Start your photobook
            </h2>
            <p className="text-stone-400">
                Add your first page to begin creating your travel journal.
            </p>
        </div>
    );
}

function HeaderButton({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="group rounded-lg bg-stone-800 px-4 py-2 text-sm font-bold tracking-wide text-white transition-all hover:bg-stone-700"
        >
            <span className="inline-block transition-transform duration-200 ease-out-back group-hover:scale-105">
                {children}
            </span>
        </button>
    );
}

function PhotosIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

function BookIcon() {
    return (
        <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    );
}
