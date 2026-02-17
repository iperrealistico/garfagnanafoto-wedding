import { PricingResult } from "@/lib/pricing-engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocalized } from "@/lib/i18n-utils";
import { Lead, AppConfig } from "@/lib/config-schema";

interface QuoteSummaryProps {
    pricing: PricingResult;
    title: string;
    config?: AppConfig;
    additionalRequests?: string;
    leadData?: Partial<Lead>;
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
    const labels = {
        subtotal: lang === 'it' ? 'Imponibile' : 'Subtotal',
        adjustment: lang === 'it' ? 'Sconto/Adeguamento' : 'Discount/Adjustment',
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
                {leadData && (leadData.first_name || leadData.wedding_location) && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {leadData.first_name && (
                            <div>
                                <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">{labels.client}</span>
                                <span className="font-semibold text-gray-900">{leadData.first_name} {leadData.last_name}</span>
                            </div>
                        )}
                        {leadData.wedding_location && (
                            <div>
                                <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">{labels.location}</span>
                                <span className="font-semibold text-gray-900">{leadData.wedding_location}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    {pricing.lineItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm items-center">
                            <span className="text-gray-700 flex-1">{getLocalized(item.label, lang)}</span>
                            <span className="font-medium text-gray-900 ml-4">€{item.priceNet.toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{labels.subtotal}</span>
                        <span>€{pricing.subtotalNet.toLocaleString()}</span>
                    </div>
                    {pricing.packageAdjustmentNet !== 0 && (
                        <div className="flex justify-between text-sm text-red-600 font-medium italic">
                            <span>{labels.adjustment}</span>
                            <span>{pricing.packageAdjustmentNet > 0 ? "+" : ""}€{pricing.packageAdjustmentNet.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t-2 border-gray-900">
                    <div className="flex justify-between items-baseline">
                        <span className="text-base font-bold text-gray-900 uppercase tracking-tight">{labels.totalNet}</span>
                        <span className="text-3xl font-black text-gray-900">€{pricing.totalNet.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-end text-xs text-gray-500 mt-1 font-medium">
                        + {labels.vat} {pricing.vatRate * 100}% (€{pricing.vatAmount.toFixed(0)}) = {labels.total} €{pricing.totalGross.toFixed(0)}
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
                                    "{additionalRequests}"
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
