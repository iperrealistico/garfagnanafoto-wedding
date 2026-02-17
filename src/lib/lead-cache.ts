import { LeadPayload } from "./config-schema";
import { parseLeadPayload } from "./lead-payload";

const LEAD_CACHE_PREFIX = "garfagnanafoto:wedding:lead:";

export function getLeadCacheKey(quoteId: string) {
    return `${LEAD_CACHE_PREFIX}${quoteId}`;
}

export function readLeadFromSession(quoteId: string): LeadPayload | null {
    if (typeof window === "undefined") return null;

    const key = getLeadCacheKey(quoteId);
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as Partial<LeadPayload>;
        return parseLeadPayload(parsed);
    } catch {
        return null;
    }
}

export function writeLeadToSession(quoteId: string, payload: LeadPayload) {
    if (typeof window === "undefined") return;
    const key = getLeadCacheKey(quoteId);
    window.sessionStorage.setItem(key, JSON.stringify(payload));
}

export function clearLeadFromSession(quoteId: string) {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(getLeadCacheKey(quoteId));
}
