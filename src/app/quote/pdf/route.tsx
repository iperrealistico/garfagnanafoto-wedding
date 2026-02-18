import { getAppConfig } from "@/lib/config-server";
import { calculateFixedPackageQuote, calculateCustomQuote } from "@/lib/pricing-engine";
import { NextResponse } from "next/server";
import { parseCustomParams } from "@/lib/url-params";
import { getLocalized } from "@/lib/i18n-utils";
import { readLeadPayloadFromSearchParams } from "@/lib/lead-payload";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get("packageId");
    const isCustom = searchParams.get("custom") === "true";
    const lang = "it";
    const leadPayload = readLeadPayloadFromSearchParams(searchParams);
    const firstName = leadPayload.firstName || "";
    const lastName = leadPayload.lastName || "";
    const now = new Date();
    const date = new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Europe/Rome",
    }).format(now);
    const generatedAt = `${new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Europe/Rome",
    }).format(now)} (Europe/Rome)`;

    try {
        const config = await getAppConfig();
        let pricing;
        let pkgName = "Preventivo Personalizzato";
        let pkgDescription = "Configurazione su misura basata sulle tue scelte.";

        if (packageId) {
            pricing = calculateFixedPackageQuote(config, packageId);
            const pkg = config.packages.find((p) => p.id === packageId);
            if (pkg) {
                pkgName = getLocalized(pkg.name, lang);
                pkgDescription = getLocalized(pkg.description, lang) || "";
            }
        } else if (isCustom) {
            let customParams;
            try {
                customParams = parseCustomParams(searchParams);
            } catch {
                return new NextResponse(
                    "Invalid custom adjustments payload. Please go back and regenerate the quote.",
                    { status: 400 }
                );
            }

            const { answers, additionalRequests, additionalAdjustments } = customParams;
            pricing = calculateCustomQuote(config, answers, { additionalAdjustments });
            pkgDescription = additionalRequests
                ? "Configurazione su misura basata sulle tue scelte e richieste aggiuntive."
                : pkgDescription;
        }

        if (!pricing) {
            return new NextResponse("Quote not found (missing packageId or custom params)", { status: 404 });
        }

        // Dynamic import to avoid issues with react-pdf SSR bundling
        const { renderToStream } = await import("@react-pdf/renderer");
        const { QuoteDocument } = await import("@/components/pdf/quote-document");

        const stream = await renderToStream(
            <QuoteDocument
                config={config}
                pricing={pricing}
                pkgName={pkgName}
                pkgDescription={pkgDescription}
                date={date}
                generatedAt={generatedAt}
                leadData={leadPayload}
                additionalRequests={searchParams.get("requests") || ""}
            />
        );

        const filename = `preventivo-${firstName || "garfagnanafoto"}-${lastName || "wedding"}.pdf`.toLowerCase().replace(/\s+/g, "_");

        return new NextResponse(stream as unknown as BodyInit, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${filename}"`,
            },
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        console.error("PDF generation error:", e);
        return new NextResponse(
            `PDF generation failed: ${message}. Please try the Print option instead.`,
            { status: 500 }
        );
    }
}
