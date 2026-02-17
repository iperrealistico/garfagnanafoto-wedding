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
    const lang = "it"; // TODO: get from query param

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
        />
    );

    return new NextResponse(stream as unknown as BodyInit, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="preventivo-${pkgName.replace(/\s+/g, "_")}.pdf"`,
        },
    });
}
