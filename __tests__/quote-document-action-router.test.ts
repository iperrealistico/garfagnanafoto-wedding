import { describe, expect, it } from "vitest";
import { buildQuoteDocumentUrls, resolveQuoteDocumentActionUrl } from "../src/lib/quote-document-url";

describe("quote action router", () => {
    it("routes download action to the PDF endpoint", () => {
        const url = resolveQuoteDocumentActionUrl("download", {
            packageId: "pkg_photo_only",
            lead: {
                firstName: "Mario",
                lastName: "Rossi",
                email: "mario@example.com",
                phone: "+39 333 123 4567",
                weddingLocation: "Lucca",
            },
        });

        expect(url.startsWith("/quote/pdf?")).toBe(true);
    });

    it("routes print action to print wrapper using the same PDF query payload", () => {
        const params = {
            isCustom: true,
            answers: { q_video: true, q_notes: "Richiesta drone" },
            additionalRequests: "Cerimonia in montagna",
            lead: {
                firstName: "Giulia",
                lastName: "Verdi",
                email: "giulia@example.com",
                phone: "+39 333 555 6666",
                weddingLocation: "Castelnuovo",
            },
        } as const;

        const urls = buildQuoteDocumentUrls(params);
        const printUrl = resolveQuoteDocumentActionUrl("print", params);

        expect(printUrl.startsWith("/quote/print?")).toBe(true);

        const pdfQuery = urls.pdfUrl.split("?")[1];
        const printQuery = printUrl.split("?")[1];
        expect(printQuery).toBe(pdfQuery);
    });
});
