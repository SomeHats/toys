import { loadPhoto, saveBookData, savePhoto } from "@/photobook/storage";
import type { BookData, PhotoId } from "@/photobook/types";
import { BookDataSchema } from "@/photobook/types";
import { useBookState } from "@/photobook/useBookState";
import JSZip from "jszip";
import { useCallback, useRef } from "react";

export function useExportBook() {
    const { book } = useBookState();

    return useCallback(async () => {
        const zip = new JSZip();
        zip.file("book.json", JSON.stringify(book, null, 2));

        const photosFolder = zip.folder("photos")!;
        for (const photo of book.photos) {
            const blob = await loadPhoto(photo.id);
            if (blob) {
                photosFolder.file(photo.id, blob);
            }
        }

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${book.title || "photobook"}.photobook.zip`;
        a.click();
        URL.revokeObjectURL(url);
    }, [book]);
}

export function ImportButton() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImport = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const input = e.target;
            void (async () => {
                try {
                    const zip = await JSZip.loadAsync(file);
                    const bookJsonFile = zip.file("book.json");
                    if (!bookJsonFile) {
                        console.error("Invalid archive: missing book.json");
                        return;
                    }

                    const text = await bookJsonFile.async("string");
                    const json: unknown = JSON.parse(text);
                    const result = BookDataSchema.parse(json);
                    if (!result.ok) {
                        console.error(
                            "Invalid book data:",
                            result.error.toString(),
                        );
                        return;
                    }
                    const bookData = result.value as BookData;

                    const photosFolder = zip.folder("photos");
                    if (photosFolder) {
                        const photoFiles: JSZip.JSZipObject[] = [];
                        photosFolder.forEach((_path, file) => {
                            if (!file.dir) {
                                photoFiles.push(file);
                            }
                        });
                        for (const photoFile of photoFiles) {
                            const blob = await photoFile.async("blob");
                            const photoId = photoFile.name.replace(
                                "photos/",
                                "",
                            ) as PhotoId;
                            await savePhoto(photoId, blob);
                        }
                    }

                    await saveBookData(bookData);
                    window.location.reload();
                } catch (err) {
                    console.error("Import failed:", err);
                } finally {
                    input.value = "";
                }
            })();
        },
        [],
    );

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleImport}
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="group rounded-lg bg-stone-800 px-4 py-2 text-sm font-bold tracking-wide text-white transition-all hover:bg-stone-700"
            >
                <span className="inline-block transition-transform duration-200 ease-out-back group-hover:scale-105">
                    Import
                </span>
            </button>
        </>
    );
}
