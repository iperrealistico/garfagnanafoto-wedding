import { AppConfigInput } from "./config-schema";

export const DEFAULT_CONFIG: AppConfigInput = {
    vatRate: 0.22,
    packages: [
        {
            id: "pkg_photo_only",
            name: "One",
            tagline: "L'essenziale per il tuo matrimonio",
            description: "Servizio fotografico completo con fotolibro.",
            lineItems: [
                { id: "photo_full_day", label: "Fotografo giornata intera (11:00 - 24:00)", priceNet: 900, icon: "camera" },
                { id: "photo_edit", label: "Selezione ed elaborazione foto", priceNet: 200, icon: "sliders" },
            ],
            packageAdjustmentNet: 0,
        },
        {
            id: "pkg_photo_video",
            name: "Duo",
            tagline: "La copertura completa",
            description: "Foto e Video per non perdere nessun momento.",
            lineItems: [
                { id: "photo_full_day", label: "Fotografo giornata intera (11:00 - 24:00)", priceNet: 900, icon: "camera" },
                { id: "photo_edit", label: "Selezione ed elaborazione foto", priceNet: 200, icon: "sliders" },
                { id: "video_full_day", label: "Videomaker + montaggio", priceNet: 1200, icon: "video" },
            ],
            packageAdjustmentNet: -100,
        },
    ],
    customFlow: {
        baseLineItems: [
            { id: "photo_full_day", label: "Fotografo giornata intera (11:00 - 24:00)", priceNet: 900, icon: "camera" },
            { id: "photo_edit", label: "Selezione ed elaborazione foto", priceNet: 200, icon: "sliders" },
        ],
        questions: [
            {
                id: "q_video",
                order: 1,
                enabled: true,
                questionText: "Vuoi anche il servizio video?",
                effectsYes: {
                    addLineItems: [
                        { id: "video_full_day", label: "Videomaker + montaggio", priceNet: 1200, icon: "video" }
                    ]
                }
            },
            {
                id: "q_second_photographer",
                order: 2,
                enabled: true,
                questionText: "Serve un secondo fotografo per coprire preparazioni o location diverse?",
                effectsYes: {
                    addLineItems: [
                        { id: "second_photographer", label: "Secondo fotografo giornata intera", priceNet: 450, icon: "users" }
                    ]
                }
            },
            {
                id: "q_photobook",
                order: 3,
                enabled: true,
                questionText: "Vuoi includere un fotolibro premium 28x28 (circa 100 foto)?",
                effectsYes: {
                    addLineItems: [
                        { id: "photobook_premium", label: "Fotolibro premium 28x28", priceNet: 150, icon: "book-open" }
                    ]
                }
            },
            {
                id: "q_drone",
                order: 4,
                enabled: true,
                questionText: "Vuoi riprese con drone (operatore abilitato)?",
                requiredConditions: { requiresVideo: true },
                effectsYes: {
                    addLineItems: [
                        { id: "drone", label: "Riprese con drone", priceNet: 150, icon: "plane" }
                    ],
                }
            },
            {
                id: "q_extra_videomaker",
                order: 5,
                enabled: true,
                questionText: "Hai richieste di ripresa specifiche e complesse che richiedono un videomaker aggiuntivo?",
                effectsYes: {
                    addLineItems: [
                        { id: "extra_videomaker", label: "Videomaker aggiuntivo", priceNet: 450, icon: "user-plus" }
                    ]
                }
            },
            {
                id: "q_half_day",
                order: 6,
                enabled: true,
                questionText: "Preferisci mezza giornata o orari ridotti?",
                effectsYes: {
                    priceDeltaNet: 0 // Da impostare
                }
            },
            {
                id: "q_additional_requests",
                order: 7,
                enabled: true,
                questionText: "Ci sono ulteriori richieste specifiche aggiuntive che potrebbero variare il prezzo?",
                effectsYes: {
                    notes: { triggersAdditionalRequestsBox: true }
                }
            }
        ]
    },
    legalCopy: {
        deliveryTime: "Consegna prevista: 30-60 giorni lavorativi.",
        paymentTerms: "Pagamento: 20% acconto alla conferma, 80% alla consegna.",
        disclaimer: "Trasferte incluse entro 50km. Per distanze superiori verrà calcolato un rimborso chilometrico."
    },
    images: {
        hero: "/images/garfagnana-foto-wedding-11.jpg",
        gallery: [
            "/images/garfagnana-foto-wedding-1.jpg",
            "/images/garfagnana-foto-wedding-2.jpg",
            "/images/garfagnana-foto-wedding-3.jpg",
            "/images/garfagnana-foto-wedding-4.jpg",
            "/images/garfagnana-foto-wedding-5.jpg",
            "/images/garfagnana-foto-wedding-6.jpg",
            "/images/garfagnana-foto-wedding-7.jpg",
            "/images/garfagnana-foto-wedding-8.jpg",
            "/images/garfagnana-foto-wedding-9.jpg",
            "/images/garfagnana-foto-wedding-10.jpg"
        ]
    }
};

