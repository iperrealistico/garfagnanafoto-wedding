import { PricingResult } from "@/lib/pricing-engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocalized } from "@/lib/i18n-utils";
import { LeadPayload } from "@/lib/config-schema";

interface QuoteSummaryProps {
    pricing: PricingResult;
    title: string;
    leadData?: Partial<LeadPayload>;
    lang?: string;
}

export function QuoteSummary({
    pricing,
    title,
    leadData,
    lang = "it"
}: QuoteSummaryProps) {
    const formatCurrency = (value: number) => `€${Math.abs(value).toLocaleString("it-IT")}`;
    const formatSignedCurrency = (value: number) => `${value < 0 ? "-" : "+"}${formatCurrency(value)}`;
    const isDiscount = (value: number) => value < 0;
    const hasHiddenPackageDiscount = pricing.packageAdjustmentNet < 0;

    const labels = {
        subtotal: lang === 'it' ? 'Imponibile' : 'Subtotal',
        adjustment: lang === 'it' ? 'Sconto/Adeguamento' : 'Discount/Adjustment',
        packageDiscount: lang === 'it' ? 'Sconto sul pacchetto' : 'Package discount',
        included: lang === 'it' ? 'Incluso' : 'Included',
        discount: lang === 'it' ? 'Sconto' : 'Discount',
        totalNet: lang === 'it' ? 'Totale Netto' : 'Total Net',
        vat: lang === 'it' ? 'IVA' : 'VAT',
        total: lang === 'it' ? 'Totale' : 'Total',
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

                <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{labels.subtotal}</span>
                        <span>{formatCurrency(pricing.subtotalNet)}</span>
                    </div>
                    {pricing.packageAdjustmentNet !== 0 && (
                        <div className={`flex justify-between text-sm font-medium italic ${hasHiddenPackageDiscount ? "text-[#719436]" : "text-red-600"}`}>
                            <span>{hasHiddenPackageDiscount ? labels.packageDiscount : labels.adjustment}</span>
                            <span>{hasHiddenPackageDiscount ? labels.included : formatSignedCurrency(pricing.packageAdjustmentNet)}</span>
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
            </CardContent>
        </Card>
    );
}
