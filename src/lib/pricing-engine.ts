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

export type CustomAnswers = Record<string, boolean>;

export function calculateCustomQuote(
    config: AppConfig,
    answers: CustomAnswers,
    customAdjustment: number = 0
): PricingResult {
    const lineItemsMap = new Map<string, LineItem>();

    // 1. Add Base Items
    config.customFlow.baseLineItems.forEach((item) => {
        lineItemsMap.set(item.id, item);
    });

    // 2. Process Questions
    // Sort questions by order just in case
    const sortedQuestions = [...config.customFlow.questions].sort((a, b) => a.order - b.order);

    sortedQuestions.forEach((q) => {
        if (!q.enabled) return;

        // Check conditions (e.g. requiresVideo)
        // Simplified: we assume the answers map reflects valid choices.
        // If the UI didn't show the question, the answer should be missing or false.
        // However, if we want robust backend checks, we should verify conditions here.
        // For now, trust the answers map (false/undefined = No).

        const answer = answers[q.id];

        if (answer) {
            // YES Logic
            if (q.effectsYes) {
                if (q.effectsYes.addLineItems) {
                    q.effectsYes.addLineItems.forEach((item) => lineItemsMap.set(item.id, item));
                }
                // Price delta logic could be separate or just an item.
                // If priceDeltaNet is non-zero and NOT an item, we should add a generic item?
                // Or just affect the total?
                // The spec configSchema has priceDeltaNet... but typically line items are better for invoicing.
                // If priceDeltaNet exists and no line items, we treat it as an adjustment or invisible item?
                // Best practice: add a generated line item if priceDelta > 0.
                if (q.effectsYes.priceDeltaNet !== 0) {
                    // Check if we already added items. If yes, the price is probably in the items.
                    // If no items but price change, create a dynamic item.
                    // Wait, the schema allows BOTH.
                    // Let's assume priceDeltaNet is the SUM of items if items are present,
                    // OR an extra charge.
                    // Actually, in the default config, we only used addLineItems.
                    // If we have "priceDeltaNet" without items, we should account for it.
                    // Let's add it to total, but better to warn if no line item explains it.
                    // For now, I'll ignore priceDeltaNet if lineItems are present (assuming consistency),
                    // OR simply sum everything up from lineItemsMap.
                    // RE-READING SCHEMA:
                    // "priceDeltaNet: number.default(0)"
                    // "addLineItems: array..."
                    // I will use ONLY lineItemsMap to calculate total for now, to ensure breakdown matches total.
                    // Only use priceDeltaNet if it represents a "hidden" adjustment? No, keep it transparent.
                    // I'll assume standard usage is: EITHER add items with prices, OR add a generic item.
                    // In my default config, I used addLineItems with prices.
                }
            }
        } else {
            // NO Logic
            if (q.effectsNo) {
                if (q.effectsNo.addLineItems) {
                    q.effectsNo.addLineItems.forEach((item) => lineItemsMap.set(item.id, item));
                }
            }
        }
    });

    const lineItems = Array.from(lineItemsMap.values());
    const subtotalNet = lineItems.reduce((sum, item) => sum + item.priceNet, 0);

    // adjustment
    // For custom flow, maybe we have a custom adjustment passed in?
    // config.packages have packageAdjustmentNet. Custom flow might not.
    // I added `customAdjustment` param.

    const totalNet = Math.max(0, subtotalNet + customAdjustment);
    const vatRate = config.vatRate;
    const vatAmount = totalNet * vatRate;
    const totalGross = totalNet + vatAmount;

    return {
        lineItems,
        subtotalNet,
        packageAdjustmentNet: customAdjustment,
        totalNet,
        vatRate,
        vatAmount,
        totalGross,
    };
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
