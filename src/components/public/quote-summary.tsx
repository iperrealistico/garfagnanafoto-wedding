import { PricingResult } from "@/lib/pricing-engine";
import { PriceDisplay } from "./price-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// Need to create Separator or use <hr> or border

export function QuoteSummary({ pricing, title }: { pricing: PricingResult; title: string }) {
    return (
        <Card className="w-full bg-white shadow-lg overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                    {pricing.lineItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">{item.label}</span>
                            <span className="font-medium">€{item.priceNet}</span>
                        </div>
                    ))}
                </div>

                <div className="my-4 border-t border-gray-100" />

                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Imponibile</span>
                        <span>€{pricing.subtotalNet}</span>
                    </div>
                    {pricing.packageAdjustmentNet !== 0 && (
                        <div className="flex justify-between text-sm text-green-600 font-medium">
                            <span>Sconto/Adeguamento</span>
                            <span>{pricing.packageAdjustmentNet > 0 ? "+" : ""}€{pricing.packageAdjustmentNet}</span>
                        </div>
                    )}
                </div>

                <div className="my-4 border-t border-gray-200" />

                <div className="flex justify-between items-end">
                    <span className="text-lg font-bold">Totale Netto</span>
                    <span className="text-2xl font-bold">€{pricing.totalNet}</span>
                </div>
                <div className="flex justify-end text-sm text-gray-500">
                    + IVA {pricing.vatRate * 100}% (€{pricing.vatAmount.toFixed(0)}) = Totale €{pricing.totalGross.toFixed(0)}
                </div>
            </CardContent>
        </Card>
    );
}
