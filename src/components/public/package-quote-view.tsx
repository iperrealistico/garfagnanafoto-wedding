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
import Link from "next/link";

interface PackageQuoteViewProps {
    pkg: Package;
    pricing: PricingResult;
    config: AppConfig;
    lang?: string;
}

export function PackageQuoteView({ pkg, pricing, config, lang = "it" }: PackageQuoteViewProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasProvidedData, setHasProvidedData] = useState(false);
    const [leadData, setLeadData] = useState<Partial<Lead>>({});

    const handleActionClick = (e: React.MouseEvent) => {
        if (!hasProvidedData) {
            e.preventDefault();
            setIsModalOpen(true);
        }
    };

    const onLeadSuccess = (data: Lead) => {
        setLeadData(data);
        setHasProvidedData(true);
        setIsModalOpen(false);
    };

    const searchParams = new URLSearchParams();
    searchParams.set("packageId", pkg.id);
    if (hasProvidedData) {
        searchParams.set("first_name", leadData.first_name || "");
        searchParams.set("last_name", leadData.last_name || "");
        searchParams.set("location", leadData.wedding_location || "");
    }
    const queryString = searchParams.toString();

    const gdprNotice = getLocalized(config.advancedSettings?.gdprNotice, lang) ||
        (lang === 'it'
            ? "I tuoi dati verranno utilizzati esclusivamente per ricontattarti in merito a questa richiesta."
            : "Your data will be used exclusively to contact you regarding this request.");

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
                leadData={hasProvidedData ? leadData : undefined}
                lang={lang}
            />

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                    asChild={hasProvidedData}
                    size="lg"
                    className="flex-1 h-14 text-lg shadow-md rounded-2xl"
                    onClick={!hasProvidedData ? handleActionClick : undefined}
                >
                    {hasProvidedData ? (
                        <Link href={`/quote/print?${queryString}`} target="_blank">
                            <FontAwesomeIcon icon={faPrint} className="mr-2" />
                            {lang === 'it' ? 'Stampa Preventivo' : 'Print Quote'}
                        </Link>
                    ) : (
                        <span>
                            <FontAwesomeIcon icon={faPrint} className="mr-2" />
                            {lang === 'it' ? 'Stampa Preventivo' : 'Print Quote'}
                        </span>
                    )}
                </Button>

                <Button
                    asChild={hasProvidedData}
                    variant="outline"
                    size="lg"
                    className="flex-1 h-14 text-lg border-2 rounded-2xl"
                    onClick={!hasProvidedData ? handleActionClick : undefined}
                >
                    {hasProvidedData ? (
                        <Link href={`/quote/pdf?${queryString}`} target="_blank">
                            <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                            {lang === 'it' ? 'Scarica PDF' : 'Download PDF'}
                        </Link>
                    ) : (
                        <span>
                            <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                            {lang === 'it' ? 'Scarica PDF' : 'Download PDF'}
                        </span>
                    )}
                </Button>
            </div>

            {hasProvidedData && (
                <div className="mt-4 flex items-center justify-center text-green-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    {lang === 'it' ? 'Dati confermati! Ora puoi stampare o scaricare il PDF.' : 'Data confirmed! You can now print or download the PDF.'}
                </div>
            )}

            <LeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={onLeadSuccess}
                gdprNotice={gdprNotice}
                lang={lang}
                initialData={{ package_id: pkg.id }}
            />
        </>
    );
}
