import { LeadPayload } from "./config-schema";
import { writeLeadPayloadToSearchParams } from "./lead-payload";

export type QuoteDocumentAction = "download" | "print";

interface QuoteDocumentParams {
    packageId?: string;
    lead?: Partial<LeadPayload>;
}

export function buildQuoteDocumentSearchParams({
    packageId,
    lead,
}: QuoteDocumentParams): URLSearchParams {
    const searchParams = new URLSearchParams();

    if (packageId) {
        searchParams.set("packageId", packageId);
    }

    writeLeadPayloadToSearchParams(searchParams, lead);

    return searchParams;
}

export function buildQuoteDocumentUrls(params: QuoteDocumentParams) {
    const query = buildQuoteDocumentSearchParams(params).toString();
    const suffix = query ? `?${query}` : "";

    return {
        pdfUrl: `/quote/pdf${suffix}`,
        printUrl: `/quote/print${suffix}`,
    };
}

export function resolveQuoteDocumentActionUrl(action: QuoteDocumentAction, params: QuoteDocumentParams) {
    const { pdfUrl, printUrl } = buildQuoteDocumentUrls(params);
    return action === "print" ? printUrl : pdfUrl;
}
