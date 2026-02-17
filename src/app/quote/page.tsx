import { getAppConfig } from "@/lib/config-server";
import { calculateFixedPackageQuote } from "@/lib/pricing-engine";
import { PackageQuoteView } from "@/components/public/package-quote-view";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function QuotePage({
    searchParams,
}: {
    searchParams: Promise<{ packageId?: string }>;
}) {
    // Await searchParams before destructuring
    const resolvedSearchParams = await searchParams;
    const packageId = resolvedSearchParams.packageId;
    const lang = "it"; // Default to 'it' since /quote is not localized in path

    if (!packageId) return notFound();

    const config = await getAppConfig();
    const pricing = calculateFixedPackageQuote(config, packageId);
    const pkg = config.packages.find((p) => p.id === packageId);

    if (!pricing || !pkg) return notFound();

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="text-sm font-semibold text-[#719436] hover:text-[#5a762b] mb-10 inline-flex items-center transition-colors">
                    &larr; Torna alla Home
                </Link>

                <PackageQuoteView pkg={pkg} pricing={pricing} config={config} lang={lang} />

                <div className="mt-16 bg-gray-50 p-8 rounded-2xl border border-gray-100 text-sm text-gray-600 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs">Note Importanti</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <span className="mr-3 text-[#719436]">•</span>
                            <span>{config.legalCopy.deliveryTime.it}</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-3 text-[#719436]">•</span>
                            <span>{config.legalCopy.paymentTerms.it}</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-3 text-[#719436]">•</span>
                            <span>{config.legalCopy.disclaimer.it}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

