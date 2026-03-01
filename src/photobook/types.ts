export type PhotoId = string & { __brand: "PhotoId" };
export type PageId = string & { __brand: "PageId" };

export function newPhotoId(): PhotoId {
    return crypto.randomUUID() as PhotoId;
}

export function newPageId(): PageId {
    return crypto.randomUUID() as PageId;
}

export interface PhotoMeta {
    id: PhotoId;
    filename: string;
    width: number;
    height: number;
    addedAt: number;
}

/**
 * A slot within a layout that can hold a photo or journal text.
 */
export type PageSlot =
    | { type: "photo"; photoId: PhotoId | null }
    | { type: "journal"; text: string };

export type LayoutId =
    | "single-photo"
    | "two-photos-horizontal"
    | "two-photos-vertical"
    | "photo-with-journal"
    | "journal-full"
    | "cover";

export interface Page {
    id: PageId;
    layout: LayoutId;
    slots: PageSlot[];
    backgroundColor: string;
}

export interface BookData {
    title: string;
    pages: Page[];
    photos: PhotoMeta[];
}

export const LAYOUTS: Record<
    LayoutId,
    { name: string; slots: { type: "photo" | "journal" }[] }
> = {
    cover: {
        name: "Cover",
        slots: [{ type: "journal" }, { type: "photo" }],
    },
    "single-photo": {
        name: "Single Photo",
        slots: [{ type: "photo" }],
    },
    "two-photos-horizontal": {
        name: "Two Photos (Side by Side)",
        slots: [{ type: "photo" }, { type: "photo" }],
    },
    "two-photos-vertical": {
        name: "Two Photos (Stacked)",
        slots: [{ type: "photo" }, { type: "photo" }],
    },
    "photo-with-journal": {
        name: "Photo + Journal",
        slots: [{ type: "photo" }, { type: "journal" }],
    },
    "journal-full": {
        name: "Full Journal",
        slots: [{ type: "journal" }],
    },
};

export function createDefaultSlots(layoutId: LayoutId): PageSlot[] {
    const layout = LAYOUTS[layoutId];
    return layout.slots.map((slot) => {
        if (slot.type === "photo") {
            return { type: "photo", photoId: null };
        }
        return { type: "journal", text: "" };
    });
}

export function createDefaultBook(): BookData {
    return {
        title: "New Zealand",
        pages: [],
        photos: [],
    };
}
