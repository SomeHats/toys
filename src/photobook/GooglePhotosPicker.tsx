import type {
    GooglePhotosAlbum,
    GooglePhotosMediaItem,
} from "@/photobook/googlePhotosApi";
import {
    clearAuth,
    clearGoogleClientId,
    downloadPhotoBlob,
    getGoogleClientId,
    isAuthenticated,
    listAlbumMediaItems,
    listAlbums,
    listRecentMediaItems,
    requestAccessToken,
    setGoogleClientId,
} from "@/photobook/googlePhotosApi";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";

type PickerView =
    | { type: "setup" }
    | { type: "auth"; error?: string }
    | { type: "albums" }
    | { type: "photos"; albumId: string | null; albumTitle: string };

export function GooglePhotosPicker({
    onImport,
    onBack,
}: {
    onImport: (
        photos: { blob: Blob; filename: string }[],
    ) => Promise<void>;
    onBack: () => void;
}) {
    const [view, setView] = useState<PickerView>(() => {
        if (!getGoogleClientId()) return { type: "setup" };
        if (!isAuthenticated()) return { type: "auth" };
        return { type: "albums" };
    });

    if (view.type === "setup") {
        return (
            <ClientIdSetup
                onSaved={() => setView({ type: "auth" })}
                onBack={onBack}
            />
        );
    }

    if (view.type === "auth") {
        return (
            <AuthPrompt
                error={view.error}
                onAuthenticated={() => setView({ type: "albums" })}
                onBack={onBack}
                onResetClientId={() => {
                    clearGoogleClientId();
                    clearAuth();
                    setView({ type: "setup" });
                }}
            />
        );
    }

    if (view.type === "albums") {
        return (
            <AlbumListView
                onSelectAlbum={(albumId, albumTitle) =>
                    setView({ type: "photos", albumId, albumTitle })
                }
                onBack={onBack}
                onAuthError={() =>
                    setView({
                        type: "auth",
                        error: "Session expired. Please sign in again.",
                    })
                }
            />
        );
    }

    return (
        <PhotoGridView
            albumId={view.albumId}
            albumTitle={view.albumTitle}
            onImport={onImport}
            onBack={() => setView({ type: "albums" })}
            onAuthError={() =>
                setView({
                    type: "auth",
                    error: "Session expired. Please sign in again.",
                })
            }
        />
    );
}

// --- Client ID Setup ---

function ClientIdSetup({
    onSaved,
    onBack,
}: {
    onSaved: () => void;
    onBack: () => void;
}) {
    const [clientId, setClientId] = useState("");

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={onBack}
                    className="text-stone-400 hover:text-stone-600"
                >
                    <BackIcon />
                </button>
                <h3 className="font-bold tracking-wide text-stone-700">
                    Connect Google Photos
                </h3>
            </div>
            <p className="text-sm leading-relaxed text-stone-500">
                To import from Google Photos, you need a Google Cloud
                OAuth Client ID. Create one in the{" "}
                <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                >
                    Google Cloud Console
                </a>{" "}
                with the Photos Library API enabled.
            </p>
            <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="your-client-id.apps.googleusercontent.com"
                className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-700 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-400"
            />
            <button
                onClick={() => {
                    const trimmed = clientId.trim();
                    if (!trimmed) return;
                    setGoogleClientId(trimmed);
                    onSaved();
                }}
                disabled={!clientId.trim()}
                className="rounded-lg bg-stone-800 px-5 py-2.5 font-bold tracking-wide text-white transition-all hover:bg-stone-700 disabled:bg-stone-300"
            >
                Save & Continue
            </button>
        </div>
    );
}

// --- Auth Prompt ---

