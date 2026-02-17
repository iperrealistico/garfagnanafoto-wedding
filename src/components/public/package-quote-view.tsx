"use client";

import { useState } from "react";
import { AppConfig, Package, Lead } from "@/lib/config-schema";
import { PricingResult } from "@/lib/pricing-engine";
import { QuoteSummary } from "./quote-summary";
import { Button } from "@/components/ui/button";
import { LeadModal } from "./lead-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faFilePdf, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { getLocalized } from "@/lib/i18n-utils";
import { LeadGate } from "./lead-gate";
import Link from "next/link";

interface PackageQuoteViewProps {
    pkg: Package;
    pricing: PricingResult;
    config: AppConfig;
    lang?: string;
}

export function PackageQuoteView({ pkg, pricing, config, lang = "it" }: PackageQuoteViewProps) {
    const gdprNotice = getLocalized(config.advancedSettings?.gdprNotice, lang) ||
        (lang === 'it'
            ? "I tuoi dati verranno utilizzati esclusivamente per ricontattarti in merito a questa richiesta."
            : "Your data will be used exclusively to contact you regarding this request.");

    const buildQueryString = (lead: any) => {
        const searchParams = new URLSearchParams();
        searchParams.set("packageId", pkg.id);
        if (lead) {
            searchParams.set("first_name", lead.first_name || "");
            searchParams.set("last_name", lead.last_name || "");
            searchParams.set("email", lead.email || "");
            searchParams.set("phone", lead.phone || "");
            searchParams.set("location", lead.wedding_location || "");
        }
        return searchParams.toString();
    };

    return (
        <LeadGate
            quoteSnapshot={pricing}
            gdprNotice={gdprNotice}
            lang={lang}
            initialLeadData={{ package_id: pkg.id }}
        >
            {({ handleAction, leadData }) => {
                const queryString = buildQueryString(leadData);

                return (
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
                                onClick={() => handleAction(() => {
                                    window.open(`/quote/print?${queryString}`, "_blank");
                                })}
                            >
                                <FontAwesomeIcon icon={faPrint} className="mr-2" />
                                {lang === 'it' ? 'Stampa Preventivo' : 'Print Quote'}
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="flex-1 h-14 text-lg border-2 rounded-2xl"
                                onClick={() => handleAction(() => {
                                    window.open(`/quote/pdf?${queryString}`, "_blank");
                                })}
                            >
                                <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                                {lang === 'it' ? 'Scarica PDF' : 'Download PDF'}
                            </Button>
                        </div>
                    </>
                );
            }}
        </LeadGate>
    );
}
