import { renderToStream } from "@react-pdf/renderer";
import { getAppConfig } from "@/lib/config-server";
import { calculateFixedPackageQuote, calculateCustomQuote } from "@/lib/pricing-engine";
import { QuoteDocument } from "@/components/pdf/quote-document";
import { NextResponse } from "next/server";
import { parseCustomParams } from "@/lib/url-params";

import { getLocalized } from "@/lib/i18n-utils";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get("packageId");
    const isCustom = searchParams.get("custom") === "true";
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";
    const location = searchParams.get("location") || "";
    const requests = searchParams.get("requests") || "";
    const lang = "it";

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
        const { answers } = parseCustomParams(searchParams);
        pricing = calculateCustomQuote(config, answers);
    }

    if (!pricing) {
        return new NextResponse("Quote not found (missing packageId or custom params)", { status: 404 });
    }

    // Generate PDF stream
    const stream = await renderToStream(
        <QuoteDocument
            config={config}
            pricing={pricing}
            pkgName={pkgName}
            pkgDescription={pkgDescription}
            date={new Date().toLocaleDateString("it-IT")}
            leadData={{
                first_name: firstName,
                last_name: lastName,
                wedding_location: location
            }}
            additionalRequests={requests}
        />
    );

    const filename = `preventivo-${firstName || "garfagnanafoto"}-${lastName || "wedding"}.pdf`.toLowerCase().replace(/\s+/g, "_");

    return new NextResponse(stream as unknown as BodyInit, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${filename}"`,
        },
    });
}
