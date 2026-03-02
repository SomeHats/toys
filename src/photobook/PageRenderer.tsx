import type { LayoutId, Page, PageSlot } from "@/photobook/types";
import { useBookState } from "@/photobook/useBookState";
import classNames from "classnames";
import { ReactNode } from "react";

/**
 * Renders a page at its actual layout. Used both in the editor
 * preview and in the print output.
 */
export function PageRenderer({
    page,
    interactive,
    onSlotClick,
}: {
    page: Page;
    interactive?: boolean;
    onSlotClick?: (slotIndex: number) => void;
}) {
    const layout = PAGE_LAYOUT_RENDERERS[page.layout];
    return (
        <div
            className="relative aspect-square w-full overflow-hidden bg-white"
            style={{ backgroundColor: page.backgroundColor }}
        >
            {layout(page.slots, interactive, onSlotClick)}
        </div>
    );
}

type LayoutRenderer = (
    slots: PageSlot[],
    interactive?: boolean,
    onSlotClick?: (slotIndex: number) => void,
) => ReactNode;

const PAGE_LAYOUT_RENDERERS: Record<LayoutId, LayoutRenderer> = {
    cover: (slots, interactive, onSlotClick) => (
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
                />
            </div>
        </div>
    ),

    "single-photo": (slots, interactive, onSlotClick) => (
        <div className="flex h-full w-full items-center justify-center p-8">
            <div className="h-full w-full">
                <PhotoSlot
                    slot={slots[0]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(0)}
                />
            </div>
        </div>
    ),

    "two-photos-horizontal": (slots, interactive, onSlotClick) => (
        <div className="flex h-full w-full gap-3 p-8">
            <div className="h-full flex-1">
                <PhotoSlot
                    slot={slots[0]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(0)}
                />
            </div>
            <div className="h-full flex-1">
                <PhotoSlot
                    slot={slots[1]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(1)}
                />
            </div>
        </div>
    ),

    "two-photos-vertical": (slots, interactive, onSlotClick) => (
        <div className="flex h-full w-full flex-col gap-3 p-8">
            <div className="w-full flex-1">
                <PhotoSlot
                    slot={slots[0]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(0)}
                />
            </div>
            <div className="w-full flex-1">
                <PhotoSlot
                    slot={slots[1]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(1)}
                />
            </div>
        </div>
    ),

    "photo-with-journal": (slots, interactive, onSlotClick) => (
        <div className="flex h-full w-full flex-col">
            <div className="h-[60%] w-full p-8 pb-4">
                <PhotoSlot
                    slot={slots[0]}
                    interactive={interactive}
                    onClick={() => onSlotClick?.(0)}
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
}: {
    slot: PageSlot;
    interactive?: boolean;
    onClick?: () => void;
}) {
    const { photoUrls } = useBookState();

    if (slot.type !== "photo") return null;

    const url = slot.photoId ? photoUrls.get(slot.photoId) : null;

    return (
        <div
            className={classNames(
                "relative h-full w-full overflow-hidden rounded-sm",
                interactive && "cursor-pointer",
                !url && "border-2 border-dashed border-stone-300 bg-stone-50",
            )}
            onClick={interactive ? onClick : undefined}
        >
            {url ?
                <img
                    src={url}
                    className="h-full w-full object-cover"
                    draggable={false}
                />
            :   <div className="flex h-full w-full items-center justify-center text-stone-400">
                    <PhotoPlaceholderIcon />
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
