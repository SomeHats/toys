import { useBookState } from "@/photobook/useBookState";
import type { PhotoId } from "@/photobook/types";
import classNames from "classnames";
import { useCallback, useRef } from "react";

export function PhotoPicker({
    onSelect,
    onClose,
}: {
    onSelect: (photoId: PhotoId) => void;
    onClose: () => void;
}) {
    const { book, photoUrls, addPhoto } = useBookState();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            void addPhoto(files[0]).then((id) => onSelect(id));
        },
        [addPhoto, onSelect],
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

                <div className="flex-1 overflow-auto p-5">
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

                    {book.photos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                            {book.photos.map((photo) => {
                                const url = photoUrls.get(photo.id);
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
