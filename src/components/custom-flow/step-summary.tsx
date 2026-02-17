import { AppConfig, Lead } from "@/lib/config-schema";
import { PricingResult, CustomAnswers } from "@/lib/pricing-engine";
import { QuoteSummary } from "@/components/public/quote-summary";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPrint, faFilePdf, faCheckCircle, faLock } from "@fortawesome/free-solid-svg-icons";
import { LeadGate } from "@/components/public/lead-gate";
import { getLocalized } from "@/lib/i18n-utils";

interface StepSummaryProps {
    pricing: PricingResult;
    config: AppConfig;
    answers: CustomAnswers;
    additionalRequests: string;
    onBack: () => void;
    handleAction: (callback: (lead: Lead) => void) => void;
    leadData?: Partial<Lead>;
    lang?: string;
}

export function StepSummary({
    pricing,
    config,
    answers,
    additionalRequests,
    onBack,
    handleAction,
    leadData,
    lang = "it"
}: StepSummaryProps) {
    const buildQueryString = (lead: any) => {
        const searchParams = new URLSearchParams();
        searchParams.set("custom", "true");

        Object.keys(answers).forEach(key => {
            const val = answers[key];
            if (typeof val === "boolean" && val) {
                searchParams.set(key, "1");
            } else if (typeof val === "string") {
                searchParams.set(key, val);
            }
        });

        if (additionalRequests) {
            searchParams.set("requests", additionalRequests);
        }

        if (lead) {
            if (lead.first_name) searchParams.set("first_name", lead.first_name);
            if (lead.last_name) searchParams.set("last_name", lead.last_name);
            if (lead.email) searchParams.set("email", lead.email);
            if (lead.phone) searchParams.set("phone", lead.phone);
            if (lead.wedding_location) searchParams.set("location", lead.wedding_location);
        }

        return searchParams.toString();
    };

    const queryString = buildQueryString(leadData);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-gray-900 transition-colors">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    {lang === 'it' ? 'Indietro' : 'Back'}
                </Button>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-900">{lang === 'it' ? 'Preventivo Generato' : 'Quote Generated'}</h2>
                    <p className="text-xs text-[#719436] font-bold uppercase tracking-wider mt-1 flex items-center justify-end">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5" />
                        {lang === 'it' ? 'Pronto per il cliente' : 'Ready for client'}
                    </p>
                </div>
            </div>

            <QuoteSummary
                pricing={pricing}
                title={lang === 'it' ? 'La tua configurazione' : 'Your configuration'}
                leadData={leadData}
                additionalRequests={additionalRequests}
                lang={lang}
            />

            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-center shadow-inner">
                <Button
                    size="lg"
                    className="flex-1 h-14 text-lg shadow-md hover:shadow-lg transition-all w-full md:w-auto rounded-2xl"
                    onClick={() => handleAction((lead) => {
                        window.open(`/quote/print?${buildQueryString(lead)}`, "_blank");
                    })}
                >
                    <FontAwesomeIcon icon={faPrint} className="mr-2" />
                    {lang === 'it' ? 'Stampa Preventivo' : 'Print Quote'}
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 h-14 text-lg border-2 w-full md:w-auto rounded-2xl"
                    onClick={() => handleAction((lead) => {
                        window.open(`/quote/pdf?${buildQueryString(lead)}`, "_blank");
                    })}
                >
                    <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                    {lang === 'it' ? 'Scarica PDF' : 'Download PDF'}
                </Button>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 italic">
                    {lang === 'it'
                        ? "Stampa o salva il PDF per consegnarlo al cliente. In caso di dubbio, consulta i pacchetti standard."
                        : "Print or save the PDF to share with the client. If unsure, refer to the standard packages."}
                </p>
            </div>
        </div>
    );
}
