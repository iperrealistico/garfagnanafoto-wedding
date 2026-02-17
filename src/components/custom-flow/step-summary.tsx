import { AppConfig } from "@/lib/config-schema";
import { PricingResult, CustomAnswers } from "@/lib/pricing-engine";
import { QuoteSummary } from "@/components/public/quote-summary";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPrint, faFilePdf } from "@fortawesome/free-solid-svg-icons";

interface StepSummaryProps {
    pricing: PricingResult;
    config: AppConfig;
    answers: CustomAnswers;
    additionalRequests: string;
    onAdditionalRequestsChange: (val: string) => void;
    showAdditionalRequests: boolean;
    onBack: () => void;
}

export function StepSummary({
    pricing,
    config,
    answers,
    additionalRequests,
    onAdditionalRequestsChange,
    showAdditionalRequests,
    onBack
}: StepSummaryProps) {

    // Construct URL for PDF/Print
    // We serialize answers to query params
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

    const queryString = searchParams.toString();
    const printUrl = `/quote/print?${queryString}`;
    const pdfUrl = `/quote/pdf?${queryString}`;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="text-gray-500">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Indietro
                </Button>
                <h2 className="text-2xl font-bold">Riepilogo Finale</h2>
            </div>

            {showAdditionalRequests && (
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <Label htmlFor="requests" className="mb-2 block text-yellow-800">Note e Richieste Aggiuntive</Label>
                    <Textarea
                        id="requests"
                        value={additionalRequests}
                        onChange={(e) => onAdditionalRequestsChange(e.target.value)}
                        placeholder="Descrivi qui le tue richieste specifiche..."
                        className="bg-white"
                    />
                    <p className="text-xs text-yellow-700 mt-2">
                        * Queste richieste verranno valutate e potranno comportare variazioni di prezzo non incluse nel totale attuale.
                    </p>
                </div>
            )}

            <QuoteSummary pricing={pricing} title="La tua configurazione" />

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="flex-1">
                    <Link href={printUrl} target="_blank">
                        <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        Stampa Preventivo
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1">
                    <Link href={pdfUrl} target="_blank">
                        <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                        Scarica PDF
                    </Link>
                </Button>
            </div>
        </div>
    );
}
