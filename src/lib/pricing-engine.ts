import { AppConfig, LineItem } from "./config-schema";

export interface PricingResult {
    lineItems: LineItem[];
    subtotalNet: number;
    packageAdjustmentNet: number;
    totalNet: number;
    vatRate: number;
    vatAmount: number;
    totalGross: number;
}

export function calculateFixedPackageQuote(
    config: AppConfig,
    packageId: string
): PricingResult | null {
    const pkg = config.packages.find((p) => p.id === packageId);
    if (!pkg) return null;

    const subtotalNet = pkg.lineItems.reduce((sum, item) => sum + item.priceNet, 0);
    const adjustment = pkg.packageAdjustmentNet;
    const totalNet = Math.max(0, subtotalNet + adjustment);
    const vatRate = config.vatRate;
    const vatAmount = totalNet * vatRate;
    const totalGross = totalNet + vatAmount;

    return {
        lineItems: pkg.lineItems,
        subtotalNet,
        packageAdjustmentNet: adjustment,
        totalNet,
        vatRate,
        vatAmount,
        totalGross,
    };
}
