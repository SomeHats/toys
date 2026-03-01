import type { BookData, PhotoId } from "@/photobook/types";
import { createDefaultBook } from "@/photobook/types";

const BOOK_DATA_FILE = "book.json";
const PHOTOS_DIR = "photos";

async function getRoot(): Promise<FileSystemDirectoryHandle> {
    return await navigator.storage.getDirectory();
}

async function getPhotosDir(): Promise<FileSystemDirectoryHandle> {
    const root = await getRoot();
    return await root.getDirectoryHandle(PHOTOS_DIR, { create: true });
}

// --- Book Data ---

export async function loadBookData(): Promise<BookData> {
    try {
        const root = await getRoot();
        const fileHandle = await root.getFileHandle(BOOK_DATA_FILE);
        const file = await fileHandle.getFile();
        const text = await file.text();
        return JSON.parse(text) as BookData;
    } catch {
        return createDefaultBook();
    }
}

export async function saveBookData(data: BookData): Promise<void> {
    const root = await getRoot();
    const fileHandle = await root.getFileHandle(BOOK_DATA_FILE, {
        create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(data));
    await writable.close();
}

// --- Photo Files ---

export async function savePhoto(id: PhotoId, blob: Blob): Promise<void> {
    const dir = await getPhotosDir();
    const fileHandle = await dir.getFileHandle(id, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
}

export async function loadPhoto(id: PhotoId): Promise<Blob | null> {
    try {
        const dir = await getPhotosDir();
        const fileHandle = await dir.getFileHandle(id);
        return await fileHandle.getFile();
    } catch {
        return null;
    }
}

export async function deletePhoto(id: PhotoId): Promise<void> {
    try {
        const dir = await getPhotosDir();
        await dir.removeEntry(id);
    } catch {
        // already gone
    }
}