function AuthPrompt({
    error,
    onAuthenticated,
    onBack,
    onResetClientId,
}: {
    error?: string;
    onAuthenticated: () => void;
    onBack: () => void;
    onResetClientId: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(
        error ?? null,
    );

    const handleAuth = useCallback(async () => {
        setLoading(true);
        setAuthError(null);
        try {
            await requestAccessToken();
            onAuthenticated();
        } catch (e) {
            setAuthError(
                e instanceof Error ? e.message : "Authentication failed",
            );
        } finally {
            setLoading(false);
        }
    }, [onAuthenticated]);

    return (
        <div className="flex flex-col items-center gap-4 py-8">
            <div className="absolute left-0 top-0 flex w-full items-center gap-2 p-5">
                <button
                    onClick={onBack}
                    className="text-stone-400 hover:text-stone-600"
                >
                    <BackIcon />
                </button>
            </div>
            <GooglePhotosIcon size={48} />
            <h3 className="font-bold tracking-wide text-stone-700">
                Google Photos
            </h3>
            <p className="text-center text-sm text-stone-500">
                Sign in to browse and import your photos.
            </p>
            {authError && (
                <p className="text-center text-sm text-red-500">
                    {authError}
                </p>
            )}
            <button
                onClick={() => void handleAuth()}
                disabled={loading}
                className="group rounded-lg bg-stone-800 px-5 py-2.5 font-bold tracking-wide text-white transition-all hover:bg-stone-700 disabled:bg-stone-400"
            >
                <span className="inline-block transition-transform duration-200 ease-out-back group-hover:scale-105">
                    {loading ? "Connecting..." : "Connect Google Photos"}
                </span>
            </button>
            <button
                onClick={onResetClientId}
                className="text-xs text-stone-400 hover:text-stone-500"
            >
                Change Client ID
            </button>
        </div>
    );
}

// --- Album List View ---

function AlbumListView({
    onSelectAlbum,
    onBack,
    onAuthError,
}: {
    onSelectAlbum: (
        albumId: string | null,
        albumTitle: string,
    ) => void;
    onBack: () => void;
    onAuthError: () => void;
}) {
    const [albums, setAlbums] = useState<GooglePhotosAlbum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nextPageToken, setNextPageToken] = useState<
        string | undefined
    >();

    const fetchAlbums = useCallback(
        async (pageToken?: string) => {
            setLoading(true);
            setError(null);
            try {
                const result = await listAlbums(pageToken);
                setAlbums((prev) =>
                    pageToken ?
                        [...prev, ...(result.albums ?? [])]
                    :   (result.albums ?? []),
                );
                setNextPageToken(result.nextPageToken);
            } catch (e) {
                if (
                    e instanceof Error &&
                    e.message.includes("Auth error")
                ) {
                    onAuthError();
                    return;
                }
                setError(
                    e instanceof Error ?
                        e.message
                    :   "Failed to load albums",
                );
            } finally {
                setLoading(false);
            }
        },
        [onAuthError],
    );

    useEffect(() => {
        void fetchAlbums();
    }, [fetchAlbums]);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <button
                    onClick={onBack}
                    className="text-stone-400 hover:text-stone-600"
                >
                    <BackIcon />
                </button>
                <h3 className="font-bold tracking-wide text-stone-700">
                    Google Photos
                </h3>
            </div>

            {/* Recent Photos card */}
            <button
                onClick={() => onSelectAlbum(null, "Recent Photos")}
                className="flex items-center gap-3 rounded-lg p-3 ring-1 ring-stone-200 transition-all hover:ring-stone-300 hover:shadow-sm"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-stone-100 text-stone-400">
                    <RecentIcon />
                </div>
                <span className="font-bold tracking-wide text-stone-600">
                    Recent Photos
                </span>
            </button>

            {/* Album grid */}
            <div className="grid grid-cols-2 gap-2">
                {albums.map((album) => (
                    <button
                        key={album.id}
                        onClick={() =>
                            onSelectAlbum(album.id, album.title)
                        }
                        className="group overflow-hidden rounded-lg ring-1 ring-stone-200 transition-all hover:ring-stone-300 hover:shadow-sm"
                    >
                        <div className="aspect-square overflow-hidden bg-stone-100">
                            {album.coverPhotoBaseUrl && (
                                <img
                                    src={`${album.coverPhotoBaseUrl}=w256-h256-c`}
                                    className="h-full w-full object-cover transition-transform duration-200 ease-out-back group-hover:scale-105"
                                    draggable={false}
                                />
                            )}
                        </div>
                        <div className="px-2 py-1.5">
                            <p className="truncate text-left text-xs font-bold tracking-wide text-stone-600">
                                {album.title}
                            </p>
                            <p className="text-left text-xs text-stone-400">
                                {album.mediaItemsCount} items
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {loading && (
                <p className="py-4 text-center font-bold tracking-wide text-stone-400">
                    Loading...
                </p>
            )}

            {error && (
                <div className="flex flex-col items-center gap-2 py-4">
                    <p className="text-center text-sm text-red-500">
                        {error}
                    </p>
                    <button
                        onClick={() => void fetchAlbums()}
                        className="text-sm font-bold text-stone-500 hover:text-stone-700"
                    >
                        Retry
                    </button>
                </div>
            )}

            {nextPageToken && !loading && (
                <button
                    onClick={() => void fetchAlbums(nextPageToken)}
                    className="py-2 text-center text-sm font-bold tracking-wide text-stone-500 hover:text-stone-700"
                >
                    Load More Albums
                </button>
            )}
        </div>
    );
}

// --- Photo Grid View ---

function PhotoGridView({
    albumId,
    albumTitle,
    onImport,
    onBack,
    onAuthError,
}: {
    albumId: string | null;
    albumTitle: string;
    onImport: (
        photos: { blob: Blob; filename: string }[],
    ) => Promise<void>;
    onBack: () => void;
    onAuthError: () => void;
}) {
    const [mediaItems, setMediaItems] = useState<
        GooglePhotosMediaItem[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nextPageToken, setNextPageToken] = useState<
        string | undefined
    >();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        () => new Set(),
    );
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState<{
        done: number;
        total: number;
    } | null>(null);

    const fetchPhotos = useCallback(
        async (pageToken?: string) => {
            setLoading(true);
            setError(null);
            try {
                const result =
                    albumId ?
                        await listAlbumMediaItems(albumId, pageToken)
                    :   await listRecentMediaItems(pageToken);
                setMediaItems((prev) =>
                    pageToken ?
                        [...prev, ...(result.mediaItems ?? [])]
                    :   (result.mediaItems ?? []),
                );
                setNextPageToken(result.nextPageToken);
            } catch (e) {
                if (
                    e instanceof Error &&
                    e.message.includes("Auth error")
                ) {
                    onAuthError();
                    return;
                }
                setError(
                    e instanceof Error ?
                        e.message
                    :   "Failed to load photos",
                );
            } finally {
                setLoading(false);
            }
        },
        [albumId, onAuthError],
    );

    useEffect(() => {
        void fetchPhotos();
    }, [fetchPhotos]);

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const handleImport = useCallback(async () => {
        setImporting(true);
        setImportProgress({ done: 0, total: selectedIds.size });

        const photos: { blob: Blob; filename: string }[] = [];
        let done = 0;

        for (const item of mediaItems.filter((m) =>
            selectedIds.has(m.id),
        )) {
            try {
                const blob = await downloadPhotoBlob(item);
                photos.push({ blob, filename: item.filename });
            } catch {
                // Skip failed downloads
            }
            done++;
            setImportProgress({ done, total: selectedIds.size });
        }

        if (photos.length > 0) {
            await onImport(photos);
        }

        setImporting(false);
        setImportProgress(null);
    }, [selectedIds, mediaItems, onImport]);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <button
                    onClick={onBack}
                    disabled={importing}
                    className="text-stone-400 hover:text-stone-600 disabled:opacity-50"
                >
                    <BackIcon />
                </button>
                <h3 className="font-bold tracking-wide text-stone-700">
                    {albumTitle}
                </h3>
            </div>

            {error && (
                <div className="flex flex-col items-center gap-2 py-4">
                    <p className="text-center text-sm text-red-500">
                        {error}
                    </p>
                    <button
                        onClick={() => void fetchPhotos()}
                        className="text-sm font-bold text-stone-500 hover:text-stone-700"
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="grid grid-cols-3 gap-2">
                {mediaItems.map((item) => {
                    const isSelected = selectedIds.has(item.id);
                    return (
                        <button
                            key={item.id}
                            onClick={() => toggleSelection(item.id)}
                            disabled={importing}
                            className={classNames(
                                "group relative aspect-square overflow-hidden rounded",
                                "ring-2 transition-all",
                                isSelected ?
                                    "ring-blue-500"
                                :   "ring-transparent hover:ring-stone-400",
                            )}
                        >
                            <img
                                src={`${item.baseUrl}=w256-h256-c`}
                                className="h-full w-full object-cover transition-transform duration-200 ease-out-back group-hover:scale-105"
                                draggable={false}
                            />
                            {isSelected && (
                                <div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                                    <CheckIcon />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {loading && (
                <p className="py-4 text-center font-bold tracking-wide text-stone-400">
                    Loading...
                </p>
            )}

            {nextPageToken && !loading && (
                <button
                    onClick={() => void fetchPhotos(nextPageToken)}
                    disabled={importing}
                    className="py-2 text-center text-sm font-bold tracking-wide text-stone-500 hover:text-stone-700 disabled:opacity-50"
                >
                    Load More
                </button>
            )}

            {/* Import bar */}
            {selectedIds.size > 0 && (
                <div className="sticky bottom-0 -mx-5 -mb-5 border-t border-stone-200 bg-white px-5 py-3">
                    <button
                        onClick={() => void handleImport()}
                        disabled={importing}
                        className="w-full rounded-lg bg-stone-800 px-5 py-2.5 font-bold tracking-wide text-white transition-all hover:bg-stone-700 disabled:bg-stone-400"
                    >
                        {importProgress ?
                            `Importing ${importProgress.done} of ${importProgress.total}...`
                        : importing ?
                            "Importing..."
                        :   `Import ${selectedIds.size} Photo${selectedIds.size === 1 ? "" : "s"}`
                        }
                    </button>
                </div>
            )}
        </div>
    );
}

// --- Icons ---

function BackIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
}

function GooglePhotosIcon({ size = 24 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                d="M12 2C9.8 2 8 3.8 8 6v6h4V2z"
                fill="#EA4335"
            />
            <path
                d="M22 12c0-2.2-1.8-4-4-4h-6v4h10z"
                fill="#4285F4"
            />
            <path
                d="M12 22c2.2 0 4-1.8 4-4v-6h-4v10z"
                fill="#34A853"
            />
            <path
                d="M2 12c0 2.2 1.8 4 4 4h6v-4H2z"
                fill="#FBBC05"
            />
        </svg>
    );
}

function RecentIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
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
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
