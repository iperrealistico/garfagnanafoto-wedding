import { z } from "zod";

export const LocalizedStringSchema = z.object({
    it: z.string(),
    en: z.string().optional().default(""),
});

export type LocalizedString = z.infer<typeof LocalizedStringSchema>;

export const IconNameSchema = z.string().describe("FontAwesome icon class name");

export const LineItemSchema = z.object({
    id: z.string(),
    label: LocalizedStringSchema,
    icon: IconNameSchema.optional(),
    priceNet: z.number().min(0),
});

export const PackageSchema = z.object({
    id: z.string(),
    name: LocalizedStringSchema,
    tagline: LocalizedStringSchema.optional(),
    description: LocalizedStringSchema.optional(),
    lineItems: z.array(LineItemSchema),
    packageAdjustmentNet: z.number().default(0),
});

export const QuestionEffectSchema = z.object({
    addLineItems: z.array(LineItemSchema).optional(),
    priceDeltaNet: z.number().default(0),
    notes: z.object({
        triggersAdditionalRequestsBox: z.boolean().optional(),
    }).optional(),
});

export const QuestionSchema = z.object({
    id: z.string(),
    enabled: z.boolean().default(true),
    order: z.number().default(0),
    questionText: LocalizedStringSchema,
    yesLabel: LocalizedStringSchema.default({ it: "Sì", en: "Yes" }),
    noLabel: LocalizedStringSchema.default({ it: "No", en: "No" }),
    requiredConditions: z.object({
        requiresVideo: z.boolean().optional(),
    }).optional(),
    effectsYes: QuestionEffectSchema.optional(),
    effectsNo: QuestionEffectSchema.optional(),
});

export const CustomFlowSchema = z.object({
    baseLineItems: z.array(LineItemSchema),
    questions: z.array(QuestionSchema),
});

export const GlobalCopySchema = z.object({
    heroTitle: LocalizedStringSchema,
    heroSubtitle: LocalizedStringSchema.optional(),
    reviews: z.object({
        ratingValue: z.number().default(5.0),
        ratingLabel: LocalizedStringSchema,
        location: LocalizedStringSchema,
        reviewsUrl: z.string().default("#"),
    }),
    footerText: LocalizedStringSchema.optional(),
});

export const AppConfigSchema = z.object({
    vatRate: z.number().default(0.22),
    packages: z.array(PackageSchema),
    customFlow: CustomFlowSchema,
    legalCopy: z.object({
        deliveryTime: LocalizedStringSchema,
        paymentTerms: LocalizedStringSchema,
        disclaimer: LocalizedStringSchema,
    }),
    copy: GlobalCopySchema.optional(),
    images: z.object({
        hero: z.string().default("/images/garfagnana-foto-wedding-11.jpg"),
        gallery: z.array(z.string()).default([]),
    }).optional(),
});


export type LineItem = z.infer<typeof LineItemSchema>;
export type Package = z.infer<typeof PackageSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type AppConfig = z.infer<typeof AppConfigSchema>;

export type AppConfigInput = z.input<typeof AppConfigSchema>;

