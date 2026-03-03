import type { PhotoId, PhotoMeta } from "@/photobook/types";
import { useBookState } from "@/photobook/useBookState";
import classNames from "classnames";
import { useMemo } from "react";

function byTakenDate(a: PhotoMeta, b: PhotoMeta) {
    return (a.takenAt ?? a.addedAt) - (b.takenAt ?? b.addedAt);
}

export function SlotPhotoPicker({
    onSelect,
    onClose,
}: {
    onSelect: (photoId: PhotoId) => void;
    onClose: () => void;
}) {
    const { book, thumbUrls, usedPhotoIds } = useBookState();

    const unused = useMemo(
        () =>
            book.photos
                .filter((p) => !usedPhotoIds.has(p.id))
                .sort(byTakenDate),
        [book.photos, usedPhotoIds],
    );
    const used = useMemo(
        () =>
            book.photos.filter((p) => usedPhotoIds.has(p.id)).sort(byTakenDate),
        [book.photos, usedPhotoIds],
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="mx-4 flex max-h-[70vh] w-full max-w-md flex-col rounded-lg bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                    <h2 className="text-lg font-bold tracking-wide text-stone-700">
                        Select Photo
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-stone-400 hover:text-stone-600"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-5">
                    {book.photos.length === 0 && (
                        <p className="py-8 text-center text-sm text-stone-400">
                            No photos imported yet. Add photos using the
                            sidebar.
                        </p>
                    )}

                    {unused.length > 0 && (
                        <>
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                                Available
                            </p>
                            <div className="mb-4 grid grid-cols-3 gap-2">
                                {unused.map((photo) => {
                                    const url = thumbUrls.get(photo.id);
                                    return (
                                        <button
                                            key={photo.id}
                                            onClick={() => onSelect(photo.id)}
                                            className={classNames(
                                                "group relative aspect-square overflow-hidden rounded",
                                                "ring-2 ring-transparent transition-all hover:ring-stone-400",
                                            )}
                                        >
                                            {url && (
                                                <img
                                                    src={url}
                                                    className="h-full w-full object-cover transition-transform duration-200 ease-out-back group-hover:scale-105"
                                                    draggable={false}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {used.length > 0 && (
                        <>
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                                Already used
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {used.map((photo) => {
                                    const url = thumbUrls.get(photo.id);
                                    return (
                                        <button
                                            key={photo.id}
                                            onClick={() => onSelect(photo.id)}
                                            className={classNames(
                                                "group relative aspect-square overflow-hidden rounded opacity-60",
                                                "ring-2 ring-transparent transition-all hover:opacity-100 hover:ring-stone-400",
                                            )}
                                        >
                                            {url && (
                                                <img
                                                    src={url}
                                                    className="h-full w-full object-cover transition-transform duration-200 ease-out-back group-hover:scale-105"
                                                    draggable={false}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function CloseIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
