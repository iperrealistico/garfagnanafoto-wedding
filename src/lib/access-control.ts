const DEFAULT_ACCESS_PASSWORD = "garfamatrimoni";
const DEFAULT_REDIRECT_PATH = "/it";

export const ACCESS_COOKIE_NAME = "gf_wedding_access";
export const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 12;

function getConfiguredPassword() {
    return process.env.WEDDING_ACCESS_PASSWORD?.trim() || DEFAULT_ACCESS_PASSWORD;
}

function getConfiguredCookieSecret() {
    return process.env.WEDDING_ACCESS_COOKIE_SECRET?.trim() || `cookie:${getConfiguredPassword()}`;
}

async function sha256(input: string) {
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    return Array.from(new Uint8Array(buffer))
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("");
}

export function isAccessProtectionEnabled() {
    return true;
}

export function isSubmittedPasswordValid(password: string) {
    return password.trim() === getConfiguredPassword();
}

export async function createAccessSessionToken() {
    const password = getConfiguredPassword();
    if (!password) return "";

    return sha256(`garfagnanafoto-wedding:${password}:${getConfiguredCookieSecret()}`);
}

export async function hasValidAccessSession(token?: string) {
    if (!isAccessProtectionEnabled()) return true;
    if (!token) return false;

    return token === await createAccessSessionToken();
}

export function sanitizeAccessRedirectTarget(target?: string | null) {
    if (!target || !target.startsWith("/") || target.startsWith("//")) {
        return DEFAULT_REDIRECT_PATH;
    }

    return target;
}
