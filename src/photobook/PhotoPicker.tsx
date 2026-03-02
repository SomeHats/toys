import { GooglePhotosPicker } from "@/photobook/GooglePhotosPicker";
import type { PhotoId } from "@/photobook/types";
import { useBookState } from "@/photobook/useBookState";
import classNames from "classnames";
import { useCallback, useRef, useState } from "react";

export function PhotoPicker({
    onSelect,
    onClose,
}: {
    onSelect: (photoId: PhotoId) => void;
    onClose: () => void;
}) {
    const { book, photoUrls, addPhoto, addPhotoFromBlob } = useBookState();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showGooglePhotos, setShowGooglePhotos] = useState(false);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            void addPhoto(files[0]).then((id) => onSelect(id));
        },
        [addPhoto, onSelect],
    );

    const handleGoogleImport = useCallback(
        async (photos: { blob: Blob; filename: string }[]) => {
            let lastId: PhotoId | null = null;
            for (const { blob, filename } of photos) {
                lastId = await addPhotoFromBlob(blob, filename);
            }
            if (photos.length === 1 && lastId) {
                onSelect(lastId);
            } else {
                setShowGooglePhotos(false);
            }
        },
        [addPhotoFromBlob, onSelect],
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="mx-4 flex max-h-[80vh] w-full max-w-lg flex-col rounded-lg bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                    <h2 className="text-lg font-bold tracking-wide text-stone-700">
                        Choose Photo
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-stone-400 hover:text-stone-600"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="relative flex-1 overflow-auto p-5">
                    {showGooglePhotos ?
                        <GooglePhotosPicker
                            onImport={handleGoogleImport}
                            onBack={() => setShowGooglePhotos(false)}
                        />
                    :   <>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="mb-4 w-full rounded-lg border-2 border-dashed border-stone-300 p-6 text-center font-bold tracking-wide text-stone-400 transition-colors hover:border-stone-400 hover:text-stone-500"
                            >
                                Upload New Photo
                            </button>

                            <button
                                onClick={() => setShowGooglePhotos(true)}
                                className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-stone-300 p-6 text-center font-bold tracking-wide text-stone-400 transition-colors hover:border-stone-400 hover:text-stone-500"
                            >
                                <GooglePhotosButtonIcon />
                                Import from Google Photos
                            </button>

                            {book.photos.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {book.photos.map((photo) => {
                                        const url = photoUrls.get(photo.id);
                                        return (
                                            <button
                                                key={photo.id}
                                                onClick={() =>
                                                    onSelect(photo.id)
                                                }
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
                            )}
                        </>
                    }
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

function GooglePhotosButtonIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C9.8 2 8 3.8 8 6v6h4V2z" fill="#EA4335" />
            <path d="M22 12c0-2.2-1.8-4-4-4h-6v4h10z" fill="#4285F4" />
            <path d="M12 22c2.2 0 4-1.8 4-4v-6h-4v10z" fill="#34A853" />
            <path d="M2 12c0 2.2 1.8 4 4 4h6v-4H2z" fill="#FBBC05" />
        </svg>
    );
}
