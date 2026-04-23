import { describe, it, expect } from 'vitest';
import { calculateFixedPackageQuote } from '../src/lib/pricing-engine';
import { DEFAULT_CONFIG } from '../src/lib/default-config';
import { AppConfigSchema } from '../src/lib/config-schema';

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
        it('calculates "Solo Video" correctly', () => {
            const result = calculateFixedPackageQuote(config, 'pkg_video_only');
            expect(result).toBeDefined();
            expect(result?.subtotalNet).toBe(1200);
            expect(result?.packageAdjustmentNet).toBe(0);
            expect(result?.totalNet).toBe(1200);
            expect(result?.vatAmount).toBeCloseTo(1200 * 0.22);
            expect(result?.totalGross).toBeCloseTo(1200 * 1.22);
        });
    });
});
