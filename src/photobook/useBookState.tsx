import {
    loadBookData,
    loadPhoto,
    saveBookData,
    savePhoto,
} from "@/photobook/storage";
import type {
    BookData,
    LayoutId,
    Page,
    PageId,
    PageSlot,
    PhotoId,
    PhotoMeta,
} from "@/photobook/types";
import {
    createDefaultBook,
    createDefaultSlots,
    newPageId,
    newPhotoId,
} from "@/photobook/types";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

interface BookState {
    book: BookData;
    loading: boolean;
    photoUrls: Map<PhotoId, string>;
    addPage: (layout: LayoutId) => void;
    removePage: (pageId: PageId) => void;
    movePage: (pageId: PageId, direction: "up" | "down") => void;
    updateSlot: (pageId: PageId, slotIndex: number, slot: PageSlot) => void;
    changeLayout: (pageId: PageId, layout: LayoutId) => void;
    addPhoto: (file: File) => Promise<PhotoId>;
    addPhotoFromBlob: (blob: Blob, filename: string) => Promise<PhotoId>;
    updateTitle: (title: string) => void;
}

const BookContext = createContext<BookState | null>(null);

export function useBookState(): BookState {
    const ctx = useContext(BookContext);
    if (!ctx) throw new Error("useBookState must be used within BookProvider");
    return ctx;
}

export function BookProvider({ children }: { children: ReactNode }) {
    const [book, setBook] = useState<BookData>(createDefaultBook);
    const [loading, setLoading] = useState(true);
    const [photoUrls, setPhotoUrls] = useState<Map<PhotoId, string>>(
        () => new Map(),
    );
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load on mount
    useEffect(() => {
        void loadBookData().then(async (data) => {
            setBook(data);

            // Load all photo blobs into object URLs
            const urls = new Map<PhotoId, string>();
            for (const photo of data.photos) {
                const blob = await loadPhoto(photo.id);
                if (blob) {
                    urls.set(photo.id, URL.createObjectURL(blob));
                }
            }
            setPhotoUrls(urls);
            setLoading(false);
        });
    }, []);

    // Auto-save with debounce
    const save = useCallback((data: BookData) => {
        setBook(data);
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            void saveBookData(data);
        }, 500);
    }, []);

    const addPage = useCallback(
        (layout: LayoutId) => {
            const page: Page = {
                id: newPageId(),
                layout,
                slots: createDefaultSlots(layout),
                backgroundColor: "#ffffff",
            };
            save({ ...book, pages: [...book.pages, page] });
        },
        [book, save],
    );

    const removePage = useCallback(
        (pageId: PageId) => {
            save({
                ...book,
                pages: book.pages.filter((p) => p.id !== pageId),
            });
        },
        [book, save],
    );

    const movePage = useCallback(
        (pageId: PageId, direction: "up" | "down") => {
            const pages = [...book.pages];
            const idx = pages.findIndex((p) => p.id === pageId);
            if (idx === -1) return;
            const targetIdx = direction === "up" ? idx - 1 : idx + 1;
            if (targetIdx < 0 || targetIdx >= pages.length) return;
            [pages[idx], pages[targetIdx]] = [pages[targetIdx], pages[idx]];
            save({ ...book, pages });
        },
        [book, save],
    );

    const updateSlot = useCallback(
        (pageId: PageId, slotIndex: number, slot: PageSlot) => {
            save({
                ...book,
                pages: book.pages.map((p) => {
                    if (p.id !== pageId) return p;
                    const slots = [...p.slots];
                    slots[slotIndex] = slot;
                    return { ...p, slots };
                }),
            });
        },
        [book, save],
    );

    const changeLayout = useCallback(
        (pageId: PageId, layout: LayoutId) => {
            save({
                ...book,
                pages: book.pages.map((p) => {
                    if (p.id !== pageId) return p;
                    return {
                        ...p,
                        layout,
                        slots: createDefaultSlots(layout),
                    };
                }),
            });
        },
        [book, save],
    );

    const addPhoto = useCallback(
        async (file: File): Promise<PhotoId> => {
            const id = newPhotoId();
            const blob = new Blob([await file.arrayBuffer()], {
                type: file.type,
            });

            // Get image dimensions
            const { width, height } = await getImageDimensions(blob);

            const meta: PhotoMeta = {
                id,
                filename: file.name,
                width,
                height,
                addedAt: Date.now(),
            };

            await savePhoto(id, blob);
            const url = URL.createObjectURL(blob);
            setPhotoUrls((prev) => {
                const next = new Map(prev);
                next.set(id, url);
                return next;
            });

            const newBook = {
                ...book,
                photos: [...book.photos, meta],
            };
            save(newBook);
            return id;
        },
        [book, save],
    );

    const addPhotoFromBlob = useCallback(
        async (blob: Blob, filename: string): Promise<PhotoId> => {
            const id = newPhotoId();
            const { width, height } = await getImageDimensions(blob);

            const meta: PhotoMeta = {
                id,
                filename,
                width,
                height,
                addedAt: Date.now(),
            };

            await savePhoto(id, blob);
            const url = URL.createObjectURL(blob);
            setPhotoUrls((prev) => {
                const next = new Map(prev);
                next.set(id, url);
                return next;
            });

            const newBook = {
                ...book,
                photos: [...book.photos, meta],
            };
            save(newBook);
            return id;
        },
        [book, save],
    );

    const updateTitle = useCallback(
        (title: string) => {
            save({ ...book, title });
        },
        [book, save],
    );

    return (
        <BookContext.Provider
            value={{
                book,
                loading,
                photoUrls,
                addPage,
                removePage,
                movePage,
                updateSlot,
                changeLayout,
                addPhoto,
                addPhotoFromBlob,
                updateTitle,
            }}
        >
            {children}
        </BookContext.Provider>
    );
}

function getImageDimensions(
    blob: Blob,
): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
            URL.revokeObjectURL(img.src);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
    });
}
