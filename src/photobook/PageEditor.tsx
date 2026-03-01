import { JournalEditor } from "@/photobook/JournalEditor";
import { PageRenderer } from "@/photobook/PageRenderer";
import { PhotoPicker } from "@/photobook/PhotoPicker";
import { useBookState } from "@/photobook/useBookState";
import type { LayoutId, Page, PhotoId } from "@/photobook/types";
import { LAYOUTS } from "@/photobook/types";
import classNames from "classnames";
import { useState } from "react";

export function PageEditor({
    page,
    pageIndex,
    totalPages,
}: {
    page: Page;
    pageIndex: number;
    totalPages: number;
}) {
    const { removePage, movePage, updateSlot, changeLayout } = useBookState();
    const [editingSlot, setEditingSlot] = useState<{
        index: number;
        type: "photo" | "journal";
    } | null>(null);

    const handleSlotClick = (slotIndex: number) => {
        const slot = page.slots[slotIndex];
        setEditingSlot({ index: slotIndex, type: slot.type });
    };

    const handlePhotoSelect = (photoId: PhotoId) => {
        if (editingSlot === null) return;
        updateSlot(page.id, editingSlot.index, {
            type: "photo",
            photoId,
        });
        setEditingSlot(null);
    };

    const handleJournalSave = (text: string) => {
        if (editingSlot === null) return;
        updateSlot(page.id, editingSlot.index, { type: "journal", text });
    };

    return (
        <div className="group">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold tracking-wide text-stone-400">
                    Page {pageIndex + 1}
                </span>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <LayoutSelector
                        current={page.layout}
                        onChange={(layout) => changeLayout(page.id, layout)}
                    />
                    <IconButton
                        onClick={() => movePage(page.id, "up")}
                        disabled={pageIndex === 0}
                        title="Move up"
                    >
                        <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => movePage(page.id, "down")}
                        disabled={pageIndex === totalPages - 1}
                        title="Move down"
                    >
                        <ArrowDownIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => removePage(page.id)}
                        title="Remove page"
                        danger
                    >
                        <TrashIcon />
                    </IconButton>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg shadow-md ring-1 ring-stone-200">
                <PageRenderer
                    page={page}
                    interactive
                    onSlotClick={handleSlotClick}
                />
            </div>

            {editingSlot?.type === "photo" && (
                <PhotoPicker
                    onSelect={handlePhotoSelect}
                    onClose={() => setEditingSlot(null)}
                />
            )}

            {editingSlot?.type === "journal" && (
                <JournalEditor
                    initialText={
                        (() => {
                            const slot = page.slots[editingSlot.index];
                            return slot.type === "journal" ? slot.text : "";
                        })()
                    }
                    onSave={handleJournalSave}
                    onClose={() => setEditingSlot(null)}
                />
            )}
        </div>
    );
}

function LayoutSelector({
    current,
    onChange,
}: {
    current: LayoutId;
    onChange: (layout: LayoutId) => void;
}) {
    return (
        <select
            value={current}
            onChange={(e) => onChange(e.target.value as LayoutId)}
            className="rounded border border-stone-200 bg-white px-2 py-1 text-xs font-bold tracking-wide text-stone-500 outline-none"
        >
            {Object.entries(LAYOUTS).map(([id, layout]) => (
                <option key={id} value={id}>
                    {layout.name}
                </option>
            ))}
        </select>
    );
}

function IconButton({
    children,
    onClick,
    disabled,
    title,
    danger,
}: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    title: string;
    danger?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={classNames(
                "rounded p-1 transition-colors disabled:opacity-30",
                danger ?
                    "text-stone-400 hover:bg-red-50 hover:text-red-500"
                :   "text-stone-400 hover:bg-stone-100 hover:text-stone-600",
            )}
        >
            {children}
        </button>
    );
}

function ArrowUpIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        >
            <polyline points="18 15 12 9 6 15" />
        </svg>
    );
}

function ArrowDownIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    );
}
