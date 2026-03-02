import {
    clearGoogleClientId,
    getGoogleClientId,
    setGoogleClientId,
} from "@/photobook/googlePhotos";
import { useCallback, useState } from "react";

export function GooglePhotosSetup({
    onComplete,
    onClose,
}: {
    onComplete: () => void;
    onClose: () => void;
}) {
    const [clientId, setClientId] = useState(getGoogleClientId() ?? "");
    const [error, setError] = useState("");

    const handleSave = useCallback(() => {
        const trimmed = clientId.trim();
        if (!trimmed) {
            setError("Please enter a Client ID");
            return;
        }
        if (!trimmed.endsWith(".apps.googleusercontent.com")) {
            setError(
                "Client ID should end with .apps.googleusercontent.com",
            );
            return;
        }
        setGoogleClientId(trimmed);
        onComplete();
    }, [clientId, onComplete]);

    const handleClear = useCallback(() => {
        clearGoogleClientId();
        setClientId("");
    }, []);

    const hasExisting = !!getGoogleClientId();
    const redirectUri = window.location.origin + window.location.pathname;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="mx-4 flex max-h-[85vh] w-full max-w-xl flex-col rounded-lg bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                    <h2 className="text-lg font-bold tracking-wide text-stone-700">
                        Connect Google Photos
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-2xl leading-none text-stone-400 hover:text-stone-600"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex-1 space-y-4 overflow-auto px-5 py-4 text-sm text-stone-600">
                    <p>
                        To import photos from Google Photos you need to
                        create a Google Cloud OAuth client. This only needs
                        to be done once.
                    </p>

                    <ol className="list-inside list-decimal space-y-3">
                        <li>
                            Go to the{" "}
                            <a
                                href="https://console.cloud.google.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 underline"
                            >
                                Google Cloud Console
                            </a>{" "}
                            and create a new project (or select an existing
                            one).
                        </li>
                        <li>
                            Go to{" "}
                            <strong>
                                APIs &amp; Services &rarr; Library
                            </strong>
                            , search for{" "}
                            <a
                                href="https://console.cloud.google.com/apis/library/photospicker.googleapis.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 underline"
                            >
                                Photos Picker API
                            </a>
                            , and <strong>Enable</strong> it.
                        </li>
                        <li>
                            Go to{" "}
                            <a
                                href="https://console.cloud.google.com/apis/credentials/consent"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 underline"
                            >
                                APIs &amp; Services &rarr; OAuth consent
                                screen
                            </a>
                            . Set it to <strong>External</strong>, fill in
                            the required fields, then add your Google
                            account as a <strong>test user</strong>.
                        </li>
                        <li>
                            Go to{" "}
                            <a
                                href="https://console.cloud.google.com/apis/credentials"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 underline"
                            >
                                Credentials
                            </a>{" "}
                            &rarr; <strong>Create Credentials</strong>{" "}
                            &rarr; <strong>OAuth client ID</strong>.
                        </li>
                        <li>
                            Choose{" "}
                            <strong>Web application</strong> as the type.
                        </li>
                        <li>
                            Under{" "}
                            <strong>
                                Authorized JavaScript origins
                            </strong>
                            , add:
                            <code className="mt-1 block rounded bg-stone-100 px-2 py-1 font-mono text-xs">
                                {window.location.origin}
                            </code>
                        </li>
                        <li>
                            Under{" "}
                            <strong>Authorized redirect URIs</strong>, add:
                            <code className="mt-1 block rounded bg-stone-100 px-2 py-1 font-mono text-xs">
                                {redirectUri}
                            </code>
                        </li>
                        <li>
                            Click <strong>Create</strong>, then copy the{" "}
                            <strong>Client ID</strong> and paste it below.
                        </li>
                    </ol>

                    <div>
                        <label className="mb-1 block font-medium text-stone-700">
                            OAuth Client ID
                        </label>
                        <input
                            type="text"
                            value={clientId}
                            onChange={(e) => {
                                setClientId(e.target.value);
                                setError("");
                            }}
                            placeholder="123456789-abc.apps.googleusercontent.com"
                            className="w-full rounded-md border border-stone-300 px-3 py-2 font-mono text-xs focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        {error && (
                            <p className="mt-1 text-xs text-red-500">
                                {error}
                            </p>
                        )}
                    </div>

                    {hasExisting && (
                        <button
                            onClick={handleClear}
                            className="text-xs text-red-500 underline hover:text-red-600"
                        >
                            Remove saved Client ID
                        </button>
                    )}
                </div>

                <div className="flex justify-end gap-3 border-t border-stone-200 px-5 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-md px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Save &amp; Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
