import { getAppConfig } from "@/lib/config-server";
import { calculateFixedPackageQuote, calculateCustomQuote } from "@/lib/pricing-engine";
import { QuoteSummary } from "@/components/public/quote-summary";
import { notFound } from "next/navigation";
import { PrintAutoTrigger } from "@/components/public/print-auto-trigger";
import { parseCustomParams } from "@/lib/url-params";
import { getLocalized } from "@/lib/i18n-utils";

export default async function PrintPage({
    searchParams,
}: {
    searchParams: Promise<{
        packageId?: string;
        custom?: string;
        first_name?: string;
        last_name?: string;
        location?: string;
        requests?: string;
    }>;
}) {
    let resolvedSearchParams;
    try {
        resolvedSearchParams = await searchParams;
    } catch {
        return notFound();
    }

    const { packageId, custom, first_name, last_name, location, requests } = resolvedSearchParams;
    const isCustom = custom === "true";
    const lang = "it";

    let config;
    try {
        config = await getAppConfig();
    } catch (e) {
        console.error("Failed to load config for print page:", e);
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-12">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-gray-900">Errore di configurazione</h1>
                    <p className="text-gray-500">Non è stato possibile caricare la configurazione. Riprova più tardi.</p>
                </div>
            </div>
        );
    }

    let pricing;
    let pkgName = "";
    let pkgTagline = "";

    if (packageId) {
        pricing = calculateFixedPackageQuote(config, packageId);
        const pkg = config.packages.find((p) => p.id === packageId);
        if (pkg) {
            pkgName = getLocalized(pkg.name, lang);
            pkgTagline = getLocalized(pkg.tagline, lang);
        }
    } else if (isCustom) {
        const { answers } = parseCustomParams(resolvedSearchParams as any);
        pricing = calculateCustomQuote(config, answers);
        pkgName = lang === 'it' ? "Preventivo Personalizzato" : "Custom Quote";
    }

    if (!pricing) return notFound();

    const leadData = {
        first_name,
        last_name,
        wedding_location: location
    };

    // Safe access to legalCopy with fallbacks
    const deliveryTime = config.legalCopy?.deliveryTime ? getLocalized(config.legalCopy.deliveryTime, lang) : "";
    const paymentTerms = config.legalCopy?.paymentTerms ? getLocalized(config.legalCopy.paymentTerms, lang) : "";
    const disclaimer = config.legalCopy?.disclaimer ? getLocalized(config.legalCopy.disclaimer, lang) : "";

    return (
        <div className="bg-white min-h-screen text-black relative overflow-hidden print:p-0">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 2cm; }
                    body { -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                }
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 8rem;
                    font-weight: 900;
                    color: rgba(0,0,0,0.03);
                    white-space: nowrap;
                    pointer-events: none;
                    z-index: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.5em;
                }
            `}} />

            <div className="watermark">Garfagnanafoto.it</div>

            <PrintAutoTrigger />

            <div className="max-w-4xl mx-auto p-12 relative z-10 space-y-12">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-gray-900 pb-8">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-gray-900">GARFAGNANAFOTO</h1>
                        <p className="text-[#719436] font-bold tracking-widest text-xs uppercase">Wedding Photography &amp; Video</p>
                    </div>
                    <div className="text-right text-xs text-gray-500 uppercase font-bold tracking-widest leading-relaxed">
                        <p>Sillico, Castelnuovo di Garfagnana</p>
                        <p>Lucca, Toscana, Italia</p>
                        <p>www.garfagnanafoto.it</p>
                    </div>
                </div>

                {/* Info Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-gray-50 p-8 rounded-2xl">
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Cliente</h2>
                        <p className="text-xl font-bold">{first_name || last_name ? `${first_name} ${last_name}` : '---'}</p>
                        {location && (
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="mr-2 opacity-50 font-bold uppercase tracking-tighter">Location:</span>
                                <span className="font-semibold">{location}</span>
                            </div>
                        )}
                    </div>
                    <div className="text-right space-y-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Documento</h2>
                        <p className="text-xl font-bold">Preventivo Servizio</p>
                        <p className="text-sm text-gray-600 font-medium">Data: {new Date().toLocaleDateString("it-IT")}</p>
                    </div>
                </div>

                {/* Package & Summary */}
                <div className="space-y-6">
                    <div className="border-l-4 border-[#719436] pl-6 py-2">
                        <h3 className="text-2xl font-black text-gray-900">{pkgName}</h3>
                        {pkgTagline && <p className="text-gray-500 mt-1">{pkgTagline}</p>}
                    </div>

                    <QuoteSummary
                        pricing={pricing}
                        title=""
                        additionalRequests={requests}
                        lang={lang}
                    />
                </div>

                {/* Legal & Footer */}
                {(deliveryTime || paymentTerms) && (
                    <div className="grid grid-cols-2 gap-12 text-sm pt-8">
                        {deliveryTime && (
                            <div className="space-y-3">
                                <h4 className="font-black uppercase tracking-widest text-[10px] text-gray-400">Termini di Consegna</h4>
                                <p className="text-gray-700 leading-relaxed font-medium">{deliveryTime}</p>
                            </div>
                        )}
                        {paymentTerms && (
                            <div className="space-y-3">
                                <h4 className="font-black uppercase tracking-widest text-[10px] text-gray-400">Pagamento</h4>
                                <p className="text-gray-700 leading-relaxed font-medium">{paymentTerms}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="text-[10px] text-center text-gray-400 mt-12 pt-8 border-t border-dashed space-y-2 uppercase tracking-widest font-bold">
                    {disclaimer && <p>{disclaimer}</p>}
                    <p className="text-[#719436]">Grazie per aver scelto Garfagnanafoto.it</p>
                    <p className="mt-4 opacity-50 font-mono">Generated on: {new Date().toISOString()}</p>
                </div>
            </div>
        </div>
    );
}
