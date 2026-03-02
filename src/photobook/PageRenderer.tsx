import type { LayoutId, Page, PageSlot, PhotoId } from "@/photobook/types";
import { useBookState } from "@/photobook/useBookState";
import classNames from "classnames";
import { ReactNode, useState } from "react";

const PHOTO_MIME_TYPE = "application/x-photobook-photo";

/**
 * Renders a page at its actual layout. Used both in the editor
 * preview and in the print output.
 */
export function PageRenderer({
    page,
    interactive,
    onSlotClick,
    onPhotoDrop,
}: {
    page: Page;
    interactive?: boolean;
    onSlotClick?: (slotIndex: number) => void;
    onPhotoDrop?: (slotIndex: number, photoId: PhotoId) => void;
}) {
    const layout = PAGE_LAYOUT_RENDERERS[page.layout];
    return (
        <div
            className="relative aspect-square w-full overflow-hidden bg-white"
            style={{ backgroundColor: page.backgroundColor }}
        >
            {layout(page.slots, interactive, onSlotClick, onPhotoDrop)}
        </div>
    );
}

type LayoutRenderer = (
    slots: PageSlot[],
    interactive?: boolean,
    onSlotClick?: (slotIndex: number) => void,
    onPhotoDrop?: (slotIndex: number, photoId: PhotoId) => void,
) => ReactNode;

const PAGE_LAYOUT_RENDERERS: Record<LayoutId, LayoutRenderer> = {
    cover: (slots, interactive, onSlotClick, onPhotoDrop) => (
        <div className="flex h-full w-full flex-col">
            {/* Title area */}
            <div className="flex flex-1 items-center justify-center p-12">
                <JournalSlot
                    slot={slots[0]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(0)}
                    className="text-center text-3xl leading-relaxed"
                />
            </div>
            {/* Photo strip at bottom */}
            <div className="h-[45%] w-full">
                <PhotoSlot
                    slot={slots[1]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(1)}
                    onDrop={(id) => onPhotoDrop?.(1, id)}
                />
            </div>
        </div>
    ),

    "single-photo": (slots, interactive, onSlotClick, onPhotoDrop) => (
        <div className="flex h-full w-full items-center justify-center p-8">
            <div className="h-full w-full">
                <PhotoSlot
                    slot={slots[0]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(0)}
                    onDrop={(id) => onPhotoDrop?.(0, id)}
                />
            </div>
        </div>
    ),

    "two-photos-horizontal": (slots, interactive, onSlotClick, onPhotoDrop) => (
        <div className="flex h-full w-full gap-3 p-8">
            <div className="h-full flex-1">
                <PhotoSlot
                    slot={slots[0]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(0)}
                    onDrop={(id) => onPhotoDrop?.(0, id)}
                />
            </div>
            <div className="h-full flex-1">
                <PhotoSlot
                    slot={slots[1]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(1)}
                    onDrop={(id) => onPhotoDrop?.(1, id)}
                />
            </div>
        </div>
    ),

    "two-photos-vertical": (slots, interactive, onSlotClick, onPhotoDrop) => (
        <div className="flex h-full w-full flex-col gap-3 p-8">
            <div className="w-full flex-1">
                <PhotoSlot
                    slot={slots[0]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(0)}
                    onDrop={(id) => onPhotoDrop?.(0, id)}
                />
            </div>
            <div className="w-full flex-1">
                <PhotoSlot
                    slot={slots[1]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(1)}
                    onDrop={(id) => onPhotoDrop?.(1, id)}
                />
            </div>
        </div>
    ),

    "photo-with-journal": (slots, interactive, onSlotClick, onPhotoDrop) => (
        <div className="flex h-full w-full flex-col">
            <div className="h-[60%] w-full p-8 pb-4">
                <PhotoSlot
                    slot={slots[0]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(0)}
                    onDrop={(id) => onPhotoDrop?.(0, id)}
                />
            </div>
            <div className="flex flex-1 items-start px-12 pb-8">
                <JournalSlot
                    slot={slots[1]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(1)}
                    className="text-lg leading-relaxed"
                />
            </div>
        </div>
    ),

    "journal-full": (slots, interactive, onSlotClick) => (
        <div className="flex h-full w-full items-center justify-center p-12">
            <JournalSlot
                slot={slots[0]}
                interactive={interactive}
                onClick={() => onSlotClick?.(0)}
                className="text-xl leading-loose"
            />
        </div>
    ),
};

function PhotoSlot({
    slot,
    interactive,
    onClick,
    onDrop: onDropProp,
}: {
    slot: PageSlot;
    interactive?: boolean;
    onClick?: () => void;
    onDrop?: (photoId: PhotoId) => void;
}) {
    const { photoUrls } = useBookState();
    const [dragOver, setDragOver] = useState(false);

    if (slot.type !== "photo") return null;

    const url = slot.photoId ? photoUrls.get(slot.photoId) : null;

    const handleDragOver = (e: React.DragEvent) => {
        if (!interactive || !onDropProp) return;
        if (e.dataTransfer.types.includes(PHOTO_MIME_TYPE)) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            setDragOver(true);
        }
    };

    const handleDragLeave = () => setDragOver(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (!interactive || !onDropProp) return;
        const photoId = e.dataTransfer.getData(PHOTO_MIME_TYPE) as PhotoId;
        if (photoId) {
            onDropProp(photoId);
        }
    };

    return (
        <div
            className={classNames(
                "relative h-full w-full overflow-hidden rounded-sm",
                interactive && "cursor-pointer",
                !url &&
                    !dragOver &&
                    "border-2 border-dashed border-stone-300 bg-stone-50",
                dragOver &&
                    "border-2 border-solid border-blue-400 bg-blue-50 ring-2 ring-blue-300",
            )}
            onClick={interactive ? onClick : undefined}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {url ?
                <img
                    src={url}
                    className="h-full w-full object-cover"
                    draggable={false}
                />
            :   <div className="flex h-full w-full items-center justify-center text-stone-400">
                    {dragOver ?
                        <DropHereIcon />
                    :   <PhotoPlaceholderIcon />}
                </div>
            }
        </div>
    );
}

function JournalSlot({
    slot,
    interactive,
    onClick,
    className,
}: {
    slot: PageSlot;
    interactive?: boolean;
    onClick?: () => void;
    className?: string;
}) {
    if (slot.type !== "journal") return null;

    const hasText = slot.text.trim().length > 0;

    return (
        <div
            className={classNames(
                "journal-text w-full whitespace-pre-wrap text-stone-700",
                className,
                interactive && "cursor-pointer",
                interactive &&
                    !hasText &&
                    "rounded border-2 border-dashed border-stone-300 p-4 text-center italic text-stone-400",
            )}
            onClick={interactive ? onClick : undefined}
        >
            {hasText ? slot.text : "Click to add journal text..."}
        </div>
    );
}

function PhotoPlaceholderIcon() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

function DropHereIcon() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-400"
        >
            <polyline points="8 12 12 16 16 12" />
            <line x1="12" y1="4" x2="12" y2="16" />
            <path d="M3 17v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
        </svg>
    );
}
