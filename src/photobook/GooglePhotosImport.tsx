import {
    downloadPhoto,
    getGoogleClientId,
    requestAccessToken,
    runPickerFlow,
} from "@/photobook/googlePhotos";
import { useBookState } from "@/photobook/useBookState";
import { useCallback, useEffect, useRef, useState } from "react";

type ImportState =
    | { step: "idle" }
    | { step: "authenticating" }
    | { step: "picking"; status: string }
    | { step: "downloading"; done: number; total: number }
    | { step: "complete"; imported: number }
    | { step: "error"; message: string };

export function GooglePhotosImport({ onClose }: { onClose: () => void }) {
    const { addPhoto } = useBookState();
    const [state, setState] = useState<ImportState>({ step: "idle" });
    const abortRef = useRef(false);
    const addPhotoRef = useRef(addPhoto);
    addPhotoRef.current = addPhoto;

    const startImport = useCallback(async () => {
        const clientId = getGoogleClientId();
        if (!clientId) return;

        abortRef.current = false;

        try {
            setState({ step: "authenticating" });
            const accessToken = await requestAccessToken(clientId);
            if (abortRef.current) return;

            setState({ step: "picking", status: "Starting picker\u2026" });
            const items = await runPickerFlow(accessToken, (status) =>
                setState({ step: "picking", status }),
            );
            if (abortRef.current) return;

            // Filter to images only
            const photos = items.filter(
                (item) =>
                    !item.type ||
                    item.type === "PHOTO" ||
                    item.mediaFile.mimeType.startsWith("image/"),
            );

            if (photos.length === 0) {
                setState({
                    step: "error",
                    message: "No photos were selected",
                });
                return;
            }

            setState({
                step: "downloading",
                done: 0,
                total: photos.length,
            });

            for (let i = 0; i < photos.length; i++) {
                if (abortRef.current) return;

                const item = photos[i];
                const blob = await downloadPhoto(
                    item.mediaFile.baseUrl,
                    accessToken,
                );
                const filename =
                    item.mediaFile.filename ?? `google-photo-${item.id}.jpg`;
                const file = new File([blob], filename, {
                    type: item.mediaFile.mimeType || "image/jpeg",
                });
                const takenAt =
                    item.createTime ?
                        new Date(item.createTime).getTime()
                    :   null;
                await addPhotoRef.current(file, takenAt);

                setState({
                    step: "downloading",
                    done: i + 1,
                    total: photos.length,
                });
            }

            setState({ step: "complete", imported: photos.length });
        } catch (e) {
            if (abortRef.current) return;
            setState({
                step: "error",
                message:
                    e instanceof Error ?
                        e.message
                    :   "An unknown error occurred",
            });
        }
    }, []);

    useEffect(() => {
        void startImport();
        return () => {
            abortRef.current = true;
        };
    }, [startImport]);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {state.step === "idle" && null}

                {state.step === "authenticating" && (
                    <div className="text-center">
                        <Spinner />
                        <p className="mt-3 text-sm text-stone-600">
                            Signing in with Google&hellip;
                        </p>
                        <p className="mt-1 text-xs text-stone-400">
                            Complete sign-in in the popup window
                        </p>
                    </div>
                )}

                {state.step === "picking" && (
                    <div className="text-center">
                        <Spinner />
                        <p className="mt-3 text-sm text-stone-600">
                            {state.status}
                        </p>
                        <p className="mt-1 text-xs text-stone-400">
                            Select photos in the Google Photos window
                        </p>
                    </div>
                )}

                {state.step === "downloading" && (
                    <div className="text-center">
                        <Spinner />
                        <p className="mt-3 text-sm text-stone-600">
                            Downloading photos&hellip; {state.done}/
                            {state.total}
                        </p>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200">
                            <div
                                className="h-full rounded-full bg-blue-500 transition-all"
                                style={{
                                    width: `${(state.done / state.total) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                )}

                {state.step === "complete" && (
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckIcon />
                        </div>
                        <p className="mt-3 text-sm font-medium text-stone-700">
                            Imported {state.imported} photo
                            {state.imported !== 1 && "s"}
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-4 rounded-md bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200"
                        >
                            Done
                        </button>
                    </div>
                )}

                {state.step === "error" && (
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <ErrorIcon />
                        </div>
                        <p className="mt-3 text-sm font-medium text-stone-700">
                            Import failed
                        </p>
                        <p className="mt-1 text-xs text-stone-500">
                            {state.message}
                        </p>
                        <div className="mt-4 flex justify-center gap-3">
                            <button
                                onClick={onClose}
                                className="rounded-md bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setState({ step: "idle" });
                                    void startImport();
                                }}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Spinner() {
    return (
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-blue-500" />
    );
}

function CheckIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-green-600"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function ErrorIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-red-600"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
