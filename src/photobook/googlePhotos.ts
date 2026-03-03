const CLIENT_ID_KEY = "photobook-google-client-id";
const OAUTH_TOKEN_KEY = "photobook-google-oauth-token";
const GOOGLE_SCOPE =
    "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";
const PICKER_API_BASE = "https://photospicker.googleapis.com/v1";

export function getGoogleClientId(): string | null {
    return localStorage.getItem(CLIENT_ID_KEY);
}

export function setGoogleClientId(clientId: string): void {
    localStorage.setItem(CLIENT_ID_KEY, clientId.trim());
}

export function clearGoogleClientId(): void {
    localStorage.removeItem(CLIENT_ID_KEY);
}

/**
 * Check if the current page load is an OAuth callback (redirect from Google).
 * If so, stash the token in localStorage for the opener to pick up and close.
 * Returns true if this was a callback (caller should skip rendering the app).
 */
export function handleOAuthCallback(): boolean {
    const hash = window.location.hash;
    if (!hash.includes("access_token")) return false;

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    if (!accessToken) return false;

    // Write token to localStorage — the opener polls for this.
    // This works regardless of COOP because both windows share
    // the same localStorage (same origin).
    localStorage.setItem(OAUTH_TOKEN_KEY, accessToken);

    // Clear hash so a refresh doesn't re-trigger
    history.replaceState(null, "", window.location.pathname);

    // Try to close. This works for script-opened popups even after COOP
    // severs the opener reference.
    window.close();

    return true;
}

function getRedirectUri(): string {
    return window.location.origin + window.location.pathname;
}

/**
 * Opens a popup to Google OAuth and resolves with the access token.
 * Uses localStorage (not postMessage) so COOP can't break the flow.
 */
export function requestAccessToken(clientId: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // Clear any stale token
        localStorage.removeItem(OAUTH_TOKEN_KEY);

        const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        authUrl.searchParams.set("client_id", clientId);
        authUrl.searchParams.set("redirect_uri", getRedirectUri());
        authUrl.searchParams.set("response_type", "token");
        authUrl.searchParams.set("scope", GOOGLE_SCOPE);
        authUrl.searchParams.set("include_granted_scopes", "true");

        const popup = window.open(
            authUrl.toString(),
            "google-oauth",
            "width=600,height=700",
        );
        if (!popup) {
            reject(
                new Error(
                    "Failed to open popup. Please allow popups for this site.",
                ),
            );
            return;
        }

        // Poll localStorage for the token written by the callback page.
        const pollToken = setInterval(() => {
            const token = localStorage.getItem(OAUTH_TOKEN_KEY);
            if (token) {
                clearInterval(pollToken);
                clearTimeout(timeout);
                localStorage.removeItem(OAUTH_TOKEN_KEY);
                resolve(token);
            }
        }, 500);

        // Safety timeout so the promise doesn't hang forever
        const timeout = setTimeout(
            () => {
                clearInterval(pollToken);
                localStorage.removeItem(OAUTH_TOKEN_KEY);
                reject(new Error("Sign-in timed out. Please try again."));
            },
            5 * 60 * 1000,
        );
    });
}

// --- Picker API types ---

interface PickerSession {
    id: string;
    pickerUri: string;
    pollingConfig?: {
        pollInterval: string;
        timeoutIn: string;
    };
    mediaItemsSet: boolean;
}

export interface PickedMediaItem {
    id: string;
    createTime?: string;
    type?: string;
    mediaFile: {
        baseUrl: string;
        mimeType: string;
        filename?: string;
    };
}

// --- Picker API calls ---

async function createSession(accessToken: string): Promise<PickerSession> {
    const res = await fetch(`${PICKER_API_BASE}/sessions`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(
            `Failed to create picker session (${res.status}): ${text}`,
        );
    }
    return res.json();
}

async function getSession(
    accessToken: string,
    sessionId: string,
): Promise<PickerSession> {
    const res = await fetch(`${PICKER_API_BASE}/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
        throw new Error(`Failed to poll session (${res.status})`);
    }
    return res.json();
}

async function listMediaItems(
    accessToken: string,
    sessionId: string,
): Promise<PickedMediaItem[]> {
    const items: PickedMediaItem[] = [];
    let pageToken: string | undefined;

    do {
        const url = new URL(`${PICKER_API_BASE}/mediaItems`);
        url.searchParams.set("sessionId", sessionId);
        if (pageToken) url.searchParams.set("pageToken", pageToken);

        const res = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) {
            throw new Error(`Failed to list selected photos (${res.status})`);
        }

        const data = await res.json();
        if (data.mediaItems) items.push(...data.mediaItems);
        pageToken = data.nextPageToken;
    } while (pageToken);

    // The Picker API doesn't support server-side media type filtering,
    // so we drop videos here.
    return items.filter((item) => item.mediaFile.mimeType.startsWith("image/"));
}

export async function downloadPhoto(
    baseUrl: string,
    accessToken: string,
): Promise<Blob> {
    // =d downloads original quality with metadata.
    // The Authorization header is required per the Picker API docs.
    const res = await fetch(`${baseUrl}=d`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
        throw new Error(`Failed to download photo (${res.status})`);
    }
    return res.blob();
}

function parseDuration(duration: string): number {
    // Google returns durations as "Xs" (seconds)
    const match = /^(\d+(?:\.\d+)?)s$/.exec(duration);
    if (match) return parseFloat(match[1]) * 1000;
    return 3000;
}

/**
 * Full picker flow: create session, open picker UI, poll for completion,
 * then list the selected media items.
 *
 * We don't check popup.closed because COOP on Google's domain severs
 * the opener reference and makes popup.closed unreliable. Instead we
 * rely purely on session polling + timeout.
 */
export async function runPickerFlow(
    accessToken: string,
    onStatus: (status: string) => void,
): Promise<PickedMediaItem[]> {
    onStatus("Creating picker session\u2026");
    const session = await createSession(accessToken);

    // Open Google's picker UI in a popup; /autoclose closes it when done
    const pickerUrl = session.pickerUri + "/autoclose";
    const popup = window.open(
        pickerUrl,
        "google-photos-picker",
        "width=900,height=700",
    );
    if (!popup) {
        throw new Error(
            "Failed to open picker. Please allow popups for this site.",
        );
    }

    onStatus("Waiting for photo selection\u2026");

    const pollIntervalMs =
        session.pollingConfig ?
            parseDuration(session.pollingConfig.pollInterval)
        :   3000;
    const timeoutMs =
        session.pollingConfig ?
            parseDuration(session.pollingConfig.timeoutIn)
        :   30 * 60 * 1000;
    const startTime = Date.now();

    while (true) {
        if (Date.now() - startTime > timeoutMs) {
            throw new Error("Picker session timed out");
        }

        await new Promise((r) => setTimeout(r, pollIntervalMs));

        const updated = await getSession(accessToken, session.id);
        if (updated.mediaItemsSet) {
            onStatus("Fetching selected photos\u2026");
            return await listMediaItems(accessToken, session.id);
        }
    }
}
