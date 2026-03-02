import { getGoogleClientId } from "@/photobook/googlePhotos";
import { GooglePhotosImport } from "@/photobook/GooglePhotosImport";
import { GooglePhotosSetup } from "@/photobook/GooglePhotosSetup";
import { useBookState } from "@/photobook/useBookState";
import classNames from "classnames";
import { useCallback, useRef, useState } from "react";

const PHOTO_MIME_TYPE = "application/x-photobook-photo";

export function PhotoSidebar({ onClose }: { onClose?: () => void }) {
    const { book, photoUrls, usedPhotoIds, addPhoto } = useBookState();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [googleModal, setGoogleModal] = useState<
        "none" | "setup" | "import"
    >("none");

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files) return;
            const input = e.target;
            void (async () => {
                for (const file of Array.from(files)) {
                    await addPhoto(file);
                }
                // Reset so the same files can be re-selected
                input.value = "";
            })();
        },
        [addPhoto],
    );

    const handleGooglePhotos = useCallback(() => {
        if (getGoogleClientId()) {
            setGoogleModal("import");
        } else {
            setGoogleModal("setup");
        }
    }, []);

    return (
        <>
            <div className="flex h-full w-72 flex-col border-r border-stone-200 bg-white">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
                    <h2 className="text-sm font-bold tracking-wide text-stone-600">
                        Photos
                        {book.photos.length > 0 && (
                            <span className="ml-1.5 text-stone-400">
                                {book.photos.length}
                            </span>
                        )}
                    </h2>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-stone-400 hover:text-stone-600 lg:hidden"
                        >
                            <CloseIcon />
                        </button>
                    )}
                </div>

                {/* Import buttons */}
                <div className="flex gap-2 border-b border-stone-200 px-3 py-3">
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
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-stone-100 px-3 py-2 text-xs font-bold tracking-wide text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-600"
                    >
                        <UploadIcon />
                        Upload
                    </button>
                    <button
                        onClick={handleGooglePhotos}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-blue-50 px-3 py-2 text-xs font-bold tracking-wide text-blue-500 transition-colors hover:bg-blue-100 hover:text-blue-600"
                    >
                        <GoogleIcon />
                        Google
                    </button>
                </div>

                {/* Photo grid */}
                <div className="flex-1 overflow-y-auto p-3">
                    {book.photos.length === 0 ?
                        <div className="flex flex-col items-center py-12 text-center">
                            <div className="mb-2 text-stone-300">
                                <PhotoPlaceholderIcon />
                            </div>
                            <p className="text-xs text-stone-400">
                                Import photos to get started
                            </p>
                        </div>
                    :   <div className="grid grid-cols-3 gap-2">
                            {book.photos.map((photo) => {
                                const url = photoUrls.get(photo.id);
                                const used = usedPhotoIds.has(photo.id);
                                return (
                                    <div
                                        key={photo.id}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData(
                                                PHOTO_MIME_TYPE,
                                                photo.id,
                                            );
                                            e.dataTransfer.effectAllowed =
                                                "copy";
                                        }}
                                        className={classNames(
                                            "group relative aspect-square cursor-grab overflow-hidden rounded",
                                            "ring-1 ring-stone-200 transition-all hover:ring-2 hover:ring-stone-400",
                                            "active:cursor-grabbing",
                                        )}
                                    >
                                        {url && (
                                            <img
                                                src={url}
                                                className="h-full w-full object-cover"
                                                draggable={false}
                                            />
                                        )}
                                        {used && (
                                            <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow-sm">
                                                <CheckIcon />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    }
                </div>
            </div>

            {googleModal === "setup" && (
                <GooglePhotosSetup
                    onComplete={() => setGoogleModal("import")}
                    onClose={() => setGoogleModal("none")}
                />
            )}

            {googleModal === "import" && (
                <GooglePhotosImport
                    onClose={() => setGoogleModal("none")}
                />
            )}
        </>
    );
}

function CloseIcon() {
    return (
        <svg
            width="18"
            height="18"
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

function UploadIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
    );
}

function GoogleIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function PhotoPlaceholderIcon() {
    return (
        <svg
            width="40"
            height="40"
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
