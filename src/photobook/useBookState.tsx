import {
    deletePhoto,
    loadBookData,
    loadPhoto,
    loadThumbnail,
    saveBookData,
    savePhoto,
    saveThumbnail,
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
import exifr from "exifr";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

interface BookState {
    book: BookData;
    loading: boolean;
    photoUrls: Map<PhotoId, string>;
    thumbUrls: Map<PhotoId, string>;
    addPage: (layout: LayoutId) => void;
    removePage: (pageId: PageId) => void;
    movePage: (pageId: PageId, direction: "up" | "down") => void;
    updateSlot: (pageId: PageId, slotIndex: number, slot: PageSlot) => void;
    changeLayout: (pageId: PageId, layout: LayoutId) => void;
    addPhoto: (file: File, takenAtOverride?: number | null) => Promise<PhotoId>;
    removePhoto: (photoId: PhotoId) => void;
    updateTitle: (title: string) => void;
    usedPhotoIds: Set<PhotoId>;
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
    const [thumbUrls, setThumbUrls] = useState<Map<PhotoId, string>>(
        () => new Map(),
    );
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load on mount
    useEffect(() => {
        void loadBookData().then(async (data) => {
            setBook(data);

            // Load thumbnails first for fast sidebar rendering,
            // then load full-res photos in the background.
            const thumbs = new Map<PhotoId, string>();
            const urls = new Map<PhotoId, string>();
            for (const photo of data.photos) {
                const thumb = await loadThumbnail(photo.id);
                if (thumb) {
                    thumbs.set(photo.id, URL.createObjectURL(thumb));
                }
            }
            setThumbUrls(thumbs);
            setLoading(false);

            for (const photo of data.photos) {
                const blob = await loadPhoto(photo.id);
                if (blob) {
                    urls.set(photo.id, URL.createObjectURL(blob));
                    // Generate missing thumbnails for photos imported before
                    // thumbnail support was added.
                    if (!thumbs.has(photo.id)) {
                        const thumbBlob = await generateThumbnail(blob);
                        thumbs.set(photo.id, URL.createObjectURL(thumbBlob));
                        void saveThumbnail(photo.id, thumbBlob);
                    }
                }
            }
            setPhotoUrls(new Map(urls));
            setThumbUrls(new Map(thumbs));
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
        async (
            file: File,
            takenAtOverride?: number | null,
        ): Promise<PhotoId> => {
            const id = newPhotoId();
            const blob = new Blob([await file.arrayBuffer()], {
                type: file.type,
            });

            const [{ width, height }, exifDate] = await Promise.all([
                getImageDimensions(blob),
                getExifDate(blob),
            ]);

            const meta: PhotoMeta = {
                id,
                filename: file.name,
                width,
                height,
                addedAt: Date.now(),
                takenAt: takenAtOverride ?? exifDate,
            };

            const [thumbBlob] = await Promise.all([
                generateThumbnail(blob),
                savePhoto(id, blob),
            ]);
            await saveThumbnail(id, thumbBlob);

            const url = URL.createObjectURL(blob);
            const thumbUrl = URL.createObjectURL(thumbBlob);
            setPhotoUrls((prev) => {
                const next = new Map(prev);
                next.set(id, url);
                return next;
            });
            setThumbUrls((prev) => {
                const next = new Map(prev);
                next.set(id, thumbUrl);
                return next;
            });

            // Use functional updater so sequential addPhoto calls
            // (e.g. bulk Google Photos import) accumulate correctly.
            let updatedBook: BookData;
            setBook((prev) => {
                updatedBook = {
                    ...prev,
                    photos: [...prev.photos, meta],
                };
                return updatedBook;
            });

            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            saveTimeoutRef.current = setTimeout(() => {
                void saveBookData(updatedBook!);
            }, 500);

            return id;
        },
        [],
    );

    const removePhoto = useCallback(
        (photoId: PhotoId) => {
            // Remove from book: drop from photos list, clear from any slots
            const updated: BookData = {
                ...book,
                photos: book.photos.filter((p) => p.id !== photoId),
                pages: book.pages.map((page) => ({
                    ...page,
                    slots: page.slots.map((slot) => {
                        if (slot.type === "photo" && slot.photoId === photoId) {
                            return { ...slot, photoId: null };
                        }
                        return slot;
                    }),
                })),
            };
            save(updated);

            // Revoke object URLs
            const photoUrl = photoUrls.get(photoId);
            const thumbUrl = thumbUrls.get(photoId);
            if (photoUrl) URL.revokeObjectURL(photoUrl);
            if (thumbUrl) URL.revokeObjectURL(thumbUrl);
            setPhotoUrls((prev) => {
                const next = new Map(prev);
                next.delete(photoId);
                return next;
            });
            setThumbUrls((prev) => {
                const next = new Map(prev);
                next.delete(photoId);
                return next;
            });

            // Delete from OPFS
            void deletePhoto(photoId);
        },
        [book, save, photoUrls, thumbUrls],
    );

    const usedPhotoIds = useMemo(() => {
        const ids = new Set<PhotoId>();
        for (const page of book.pages) {
            for (const slot of page.slots) {
                if (slot.type === "photo" && slot.photoId) {
                    ids.add(slot.photoId);
                }
            }
        }
        return ids;
    }, [book.pages]);

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
                thumbUrls,
                addPage,
                removePage,
                movePage,
                updateSlot,
                changeLayout,
                addPhoto,
                removePhoto,
                updateTitle,
                usedPhotoIds,
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

const THUMB_MAX_SIZE = 300;

function generateThumbnail(blob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const { naturalWidth: w, naturalHeight: h } = img;
            const scale = Math.min(THUMB_MAX_SIZE / w, THUMB_MAX_SIZE / h, 1);
            const tw = Math.round(w * scale);
            const th = Math.round(h * scale);

            const canvas = document.createElement("canvas");
            canvas.width = tw;
            canvas.height = th;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, tw, th);
            URL.revokeObjectURL(img.src);

            canvas.toBlob(
                (result) => {
                    if (result) resolve(result);
                    else reject(new Error("Failed to create thumbnail"));
                },
                "image/jpeg",
                0.8,
            );
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
    });
}

async function getExifDate(blob: Blob): Promise<number | null> {
    try {
        const exif = await exifr.parse(blob, ["DateTimeOriginal"]);
        if (exif?.DateTimeOriginal instanceof Date) {
            return exif.DateTimeOriginal.getTime();
        }
    } catch {
        // No EXIF or unreadable
    }
    return null;
}
