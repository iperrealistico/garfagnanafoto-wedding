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
    priceNet: z.number(),
});

export const PackageSchema = z.object({
    id: z.string(),
    name: LocalizedStringSchema,
    tagline: LocalizedStringSchema.optional(),
    description: LocalizedStringSchema.optional(),
    highlights: z.array(LocalizedStringSchema).optional().default([]),
    lineItems: z.array(LineItemSchema),
    packageAdjustmentNet: z.number().default(0),
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
});

export const AppConfigSchema = z.object({
    vatRate: z.number().default(0.22),
    packages: z.array(PackageSchema),
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
    advancedSettings: z.object({
        gdprNotice: LocalizedStringSchema.default({
            it: "I dati inseriti vengono usati solo per personalizzare il preventivo e il PDF nel tuo browser. Non vengono salvati su database o inviati automaticamente.",
            en: "The details you enter are only used to personalize the quote and PDF in your browser. They are not stored in a database or sent automatically."
        }),
        footerText: LocalizedStringSchema.default({
            it: "© 2026 — Garfagnanafoto.it",
            en: "© 2026 — Garfagnanafoto.it"
        }),
    }).optional(),
});


export type LineItem = z.infer<typeof LineItemSchema>;
export type Package = z.infer<typeof PackageSchema>;
export type GalleryImage = z.infer<typeof GalleryImageSchema>;
export type AppConfig = z.infer<typeof AppConfigSchema>;

export type AppConfigInput = z.input<typeof AppConfigSchema>;

export const LeadPayloadSchema = z.object({
    firstName: z.string().trim().min(1, "Il nome è obbligatorio"),
    lastName: z.string().trim().min(1, "Il cognome è obbligatorio"),
    email: z.string().trim().email("Email non valida"),
    phone: z.string().trim().min(5, "Telefono non valido"),
    weddingLocation: z.string().trim().optional(),
});

export type LeadPayload = z.infer<typeof LeadPayloadSchema>;
