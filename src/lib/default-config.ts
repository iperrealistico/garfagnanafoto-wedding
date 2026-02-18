import { AppConfigInput } from "./config-schema";

export const DEFAULT_CONFIG: AppConfigInput = {
    vatRate: 0.22,
    packages: [
        {
            id: "pkg_photo_only",
            name: { it: "One", en: "One" },
            tagline: { it: "L'essenziale per il tuo matrimonio", en: "The essentials for your wedding" },
            description: { it: "Servizio fotografico completo con fotolibro.", en: "Full photographic service including photobook." },
            lineItems: [
                { id: "photo_full_day", label: { it: "Fotografo giornata intera (11:00 - 24:00)", en: "Full day photographer (11am - 12pm)" }, priceNet: 900, icon: "camera" },
                { id: "photo_edit", label: { it: "Selezione ed elaborazione foto", en: "Photo selection and editing" }, priceNet: 200, icon: "sliders" },
            ],
            packageAdjustmentNet: 0,
        },
        {
            id: "pkg_photo_video",
            name: { it: "Duo", en: "Duo" },
            tagline: { it: "La copertura completa", en: "Complete coverage" },
            description: { it: "Foto e Video per non perdere nessun momento.", en: "Photo and Video to capture every moment." },
            lineItems: [
                { id: "photo_full_day", label: { it: "Fotografo giornata intera (11:00 - 24:00)", en: "Full day photographer (11am - 12pm)" }, priceNet: 900, icon: "camera" },
                { id: "photo_edit", label: { it: "Selezione ed elaborazione foto", en: "Photo selection and editing" }, priceNet: 200, icon: "sliders" },
                { id: "video_full_day", label: { it: "Videomaker + montaggio", en: "Videomaker + editing" }, priceNet: 1200, icon: "video" },
            ],
            packageAdjustmentNet: -100,
        },
    ],
    customFlow: {
        baseLineItems: [
            { id: "photo_full_day", label: { it: "Fotografo giornata intera (11:00 - 24:00)", en: "Full day photographer (11am - 12pm)" }, priceNet: 900, icon: "camera" },
            { id: "photo_edit", label: { it: "Selezione ed elaborazione foto", en: "Photo selection and editing" }, priceNet: 200, icon: "sliders" },
        ],
        questions: [
            {
                id: "q_video",
                order: 1,
                enabled: true,
                questionText: { it: "Vuoi anche il servizio video?", en: "Do you also want video service?" },
                effectsYes: {
                    addLineItems: [
                        { id: "video_full_day", label: { it: "Videomaker + montaggio", en: "Videomaker + editing" }, priceNet: 1200, icon: "video" }
                    ]
                }
            },
            {
                id: "q_second_photographer",
                order: 2,
                enabled: true,
                questionText: { it: "Serve un secondo fotografo per coprire preparazioni o location diverse?", en: "Do you need a second photographer?" },
                effectsYes: {
                    addLineItems: [
                        { id: "second_photographer", label: { it: "Secondo fotografo giornata intera", en: "Second photographer full day" }, priceNet: 450, icon: "users" }
                    ]
                }
            },
            {
                id: "q_photobook",
                order: 3,
                enabled: true,
                questionText: { it: "Vuoi includere un fotolibro premium 28x28 (circa 100 foto)?", en: "Include a premium 28x28 photobook?" },
                effectsYes: {
                    addLineItems: [
                        { id: "photobook_premium", label: { it: "Fotolibro premium 28x28", en: "Premium photobook 28x28" }, priceNet: 150, icon: "book-open" }
                    ]
                }
            },
            {
                id: "q_drone",
                order: 4,
                enabled: true,
                questionText: { it: "Vuoi riprese con drone (operatore abilitato)?", en: "Do you want drone footage?" },
                requiredConditions: { requiresVideo: true },
                effectsYes: {
                    addLineItems: [
                        { id: "drone", label: { it: "Riprese con drone", en: "Drone footage" }, priceNet: 150, icon: "plane" }
                    ],
                }
            },
            {
                id: "q_extra_videomaker",
                order: 5,
                enabled: true,
                questionText: { it: "Hai richieste di ripresa specifiche e complesse che richiedono un videomaker aggiuntivo?", en: "Do you need an extra videomaker?" },
                effectsYes: {
                    addLineItems: [
                        { id: "extra_videomaker", label: { it: "Videomaker aggiuntivo", en: "Extra videomaker" }, priceNet: 450, icon: "user-plus" }
                    ]
                }
            },
            {
                id: "q_half_day",
                order: 6,
                enabled: true,
                questionText: { it: "Preferisci mezza giornata o orari ridotti?", en: "Do you prefer half day or reduced hours?" },
                effectsYes: {
                    priceDeltaNet: 0 // Da impostare
                }
            },
            {
                id: "q_additional_requests",
                order: 7,
                enabled: true,
                questionText: { it: "Ci sono ulteriori richieste specifiche aggiuntive che potrebbero variare il prezzo?", en: "Any other specific requests?" },
                effectsYes: {
                    notes: { triggersAdditionalRequestsBox: true }
                }
            }
        ]
    },
    legalCopy: {
        deliveryTime: { it: "Consegna prevista: 30-60 giorni lavorativi.", en: "Estimated delivery: 30-60 working days." },
        paymentTerms: { it: "Pagamento: 20% acconto alla conferma, 80% alla consegna.", en: "Payment: 20% deposit on confirmation, 80% on delivery." },
        disclaimer: { it: "Trasferte incluse entro 50km. Per distanze superiori verrà calcolato un rimborso chilometrico.", en: "Travel included within 50km. Extra mileage will be charged for longer distances." }
    },
    copy: {
        heroTitle: { it: "Reportage di Matrimonio in Toscana", en: "Wedding Reportage in Tuscany" },
        heroSubtitle: { it: "Catturiamo l'essenza del vostro amore in ogni scatto.", en: "We capture the essence of your love in every shot." },
        reviews: {
            ratingValue: 5.0,
            ratingLabel: { it: "124 recensioni", en: "124 reviews" },
            location: { it: "Pieve Fosciana, Garfagnana", en: "Pieve Fosciana, Garfagnana" },
            reviewsUrl: "#"
        }
    },
    header: {
        title: { it: "Garfagnanafoto.it", en: "Garfagnanafoto.it" },
        logo: {
            src: "/images/logo.png",
            alt: { it: "Garfagnanafoto Logo", en: "Garfagnanafoto Logo" }
        }
    },
    seo: {
        metaTitle: { it: "Garfagnanafoto | Fotografo Matrimonio Toscana", en: "Garfagnanafoto | Wedding Photographer Tuscany" },
        metaDescription: {
            it: "Servizi fotografici e video per matrimoni in stile reportage. Basati in Garfagnana, operiamo in tutta la Toscana.",
            en: "Wedding photography and video services in reportage style. Based in Garfagnana, serving all of Tuscany."
        },
        featuredImage: "/images/garfagnana-foto-wedding-11.jpg"
    },
    images: {
        hero: "/images/garfagnana-foto-wedding-11.jpg",
        gallery: [
            { id: "img_1", src: "/images/garfagnana-foto-wedding-1.jpg", order: 0, altByLocale: { it: "Matrimonio in Garfagnana", en: "Wedding in Tuscany" } },
            { id: "img_2", src: "/images/garfagnana-foto-wedding-2.jpg", order: 1, altByLocale: { it: "Matrimonio in Garfagnana", en: "Wedding in Tuscany" } },
            { id: "img_3", src: "/images/garfagnana-foto-wedding-3.jpg", order: 2, altByLocale: { it: "Matrimonio in Garfagnana", en: "Wedding in Tuscany" } },
            { id: "img_4", src: "/images/garfagnana-foto-wedding-4.jpg", order: 3, altByLocale: { it: "Matrimonio in Garfagnana", en: "Wedding in Tuscany" } },
            { id: "img_5", src: "/images/garfagnana-foto-wedding-5.jpg", order: 4, altByLocale: { it: "Matrimonio in Garfagnana", en: "Wedding in Tuscany" } },
            { id: "img_6", src: "/images/garfagnana-foto-wedding-6.jpg", order: 5, altByLocale: { it: "Matrimonio in Garfagnana", en: "Wedding in Tuscany" } },
            { id: "img_7", src: "/images/garfagnana-foto-wedding-7.jpg", order: 6, altByLocale: { it: "Matrimonio in Garfagnana", en: "Wedding in Tuscany" } },
            { id: "img_8", src: "/images/garfagnana-foto-wedding-8.jpg", order: 7, altByLocale: { it: "Matrimonio in Garfagnana", en: "Wedding in Tuscany" } },
            { id: "img_9", src: "/images/garfagnana-foto-wedding-9.jpg", order: 8, altByLocale: { it: "Matrimonio in Garfagnana", en: "Wedding in Tuscany" } },
            { id: "img_10", src: "/images/garfagnana-foto-wedding-10.jpg", order: 9, altByLocale: { it: "Matrimonio in Garfagnana", en: "Wedding in Tuscany" } }
        ]
    },
    advancedSettings: {
        gdprNotice: {
            it: "I tuoi dati verranno utilizzati esclusivamente per ricontattarti in merito a questa richiesta. Non verranno utilizzati per marketing né ceduti a terzi.",
            en: "Your data will be used exclusively to contact you regarding this request. It will not be used for marketing or shared with third parties."
        },
        footerText: {
            it: "© 2026 — Garfagnanafoto.it",
            en: "© 2026 — Garfagnanafoto.it"
        },
        additionalAdjustments: {
            enabled: true,
            sectionTitle: {
                it: "Voci aggiuntive",
                en: "Additional items"
            },
            addButtonLabel: {
                it: "Aggiungi voce",
                en: "Add item"
            },
            amountLabel: {
                it: "Importo (IVA esclusa)",
                en: "Amount (VAT excluded)"
            },
            amountHint: {
                it: "Usa un valore negativo per uno sconto.",
                en: "Use a negative value for a discount."
            },
            legacyNotesLabel: {
                it: "Note legacy (opzionale)",
                en: "Legacy notes (optional)"
            }
        }
    }
};
