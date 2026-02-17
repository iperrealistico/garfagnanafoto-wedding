"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface StepAdditionalRequestsProps {
    value: string;
    onChange: (val: string) => void;
    onNext: () => void;
    onBack: () => void;
    lang: string;
}

export function StepAdditionalRequests({ value, onChange, onNext, onBack, lang }: StepAdditionalRequestsProps) {
    return (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="px-6 pt-4">
                <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-gray-900 px-0">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    {lang === 'it' ? 'Indietro' : 'Back'}
                </Button>
            </div>
            <CardContent className="p-10 space-y-6 text-center">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {lang === 'it' ? 'Note e Richieste Aggiuntive' : 'Additional Notes & Requests'}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {lang === 'it' ? 'Annota eventuali richieste specifiche del cliente.' : 'Note any specific client requests.'}
                    </p>
                </div>

                <div className="text-left space-y-4">
                    <Label htmlFor="requests">
                        {lang === 'it' ? 'Note per il preventivo' : 'Quote notes'}
                    </Label>
                    <Textarea
                        id="requests"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={lang === 'it' ? 'Esempio: Il cliente vorrebbe un album extra, riprese drone...' : 'Example: Client wants an extra album, drone footage...'}
                        className="min-h-[150px]"
                    />
                    <p className="text-xs text-amber-600 italic">
                        {lang === 'it' ? '* Queste richieste verranno valutate e potranno comportare variazioni di prezzo.' : '* These requests will be evaluated and may involve price variations.'}
                    </p>
                </div>

                <Button size="lg" className="w-full h-14 text-lg mt-4" onClick={onNext}>
                    {lang === 'it' ? 'Continua' : 'Continue'}
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Button>
            </CardContent>
        </Card>
    );
}
