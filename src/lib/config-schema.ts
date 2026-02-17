import { z } from "zod";

export const IconNameSchema = z.string().describe("FontAwesome icon class name");

export const LineItemSchema = z.object({
    id: z.string(),
    label: z.string(),
    icon: IconNameSchema.optional(),
    priceNet: z.number().min(0),
});

export const PackageSchema = z.object({
    id: z.string(),
    name: z.string(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    lineItems: z.array(LineItemSchema),
    packageAdjustmentNet: z.number().default(0), // Can be negative for discount
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
    questionText: z.string(),
    yesLabel: z.string().default("Sì"),
    noLabel: z.string().default("No"),
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

export const AppConfigSchema = z.object({
    vatRate: z.number().default(0.22),
    packages: z.array(PackageSchema),
    customFlow: CustomFlowSchema,
    legalCopy: z.object({
        deliveryTime: z.string(),
        paymentTerms: z.string(),
        disclaimer: z.string(),
    }),
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

