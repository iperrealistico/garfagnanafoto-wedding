import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readLeadFromSession, writeLeadToSession } from "../src/lib/lead-cache";
import { buildQuoteDocumentUrls } from "../src/lib/quote-document-url";
import { LeadPayload } from "../src/lib/config-schema";

describe("lead cache retrieval + PDF URL generation", () => {
    const quoteId = "quote-test-123";
    const leadPayload: LeadPayload = {
        firstName: "Sara",
        lastName: "Neri",
        email: "sara@example.com",
        phone: "+39 333 222 1111",
        weddingLocation: "Barga",
    };

    const createStorage = () => {
        const store = new Map<string, string>();

        return {
            clear: () => store.clear(),
            getItem: (key: string) => store.get(key) ?? null,
            key: (index: number) => Array.from(store.keys())[index] ?? null,
            removeItem: (key: string) => store.delete(key),
            setItem: (key: string, value: string) => store.set(key, value),
            get length() {
                return store.size;
            },
        };
    };

    beforeEach(() => {
        Object.defineProperty(globalThis, "window", {
            configurable: true,
            value: {
                sessionStorage: createStorage(),
            },
        });
    });

    afterEach(() => {
        Reflect.deleteProperty(globalThis, "window");
    });

    it("retrieves cached lead payload for the same quote", () => {
        writeLeadToSession(quoteId, leadPayload);
        expect(readLeadFromSession(quoteId)).toEqual(leadPayload);
    });

    it("includes cached lead fields in generated PDF URL", () => {
        writeLeadToSession(quoteId, leadPayload);
        const cachedLead = readLeadFromSession(quoteId);
        expect(cachedLead).toBeTruthy();

        const { pdfUrl } = buildQuoteDocumentUrls({
            packageId: "pkg_photo_video",
            lead: cachedLead || undefined,
        });

        const url = new URL(pdfUrl, "https://example.test");
        expect(url.searchParams.get("firstName")).toBe("Sara");
        expect(url.searchParams.get("lastName")).toBe("Neri");
        expect(url.searchParams.get("email")).toBe("sara@example.com");
        expect(url.searchParams.get("phone")).toBe("+39 333 222 1111");
        expect(url.searchParams.get("weddingLocation")).toBe("Barga");
    });
});
