import { LeadPayload } from "./config-schema";
import { writeLeadPayloadToSearchParams } from "./lead-payload";
import { CustomAnswers } from "./pricing-engine";

export type QuoteDocumentAction = "download" | "print";

interface QuoteDocumentParams {
    packageId?: string;
    isCustom?: boolean;
    answers?: CustomAnswers;
    additionalRequests?: string;
    lead?: Partial<LeadPayload>;
}

export function buildQuoteDocumentSearchParams({
    packageId,
    isCustom,
    answers,
    additionalRequests,
    lead,
}: QuoteDocumentParams): URLSearchParams {
    const searchParams = new URLSearchParams();

    if (packageId) {
        searchParams.set("packageId", packageId);
    }

    if (isCustom) {
        searchParams.set("custom", "true");
    }

    if (answers) {
        Object.entries(answers).forEach(([key, value]) => {
            if (typeof value === "boolean") {
                if (value) searchParams.set(key, "1");
                return;
            }

            if (typeof value === "string" && value.trim()) {
                searchParams.set(key, value);
            }
        });
    }

    if (additionalRequests?.trim()) {
        searchParams.set("requests", additionalRequests.trim());
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
