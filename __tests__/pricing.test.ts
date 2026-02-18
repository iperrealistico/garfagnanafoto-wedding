import { describe, it, expect } from 'vitest';
import { calculateCustomQuote, calculateFixedPackageQuote } from '../src/lib/pricing-engine';
import { DEFAULT_CONFIG } from '../src/lib/default-config';
import { AppConfigSchema, AdditionalAdjustment } from '../src/lib/config-schema';

// Parse default config to match AppConfig type (handles defaults)
const config = AppConfigSchema.parse(DEFAULT_CONFIG);

describe('Pricing Engine', () => {
    describe('Fixed Packages', () => {
        it('calculates "One" (Photo only) correctly', () => {
            const result = calculateFixedPackageQuote(config, 'pkg_photo_only');
            expect(result).toBeDefined();
            // 900 + 200 = 1100
            expect(result?.subtotalNet).toBe(1100);
            expect(result?.totalNet).toBe(1100);
            expect(result?.vatAmount).toBeCloseTo(1100 * 0.22);
            expect(result?.totalGross).toBeCloseTo(1100 * 1.22);
        });

        it('calculates "Duo" (Photo + Video) correctly with discount', () => {
            const result = calculateFixedPackageQuote(config, 'pkg_photo_video');
            expect(result).toBeDefined();
            // 900 + 200 + 1200 = 2300
            // Discount -100
            expect(result?.subtotalNet).toBe(2300);
            expect(result?.packageAdjustmentNet).toBe(-100);
            expect(result?.totalNet).toBe(2200);
        });
    });

    describe('Custom Flow', () => {
        it('calculates base (Photo only) correctly when no extras selected', () => {
            const answers = {}; // No answers = all false/undefined
            const result = calculateCustomQuote(config, answers);

            // Base: Photo (900) + Edit (200) = 1100
            expect(result.subtotalNet).toBe(1100);
            expect(result.totalNet).toBe(1100);
        });

        it('adds Video correctly', () => {
            const answers = { q_video: true };
            const result = calculateCustomQuote(config, answers);

            // Base (1100) + Video (1200) = 2300
            expect(result.subtotalNet).toBe(2300);
            expect(result.lineItems.find(i => i.id === 'video_full_day')).toBeDefined();
        });

        it('adds Second Photographer correctly', () => {
            const answers = { q_second_photographer: true };
            const result = calculateCustomQuote(config, answers);

            // Base (1100) + 2nd Photo (450) = 1550
            expect(result.subtotalNet).toBe(1550);
        });

        it('handles multiple additions', () => {
            const answers = {
                q_video: true,
                q_drone: true // Drone is 150
            };
            const result = calculateCustomQuote(config, answers);

            // Base 1100 + Video 1200 + Drone 150 = 2450
            expect(result.subtotalNet).toBe(2450);
        });

        it('applies a negative delta on NO answer as a discount', () => {
            const discountedConfig = AppConfigSchema.parse({
                ...DEFAULT_CONFIG,
                customFlow: {
                    ...DEFAULT_CONFIG.customFlow,
                    questions: DEFAULT_CONFIG.customFlow.questions.map((question) =>
                        question.id === "q_second_photographer"
                            ? {
                                ...question,
                                effectsNo: {
                                    ...(question.effectsNo || {}),
                                    priceDeltaNet: -50,
                                },
                            }
                            : question
                    ),
                },
            });

            const result = calculateCustomQuote(discountedConfig, { q_second_photographer: false });

            expect(result.subtotalNet).toBe(1100);
            expect(result.questionAdjustments).toHaveLength(1);
            expect(result.questionAdjustments[0].priceDeltaNet).toBe(-50);
            expect(result.totalNet).toBe(1050);
        });

        it('uses only one pricing mode per effect: line items take precedence over price delta', () => {
            const mixedEffectConfig = AppConfigSchema.parse({
                ...DEFAULT_CONFIG,
                customFlow: {
                    ...DEFAULT_CONFIG.customFlow,
                    questions: DEFAULT_CONFIG.customFlow.questions.map((question) =>
                        question.id === "q_video"
                            ? {
                                ...question,
                                effectsYes: {
                                    ...(question.effectsYes || {}),
                                    priceDeltaNet: 9999,
                                },
                            }
                            : question
                    ),
                },
            });

            const result = calculateCustomQuote(mixedEffectConfig, { q_video: true });

            // Existing line item (+1200) is applied; conflicting delta is ignored.
            expect(result.subtotalNet).toBe(2300);
            expect(result.questionAdjustments).toHaveLength(0);
            expect(result.totalNet).toBe(2300);
        });

        it('applies multiple additional adjustments including negative values', () => {
            const additionalAdjustments: AdditionalAdjustment[] = [
                { id: "adj_1", title: "Drone extra", description: "Riprese extra", priceDeltaNet: 180 },
                { id: "adj_2", title: "Sconto early booking", description: "Promo", priceDeltaNet: -80 },
            ];

            const result = calculateCustomQuote(
                config,
                { q_video: true },
                { additionalAdjustments }
            );

            expect(result.subtotalNet).toBe(2300);
            expect(result.additionalAdjustments).toHaveLength(2);
            expect(result.totalNet).toBe(2400);
        });

        it('clamps total net to 0 when negative adjustments exceed subtotal', () => {
            const result = calculateCustomQuote(
                config,
                {},
                {
                    additionalAdjustments: [
                        { id: "adj_discount", title: "Big discount", priceDeltaNet: -5000 },
                    ],
                }
            );

            expect(result.subtotalNet).toBe(1100);
            expect(result.totalNet).toBe(0);
            expect(result.vatAmount).toBe(0);
            expect(result.totalGross).toBe(0);
        });
    });
});
