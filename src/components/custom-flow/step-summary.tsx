import { AppConfig, Lead } from "@/lib/config-schema";
import { PricingResult, CustomAnswers } from "@/lib/pricing-engine";
import { QuoteSummary } from "@/components/public/quote-summary";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPrint, faFilePdf, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

interface StepSummaryProps {
    pricing: PricingResult;
    config: AppConfig;
    answers: CustomAnswers;
    additionalRequests: string;
    leadData: Partial<Lead>;
    onBack: () => void;
    lang?: string;
}

export function StepSummary({
    pricing,
    config,
    answers,
    additionalRequests,
    leadData,
    onBack,
    lang = "it"
}: StepSummaryProps) {

    // Construct URL for PDF/Print
    const searchParams = new URLSearchParams();
    searchParams.set("custom", "true");

    Object.keys(answers).forEach(key => {
        if (answers[key]) {
            searchParams.set(key, "1");
        }
    });

    if (additionalRequests) {
        searchParams.set("requests", additionalRequests);
    }

    if (leadData.first_name) searchParams.set("first_name", leadData.first_name);
    if (leadData.last_name) searchParams.set("last_name", leadData.last_name);
    if (leadData.wedding_location) searchParams.set("location", leadData.wedding_location);

    const queryString = searchParams.toString();
    const printUrl = `/quote/print?${queryString}`;
    const pdfUrl = `/quote/pdf?${queryString}`;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-gray-900 transition-colors">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    {lang === 'it' ? 'Indietro' : 'Back'}
                </Button>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-900">{lang === 'it' ? 'Riepilogo Finale' : 'Final Summary'}</h2>
                    <p className="text-xs text-[#719436] font-bold uppercase tracking-wider mt-1 flex items-center justify-end">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5" />
                        {lang === 'it' ? 'Configurazione Completata' : 'Configuration Complete'}
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
                <Button asChild size="lg" className="flex-1 h-14 text-lg shadow-md hover:shadow-lg transition-all w-full md:w-auto">
                    <Link href={printUrl} target="_blank">
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        {lang === 'it' ? 'Stampa Preventivo' : 'Print Quote'}
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1 h-14 text-lg border-2 w-full md:w-auto">
                    <Link href={pdfUrl} target="_blank">
                        <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                        {lang === 'it' ? 'Scarica PDF' : 'Download PDF'}
                    </Link>
                </Button>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 italic">
                    {lang === 'it'
                        ? "* Ti abbiamo inviato una copia di questo preventivo anche via email."
                        : "* We have also sent a copy of this quote to your email."}
                </p>
            </div>
        </div>
    );
}
