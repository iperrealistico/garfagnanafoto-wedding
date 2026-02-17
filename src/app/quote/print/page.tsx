import { getAppConfig } from "@/lib/config-server";
import { calculateFixedPackageQuote } from "@/lib/pricing-engine";
import { QuoteSummary } from "@/components/public/quote-summary";
import { notFound } from "next/navigation";
import { PrintAutoTrigger } from "@/components/public/print-auto-trigger"; // Client component to trigger print

export default async function PrintPage({
    searchParams,
}: {
    searchParams: Promise<{ packageId?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const packageId = resolvedSearchParams.packageId;

    if (!packageId) return notFound();

    const config = await getAppConfig();
    const pricing = calculateFixedPackageQuote(config, packageId);
    const pkg = config.packages.find((p) => p.id === packageId);

    if (!pricing || !pkg) return notFound();

    return (
        <div className="bg-white min-h-screen p-8 text-black">
            <PrintAutoTrigger />
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center border-b pb-6">
                    <h1 className="text-2xl font-bold uppercase tracking-widest">Garfagnanafoto Wedding</h1>
                    <p className="text-sm text-gray-500">Preventivo Servizio Matrimoniale</p>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-2">{pkg.name}</h2>
                    <p className="text-gray-600">{pkg.tagline}</p>
                </div>

                <QuoteSummary pricing={pricing} title="Dettaglio Costi" />

                <div className="grid grid-cols-2 gap-8 text-sm pt-8">
                    <div>
                        <h3 className="font-bold mb-1">Termini di Consegna</h3>
                        <p>{config.legalCopy.deliveryTime}</p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-1">Pagamento</h3>
                        <p>{config.legalCopy.paymentTerms}</p>
                    </div>
                </div>

                <div className="text-xs text-center text-gray-400 mt-12 pt-4 border-t">
                    <p>{config.legalCopy.disclaimer}</p>
                    <p className="mt-1">Documento generato il {new Date().toLocaleDateString("it-IT")}</p>
                </div>
            </div>
        </div>
    );
}
