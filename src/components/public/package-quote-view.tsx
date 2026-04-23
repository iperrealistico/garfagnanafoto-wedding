"use client";

import { AppConfig, LeadPayload, Package } from "@/lib/config-schema";
import { PricingResult } from "@/lib/pricing-engine";
import { QuoteSummary } from "./quote-summary";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { getLocalized } from "@/lib/i18n-utils";
import { LeadGate } from "./lead-gate";
import { resolveQuoteDocumentActionUrl } from "@/lib/quote-document-url";
import { toast } from "sonner";

interface PackageQuoteViewProps {
    pkg: Package;
    pricing: PricingResult;
    config: AppConfig;
    lang?: string;
}

export function PackageQuoteView({ pkg, pricing, config, lang = "it" }: PackageQuoteViewProps) {
    const gdprNotice = getLocalized(config.advancedSettings?.gdprNotice, lang) ||
        (lang === 'it'
            ? "I dati inseriti vengono usati solo per personalizzare il preventivo nel tuo browser."
            : "The details you enter are only used to personalize the quote in your browser.");

    const openQuoteAction = (action: "download" | "print", lead: LeadPayload) => {
        const href = resolveQuoteDocumentActionUrl(action, {
            packageId: pkg.id,
            lead,
        });

        const opened = window.open(href, "_blank", "noopener,noreferrer");
        if (!opened) {
            toast.error(
                lang === "it"
                    ? "Il browser ha bloccato l'apertura del documento. Consenti i popup e riprova."
                    : "Your browser blocked the document popup. Allow popups and try again."
            );
        }
    };

    return (
        <LeadGate
            quoteSnapshot={pricing}
            gdprNotice={gdprNotice}
            lang={lang}
        >
            {({ handleAction, leadData }) => (
                <>
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                            {getLocalized(pkg.name, lang)}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            {getLocalized(pkg.description, lang)}
                        </p>
                    </div>

                    <QuoteSummary
                        pricing={pricing}
                        title={lang === 'it' ? 'Dettaglio Preventivo' : 'Quote Detail'}
                        leadData={leadData}
                        lang={lang}
                    />

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="flex-1 h-14 text-lg shadow-md rounded-2xl"
                            onClick={() => handleAction((lead) => openQuoteAction("print", lead))}
                        >
                            <FontAwesomeIcon icon={faPrint} className="mr-2" />
                            {lang === 'it' ? 'Stampa Preventivo' : 'Print Quote'}
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="flex-1 h-14 text-lg border-2 rounded-2xl"
                            onClick={() => handleAction((lead) => openQuoteAction("download", lead))}
                        >
                            <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                            {lang === 'it' ? 'Scarica PDF' : 'Download PDF'}
                        </Button>
                    </div>
                </>
            )}
        </LeadGate>
    );
}
