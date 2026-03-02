// Google Photos API integration using Google Identity Services (GIS) for OAuth2
// and the Google Photos Library API for browsing/downloading.

// --- Type Definitions ---

export interface GooglePhotosAlbum {
    id: string;
    title: string;
    productUrl: string;
    mediaItemsCount: string;
    coverPhotoBaseUrl: string;
    coverPhotoMediaItemId: string;
}

export interface GooglePhotosMediaItem {
    id: string;
    description?: string;
    productUrl: string;
    baseUrl: string;
    mimeType: string;
    filename: string;
    mediaMetadata: {
        creationTime: string;
        width: string;
        height: string;
        photo?: {
            cameraMake?: string;
            cameraModel?: string;
        };
    };
}

interface AlbumsListResponse {
    albums?: GooglePhotosAlbum[];
    nextPageToken?: string;
}

interface MediaItemsSearchResponse {
    mediaItems?: GooglePhotosMediaItem[];
    nextPageToken?: string;
}

// --- GIS Type Declarations ---

declare global {
    interface Window {
        google?: {
            accounts: {
                oauth2: {
                    initTokenClient(config: {
                        client_id: string;
                        scope: string;
                        callback: (response: {
                            access_token?: string;
                            error?: string;
                            expires_in?: number;
                        }) => void;
                        error_callback?: (error: { type: string }) => void;
                    }): {
                        requestAccessToken(opts?: {
                            prompt?: string;
                        }): void;
                    };
                };
            };
        };
    }
}

// --- Client ID Configuration ---

const GOOGLE_CLIENT_ID_KEY = "photobook:google-client-id";

export function getGoogleClientId(): string | null {
    return localStorage.getItem(GOOGLE_CLIENT_ID_KEY);
}

export function setGoogleClientId(clientId: string): void {
    localStorage.setItem(GOOGLE_CLIENT_ID_KEY, clientId);
}

export function clearGoogleClientId(): void {
    localStorage.removeItem(GOOGLE_CLIENT_ID_KEY);
}

// --- Dynamic GIS Script Loading ---

let gisPromise: Promise<void> | null = null;

function loadGisScript(): Promise<void> {
    if (gisPromise) return gisPromise;
    gisPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
            gisPromise = null;
            reject(new Error("Failed to load Google Identity Services"));
        };
        document.head.appendChild(script);
    });
    return gisPromise;
}

// --- OAuth2 Token Management ---

const SCOPE = "https://www.googleapis.com/auth/photoslibrary.readonly";

let accessToken: string | null = null;
let tokenExpiresAt = 0;

export function isAuthenticated(): boolean {
    return accessToken !== null && Date.now() < tokenExpiresAt;
}

export async function requestAccessToken(): Promise<string> {
    const clientId = getGoogleClientId();
    if (!clientId) {
        throw new Error("Google Client ID not configured");
    }

    await loadGisScript();

    return new Promise<string>((resolve, reject) => {
        const client = window.google!.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: SCOPE,
            callback: (response) => {
                if (response.error) {
                    reject(new Error(`Auth error: ${response.error}`));
                    return;
                }
                if (response.access_token) {
                    accessToken = response.access_token;
                    tokenExpiresAt =
                        Date.now() +
                        (response.expires_in ?? 3600) * 1000 -
                        60_000;
                    resolve(response.access_token);
                }
            },
            error_callback: (error) => {
                reject(new Error(`Auth error: ${error.type}`));
            },
        });

        client.requestAccessToken({
            prompt: accessToken ? "" : "consent",
        });
    });
}

export function clearAuth(): void {
    accessToken = null;
    tokenExpiresAt = 0;
}

async function getValidToken(): Promise<string> {
    if (isAuthenticated()) return accessToken!;
    return requestAccessToken();
}

// --- API Helpers ---

const API_BASE = "https://photoslibrary.googleapis.com/v1";

async function fetchGooglePhotos(
    url: string,
    options: RequestInit = {},
): Promise<Response> {
    const token = await getValidToken();
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (response.status === 401) {
        clearAuth();
        const freshToken = await requestAccessToken();
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${freshToken}`,
                "Content-Type": "application/json",
            },
        });
    }

    if (!response.ok) {
        throw new Error(
            `Google Photos API error: ${response.status} ${response.statusText}`,
        );
    }

    return response;
}

// --- Albums ---

export async function listAlbums(
    pageToken?: string,
): Promise<AlbumsListResponse> {
    const params = new URLSearchParams({ pageSize: "50" });
    if (pageToken) params.set("pageToken", pageToken);

    const response = await fetchGooglePhotos(
        `${API_BASE}/albums?${params}`,
    );
    return response.json();
}

// --- Media Items ---

export async function listAlbumMediaItems(
    albumId: string,
    pageToken?: string,
): Promise<MediaItemsSearchResponse> {
    const body: Record<string, unknown> = {
        albumId,
        pageSize: 50,
    };
    if (pageToken) body.pageToken = pageToken;

    const response = await fetchGooglePhotos(
        `${API_BASE}/mediaItems:search`,
        {
            method: "POST",
            body: JSON.stringify(body),
        },
    );
    return response.json();
}

export async function listRecentMediaItems(
    pageToken?: string,
): Promise<MediaItemsSearchResponse> {
    const body: Record<string, unknown> = {
        pageSize: 50,
        filters: {
            mediaTypeFilter: {
                mediaTypes: ["PHOTO"],
            },
        },
    };
    if (pageToken) body.pageToken = pageToken;

    const response = await fetchGooglePhotos(
        `${API_BASE}/mediaItems:search`,
        {
            method: "POST",
            body: JSON.stringify(body),
        },
    );
    return response.json();
}

// --- Photo Download ---

export async function downloadPhotoBlob(
    item: GooglePhotosMediaItem,
    maxDimension = 2048,
): Promise<Blob> {
    const url = `${item.baseUrl}=w${maxDimension}-h${maxDimension}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `Failed to download photo: ${response.status}`,
        );
    }
    return response.blob();
}
