import { PricingResult } from "@/lib/pricing-engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocalized } from "@/lib/i18n-utils";
import { LeadPayload, AppConfig } from "@/lib/config-schema";

interface QuoteSummaryProps {
    pricing: PricingResult;
    title: string;
    config?: AppConfig;
    additionalRequests?: string;
    leadData?: Partial<LeadPayload>;
    lang?: string;
}

export function QuoteSummary({
    pricing,
    title,
    config,
    additionalRequests,
    leadData,
    lang = "it"
}: QuoteSummaryProps) {
    const formatCurrency = (value: number) => `€${Math.abs(value).toLocaleString("it-IT")}`;
    const formatSignedCurrency = (value: number) => `${value < 0 ? "-" : "+"}${formatCurrency(value)}`;
    const isDiscount = (value: number) => value < 0;

    const labels = {
        subtotal: lang === 'it' ? 'Imponibile' : 'Subtotal',
        adjustment: lang === 'it' ? 'Sconto/Adeguamento' : 'Discount/Adjustment',
        questionAdjustments: lang === 'it' ? 'Adeguamenti risposte' : 'Answer adjustments',
        additionalAdjustments: lang === 'it' ? 'Voci aggiuntive' : 'Additional items',
        discount: lang === 'it' ? 'Sconto' : 'Discount',
        totalNet: lang === 'it' ? 'Totale Netto' : 'Total Net',
        vat: lang === 'it' ? 'IVA' : 'VAT',
        total: lang === 'it' ? 'Totale' : 'Total',
        notes: lang === 'it' ? 'Note aggiuntive' : 'Additional notes',
        client: lang === 'it' ? 'Cliente' : 'Client',
        location: lang === 'it' ? 'Luogo' : 'Location'
    };

    return (
        <Card className="w-full bg-white shadow-lg overflow-hidden border-gray-200">
            <CardHeader className="bg-gray-50 border-b py-4">
                <CardTitle className="text-xl font-bold text-gray-800">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {leadData && (leadData.firstName || leadData.weddingLocation) && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {leadData.firstName && (
                            <div className="md:col-span-2">
                                <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">{labels.client}</span>
                                <span className="font-semibold text-gray-900">{leadData.firstName} {leadData.lastName}</span>
                                <span className="text-gray-400 mx-2">|</span>
                                <span className="text-gray-600 font-medium">{leadData.email}</span>
                                <span className="text-gray-400 mx-2">|</span>
                                <span className="text-gray-600 font-medium">{leadData.phone}</span>
                            </div>
                        )}
                        {leadData.weddingLocation && (
                            <div className="md:col-span-2 pt-2 border-t border-gray-100 mt-2">
                                <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">{labels.location}</span>
                                <span className="font-semibold text-gray-900">{leadData.weddingLocation}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    {pricing.lineItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm items-center">
                            <span className="text-gray-700 flex-1">
                                {isDiscount(item.priceNet) ? `${labels.discount}: ` : ""}
                                {getLocalized(item.label, lang)}
                            </span>
                            <span className={`font-medium ml-4 ${isDiscount(item.priceNet) ? "text-red-600" : "text-gray-900"}`}>
                                {item.priceNet < 0 ? "-" : ""}
                                {formatCurrency(item.priceNet)}
                            </span>
                        </div>
                    ))}
                </div>

                {pricing.questionAdjustments.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                        <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">{labels.questionAdjustments}</span>
                        {pricing.questionAdjustments.map((adjustment) => (
                            <div key={adjustment.id} className="flex justify-between text-sm items-start">
                                <span className="text-gray-700 flex-1">
                                    {isDiscount(adjustment.priceDeltaNet) ? `${labels.discount}: ` : ""}
                                    {getLocalized(adjustment.questionText, lang)}
                                </span>
                                <span className={`font-medium ml-4 ${isDiscount(adjustment.priceDeltaNet) ? "text-red-600" : "text-emerald-700"}`}>
                                    {formatSignedCurrency(adjustment.priceDeltaNet)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {pricing.additionalAdjustments.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                        <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">{labels.additionalAdjustments}</span>
                        {pricing.additionalAdjustments.map((adjustment) => (
                            <div key={adjustment.id} className="space-y-1">
                                <div className="flex justify-between text-sm items-start">
                                    <span className="text-gray-700 flex-1">
                                        {isDiscount(adjustment.priceDeltaNet) ? `${labels.discount}: ` : ""}
                                        {adjustment.title}
                                    </span>
                                    <span className={`font-medium ml-4 ${isDiscount(adjustment.priceDeltaNet) ? "text-red-600" : "text-emerald-700"}`}>
                                        {formatSignedCurrency(adjustment.priceDeltaNet)}
                                    </span>
                                </div>
                                {adjustment.description && (
                                    <p className="text-xs text-gray-500 italic">{adjustment.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{labels.subtotal}</span>
                        <span>{formatCurrency(pricing.subtotalNet)}</span>
                    </div>
                    {pricing.packageAdjustmentNet !== 0 && (
                        <div className="flex justify-between text-sm text-red-600 font-medium italic">
                            <span>{labels.adjustment}</span>
                            <span>{formatSignedCurrency(pricing.packageAdjustmentNet)}</span>
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t-2 border-gray-900">
                    <div className="flex justify-between items-baseline">
                        <span className="text-base font-bold text-gray-900 uppercase tracking-tight">{labels.totalNet}</span>
                        <span className="text-3xl font-black text-gray-900">{formatCurrency(pricing.totalNet)}</span>
                    </div>
                    <div className="flex justify-end text-xs text-gray-500 mt-1 font-medium">
                        + {labels.vat} {pricing.vatRate * 100}% ({formatCurrency(pricing.vatAmount)}) = {labels.total} {formatCurrency(pricing.totalGross)}
                    </div>
                </div>

                {((pricing.textAnswers && Object.keys(pricing.textAnswers).length > 0) || additionalRequests) && (
                    <div className="mt-6 pt-6 border-t border-dashed border-gray-200 space-y-4">
                        {pricing.textAnswers && Object.entries(pricing.textAnswers).map(([qId, val]) => {
                            const q = config?.customFlow.questions.find(q => q.id === qId);
                            if (!q) return null;
                            return (
                                <div key={qId}>
                                    <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider mb-1">
                                        {getLocalized(q.questionText, lang)}
                                    </span>
                                    <p className="text-sm text-gray-900 border-l-2 border-[#719436] pl-3 py-0.5">
                                        {val}
                                    </p>
                                </div>
                            );
                        })}

                        {additionalRequests && (
                            <div>
                                <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider mb-1">{labels.notes}</span>
                                <p className="text-sm text-gray-700 bg-amber-50/50 p-3 rounded italic border border-amber-100/50">
                                    {additionalRequests}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
