import { AppConfigInput } from "./config-schema";

export const DEFAULT_CONFIG: AppConfigInput = {
    vatRate: 0.22,
    packages: [
        {
            id: "pkg_photo_only",
            name: { it: "One", en: "One" },
            tagline: { it: "L'essenziale per il tuo matrimonio", en: "The essentials for your wedding" },
            description: {
                it: "Reportage fotografico completo per l'intera giornata, con due fotografi, selezione accurata degli scatti, editing professionale finale e fotolibro incluso.",
                en: "Complete full-day wedding photography coverage with two photographers, curated image selection, professional final editing, and a photobook included."
            },
            highlights: [
                { it: "Due fotografi", en: "Two photographers" },
                { it: "Copertura intera 11:00 - 24:00", en: "Full-day coverage 11:00am - 12:00am" },
                { it: "Selezione delle foto", en: "Photo selection" },
                { it: "Editing professionale", en: "Professional editing" },
                { it: "Fotolibro incluso", en: "Photobook included" },
            ],
            lineItems: [
                { id: "photo_full_day", label: { it: "Due fotografi giornata intera (11:00 - 24:00)", en: "Two photographers full day (11:00am - 12:00am)" }, priceNet: 900, icon: "camera" },
                { id: "photo_edit", label: { it: "Selezione delle foto ed editing professionale", en: "Photo selection and professional editing" }, priceNet: 200, icon: "sliders" },
            ],
            packageAdjustmentNet: 0,
        },
        {
            id: "pkg_photo_video",
            name: { it: "Duo", en: "Duo" },
            tagline: { it: "La copertura completa", en: "Complete coverage" },
            description: {
                it: "Copertura completa foto e video dell'intera giornata, con due fotografi, videomaker, selezione ed editing professionale delle immagini e fotolibro con stampa Professional Line di una selezione di foto.",
                en: "Complete full-day photo and video coverage with two photographers, a videomaker, professional image selection and editing, plus a photobook with Professional Line print of selected images."
            },
            highlights: [
                { it: "Due fotografi", en: "Two photographers" },
                { it: "Copertura intera 11:00 - 24:00", en: "Full-day coverage 11:00am - 12:00am" },
                { it: "Selezione delle foto ed editing professionale", en: "Photo selection and professional editing" },
                { it: "Videomaker + montaggio", en: "Videomaker + editing" },
                { it: "Fotolibro con stampa Professional Line di una selezione di foto", en: "Photobook with Professional Line print of selected images" },
            ],
            lineItems: [
                { id: "photo_full_day", label: { it: "Due fotografi giornata intera (11:00 - 24:00)", en: "Two photographers full day (11:00am - 12:00am)" }, priceNet: 900, icon: "camera" },
                { id: "photo_edit", label: { it: "Selezione delle foto ed editing professionale", en: "Photo selection and professional editing" }, priceNet: 200, icon: "sliders" },
                { id: "video_full_day", label: { it: "Videomaker giornata intera (11:00 - 24:00) + montaggio", en: "Full-day videomaker (11:00am - 12:00am) + editing" }, priceNet: 1200, icon: "video" },
            ],
            packageAdjustmentNet: -100,
        },
        {
            id: "pkg_video_only",
            name: { it: "Solo Video", en: "Video Only" },
            tagline: { it: "Il film del vostro giorno", en: "The film of your day" },
            description: {
                it: "Servizio video completo per l'intera giornata, con videomaker dedicato, montaggio cinematografico, film finale di circa 10 minuti e riprese drone incluse con operatore abilitato.",
                en: "Complete full-day wedding video coverage with a dedicated videomaker, cinematic editing, an approximately 10-minute final film, and drone footage by a licensed operator."
            },
            highlights: [
                { it: "Videomaker", en: "Videomaker" },
                { it: "Montaggio", en: "Editing" },
                { it: "Copertura intera 11:00 - 24:00", en: "Full-day coverage 11:00am - 12:00am" },
                { it: "Durata circa 10 minuti", en: "Approx. 10 minute duration" },
                { it: "Incluso drone da operatore abilitato", en: "Drone footage included by licensed operator" },
            ],
            lineItems: [
                { id: "video_full_day", label: { it: "Videomaker giornata intera (11:00 - 24:00) + montaggio", en: "Full-day videomaker (11:00am - 12:00am) + editing" }, priceNet: 1200, icon: "video" },
            ],
            packageAdjustmentNet: 0,
        },
    ],
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
            it: "I dati inseriti vengono usati solo per personalizzare il preventivo e il PDF nel tuo browser. Non vengono salvati su database o inviati automaticamente.",
            en: "The details you enter are only used to personalize the quote and PDF in your browser. They are not stored in a database or sent automatically."
        },
        footerText: {
            it: "© 2026 — Garfagnanafoto.it",
            en: "© 2026 — Garfagnanafoto.it"
        }
    }
};
