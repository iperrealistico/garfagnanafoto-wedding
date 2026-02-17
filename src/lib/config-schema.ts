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

export const GalleryImageSchema = z.object({
    id: z.string(),
    src: z.string(),
    altByLocale: LocalizedStringSchema.optional().default({ it: "", en: "" }),
    order: z.number().default(0),
    width: z.number().optional(),
    height: z.number().optional(),
});

export const HeaderConfigSchema = z.object({
    title: LocalizedStringSchema,
    logo: z.object({
        src: z.string(),
        alt: LocalizedStringSchema,
    }),
});

export const SeoConfigSchema = z.object({
    metaTitle: LocalizedStringSchema.optional(),
    metaDescription: LocalizedStringSchema.optional(),
    featuredImage: z.string().optional(),
});

export const GlobalCopySchema = z.object({
    heroTitle: LocalizedStringSchema,
    heroSubtitle: LocalizedStringSchema.optional(),
    reviews: z.object({
        ratingValue: z.preprocess((val) => typeof val === 'string' ? parseFloat(val) : val, z.number().default(5.0)),
        ratingLabel: LocalizedStringSchema,
        location: LocalizedStringSchema,
        reviewsUrl: z.string().optional().default("#"),
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
    header: HeaderConfigSchema.optional(),
    seo: SeoConfigSchema.optional(),
    images: z.object({
        hero: z.string().default("/images/garfagnana-foto-wedding-11.jpg"),
        gallery: z.preprocess((val) => {
            if (Array.isArray(val)) {
                return val.map((item, index) => {
                    if (typeof item === "string") {
                        return {
                            id: `img_${index}_${Date.now()}`,
                            src: item,
                            altByLocale: { it: "", en: "" },
                            order: index,
                        };
                    }
                    return item;
                });
            }
            return val;
        }, z.array(GalleryImageSchema)).default([]),
    }).optional(),
});


export type LineItem = z.infer<typeof LineItemSchema>;
export type Package = z.infer<typeof PackageSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type GalleryImage = z.infer<typeof GalleryImageSchema>;
export type AppConfig = z.infer<typeof AppConfigSchema>;

export type AppConfigInput = z.input<typeof AppConfigSchema>;

