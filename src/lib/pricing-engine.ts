import { AppConfig, LineItem } from "./config-schema";

export type CustomAnswers = Record<string, boolean | string>;

export interface PricingResult {
    lineItems: LineItem[];
    subtotalNet: number;
    packageAdjustmentNet: number;
    totalNet: number;
    vatRate: number;
    vatAmount: number;
    totalGross: number;
    textAnswers?: Record<string, string>; // Store text-type answers for summary
}

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

    // 2. Process Questions Recursively
    const textAnswers: Record<string, string> = {};
    const processedQuestionIds = new Set<string>();

    const processQuestion = (q: any) => {
        if (!q.enabled || processedQuestionIds.has(q.id)) return;
        processedQuestionIds.add(q.id);

        const answer = answers[q.id];

        // Is it a text question?
        if (q.type === "text") {
            if (answer && typeof answer === "string") {
                textAnswers[q.id] = answer;
            }
        }

        if (answer) {
            // YES / TEXT Logic
            if (q.effectsYes) {
                if (q.effectsYes.addLineItems) {
                    q.effectsYes.addLineItems.forEach((item: LineItem) => lineItemsMap.set(item.id, item));
                }
            }
        } else {
            // NO Logic
            if (q.effectsNo) {
                if (q.effectsNo.addLineItems) {
                    q.effectsNo.addLineItems.forEach((item: LineItem) => lineItemsMap.set(item.id, item));
                }
            }
        }

        // Process children if parent answered (for yes/no) or always (if configured)
        const children = config.customFlow.questions.filter(child => child.parentId === q.id);
        children.forEach(child => {
            const isVisible = child.showWhen === "always" ||
                (child.showWhen === "yes" && !!answer) ||
                (child.showWhen === "no" && !answer);

            if (isVisible) {
                processQuestion(child);
            }
        });
    };

    // Start with root questions
    const rootQuestions = config.customFlow.questions
        .filter(q => !q.parentId)
        .sort((a, b) => a.order - b.order);

    rootQuestions.forEach(q => processQuestion(q));

    const lineItems = Array.from(lineItemsMap.values());
    const subtotalNet = lineItems.reduce((sum, item) => sum + item.priceNet, 0);

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
        textAnswers,
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
