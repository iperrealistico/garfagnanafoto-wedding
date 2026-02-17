import { LeadPayload } from "@/lib/config-schema";
import { PricingResult, CustomAnswers } from "@/lib/pricing-engine";
import { QuoteSummary } from "@/components/public/quote-summary";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPrint, faFilePdf, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { resolveQuoteDocumentActionUrl } from "@/lib/quote-document-url";
import { toast } from "sonner";

interface StepSummaryProps {
    pricing: PricingResult;
    answers: CustomAnswers;
    additionalRequests: string;
    onBack: () => void;
    handleAction: (callback: (lead: LeadPayload) => void) => void;
    leadData?: Partial<LeadPayload>;
    lang?: string;
}

export function StepSummary({
    pricing,
    answers,
    additionalRequests,
    onBack,
    handleAction,
    leadData,
    lang = "it"
}: StepSummaryProps) {
    const openQuoteAction = (action: "download" | "print", lead: LeadPayload) => {
        const href = resolveQuoteDocumentActionUrl(action, {
            isCustom: true,
            answers,
            additionalRequests,
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
                    onClick={() => handleAction((lead) => openQuoteAction("print", lead))}
                >
                    <FontAwesomeIcon icon={faPrint} className="mr-2" />
                    {lang === 'it' ? 'Stampa Preventivo' : 'Print Quote'}
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 h-14 text-lg border-2 w-full md:w-auto rounded-2xl"
                    onClick={() => handleAction((lead) => openQuoteAction("download", lead))}
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
