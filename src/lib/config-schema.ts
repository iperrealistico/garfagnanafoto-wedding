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

export const AdditionalAdjustmentSchema = z.object({
    id: z.string(),
    title: z.string().trim().min(1, "Titolo obbligatorio"),
    description: z.string().optional(),
    priceDeltaNet: z.number(),
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

export const QuestionTypeSchema = z.enum(["yes_no", "text"]);

export const QuestionSchema = z.object({
    id: z.string(),
    enabled: z.boolean().default(true),
    order: z.number().default(0),
    parentId: z.string().optional(),
    showWhen: z.enum(["always", "yes", "no"]).default("always"),
    type: QuestionTypeSchema.default("yes_no"),
    questionText: LocalizedStringSchema,
    yesLabel: LocalizedStringSchema.default({ it: "Sì", en: "Yes" }),
    noLabel: LocalizedStringSchema.default({ it: "No", en: "No" }),
    required: z.boolean().default(false),
    placeholder: LocalizedStringSchema.optional(),
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
    advancedSettings: z.object({
        gdprNotice: LocalizedStringSchema.default({
            it: "I dati inseriti vengono usati solo per personalizzare il preventivo e il PDF nel tuo browser. Non vengono salvati su database o inviati automaticamente.",
            en: "The details you enter are only used to personalize the quote and PDF in your browser. They are not stored in a database or sent automatically."
        }),
        footerText: LocalizedStringSchema.default({
            it: "© 2026 — Garfagnanafoto.it",
            en: "© 2026 — Garfagnanafoto.it"
        }),
        additionalAdjustments: z.object({
            enabled: z.boolean().default(true),
            sectionTitle: LocalizedStringSchema.default({
                it: "Voci aggiuntive",
                en: "Additional items",
            }),
            addButtonLabel: LocalizedStringSchema.default({
                it: "Aggiungi voce",
                en: "Add item",
            }),
            amountLabel: LocalizedStringSchema.default({
                it: "Importo (IVA esclusa)",
                en: "Amount (VAT excluded)",
            }),
            amountHint: LocalizedStringSchema.default({
                it: "Usa un valore negativo per uno sconto.",
                en: "Use a negative value for a discount.",
            }),
            legacyNotesLabel: LocalizedStringSchema.default({
                it: "Note legacy (opzionale)",
                en: "Legacy notes (optional)",
            }),
        }).default({
            enabled: true,
            sectionTitle: { it: "Voci aggiuntive", en: "Additional items" },
            addButtonLabel: { it: "Aggiungi voce", en: "Add item" },
            amountLabel: { it: "Importo (IVA esclusa)", en: "Amount (VAT excluded)" },
            amountHint: { it: "Usa un valore negativo per uno sconto.", en: "Use a negative value for a discount." },
            legacyNotesLabel: { it: "Note legacy (opzionale)", en: "Legacy notes (optional)" },
        }),
    }).optional(),
});


export type LineItem = z.infer<typeof LineItemSchema>;
export type AdditionalAdjustment = z.infer<typeof AdditionalAdjustmentSchema>;
export type Package = z.infer<typeof PackageSchema>;
export type QuestionEffect = z.infer<typeof QuestionEffectSchema>;
export type Question = z.infer<typeof QuestionSchema>;
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
