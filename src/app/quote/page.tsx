import { getAppConfig } from "@/lib/config-server";
import { calculateFixedPackageQuote } from "@/lib/pricing-engine";
import { QuoteSummary } from "@/components/public/quote-summary";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

// Since it's a dynamic route via query param, we can use searchParams in page props.
// However, standard Next.js approach effectively makes this dynamic rendered.

export default async function QuotePage({
    searchParams,
}: {
    searchParams: Promise<{ packageId?: string }>; // Updated for Next.js 15: searchParams is a Promise
}) {
    // Await searchParams before destructuring
    const resolvedSearchParams = await searchParams;
    const packageId = resolvedSearchParams.packageId;

    if (!packageId) return notFound();

    const config = await getAppConfig();
    const pricing = calculateFixedPackageQuote(config, packageId);
    const pkg = config.packages.find((p) => p.id === packageId);

    if (!pricing || !pkg) return notFound();

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block">
                    &larr; Torna alla Home
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">{pkg.name}</h1>
                <p className="text-gray-600 mb-8">{pkg.description}</p>

                <QuoteSummary pricing={pricing} title="Riepilogo Preventivo" />

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                        <Link href={`/quote/print?packageId=${packageId}`} target="_blank">
                            Stampa Preventivo
                        </Link>
                    </Button>

                    {/* PDF Generation usually client-side via @react-pdf/renderer's PDFDownloadLink 
                 but we are in a Server Component. We need a Client Component for the download button.
             */}
                    <Button asChild variant="outline" size="lg">
                        <Link href={`/quote/pdf?packageId=${packageId}`} target="_blank">
                            Scarica PDF (Anteprima)
                        </Link>
                    </Button>
                </div>

                <div className="mt-12 bg-blue-50 p-6 rounded-lg text-sm text-blue-800">
                    <h3 className="font-bold mb-2">Note Importanti</h3>
                    <ul className="list-disc list-inside space-y-1">
                        <li>{config.legalCopy.deliveryTime}</li>
                        <li>{config.legalCopy.paymentTerms}</li>
                        <li>{config.legalCopy.disclaimer}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
