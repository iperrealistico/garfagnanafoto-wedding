import { AppConfig, AdditionalAdjustment, LineItem, LocalizedString } from "./config-schema";

export type CustomAnswers = Record<string, boolean | string>;

export interface AppliedQuestionAdjustment {
    id: string;
    questionId: string;
    questionText: LocalizedString;
    appliedOn: "yes" | "no";
    priceDeltaNet: number;
}

export interface PricingResult {
    lineItems: LineItem[];
    questionAdjustments: AppliedQuestionAdjustment[];
    additionalAdjustments: AdditionalAdjustment[];
    subtotalNet: number;
    packageAdjustmentNet: number;
    totalNet: number;
    vatRate: number;
    vatAmount: number;
    totalGross: number;
    textAnswers?: Record<string, string>; // Store text-type answers for summary
}

interface CustomQuoteOptions {
    customAdjustmentNet?: number;
    additionalAdjustments?: ReadonlyArray<AdditionalAdjustment>;
}

type CustomQuoteAdjustmentInput = number | CustomQuoteOptions;

function resolveCustomQuoteOptions(input: CustomQuoteAdjustmentInput = 0): { customAdjustmentNet: number; additionalAdjustments: AdditionalAdjustment[] } {
    if (typeof input === "number") {
        return {
            customAdjustmentNet: input,
            additionalAdjustments: [],
        };
    }

    return {
        customAdjustmentNet: input.customAdjustmentNet || 0,
        additionalAdjustments: input.additionalAdjustments ? [...input.additionalAdjustments] : [],
    };
}

export function calculateCustomQuote(
    config: AppConfig,
    answers: CustomAnswers,
    customAdjustmentInput: CustomQuoteAdjustmentInput = 0
): PricingResult {
    const { customAdjustmentNet, additionalAdjustments } = resolveCustomQuoteOptions(customAdjustmentInput);
    const lineItemsMap = new Map<string, LineItem>();
    const questionAdjustments: AppliedQuestionAdjustment[] = [];

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
        const hasPositiveAnswer = q.type === "text"
            ? typeof answer === "string" && answer.trim().length > 0
            : !!answer;

        // Is it a text question?
        if (q.type === "text") {
            if (typeof answer === "string" && answer.trim()) {
                textAnswers[q.id] = answer;
            }
        }

        const activeEffects = hasPositiveAnswer ? q.effectsYes : q.effectsNo;
        if (activeEffects) {
            if (activeEffects.addLineItems) {
                activeEffects.addLineItems.forEach((item: LineItem) => lineItemsMap.set(item.id, item));
            }
            if (activeEffects.priceDeltaNet) {
                questionAdjustments.push({
                    id: `${q.id}_${hasPositiveAnswer ? "yes" : "no"}`,
                    questionId: q.id,
                    questionText: q.questionText,
                    appliedOn: hasPositiveAnswer ? "yes" : "no",
                    priceDeltaNet: activeEffects.priceDeltaNet,
                });
            }
        }

        // Process children if parent answered (for yes/no) or always (if configured)
        const children = config.customFlow.questions.filter(child => child.parentId === q.id);
        children.forEach(child => {
            const isVisible = child.showWhen === "always" ||
                (child.showWhen === "yes" && hasPositiveAnswer) ||
                (child.showWhen === "no" && !hasPositiveAnswer);

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
    const questionAdjustmentsNet = questionAdjustments.reduce((sum, adjustment) => sum + adjustment.priceDeltaNet, 0);
    const additionalAdjustmentsNet = additionalAdjustments.reduce((sum, adjustment) => sum + adjustment.priceDeltaNet, 0);

    const totalNet = Math.max(0, subtotalNet + customAdjustmentNet + questionAdjustmentsNet + additionalAdjustmentsNet);
    const vatRate = config.vatRate;
    const vatAmount = totalNet * vatRate;
    const totalGross = totalNet + vatAmount;

    return {
        lineItems,
        questionAdjustments,
        additionalAdjustments,
        subtotalNet,
        packageAdjustmentNet: customAdjustmentNet,
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
        questionAdjustments: [],
        additionalAdjustments: [],
        subtotalNet,
        packageAdjustmentNet: adjustment,
        totalNet,
        vatRate,
        vatAmount,
        totalGross,
    };
}
