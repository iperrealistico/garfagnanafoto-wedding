"use client";

import { useState, useMemo } from "react";
import { AppConfig, Question, Lead } from "@/lib/config-schema";
import { calculateCustomQuote, CustomAnswers } from "@/lib/pricing-engine";
import { StepQuestion } from "./step-question";
import { StepSummary } from "./step-summary";
import { StepAdditionalRequests } from "./step-additional-requests";
import { LeadForm } from "../public/lead-form";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUserCheck, faLock } from "@fortawesome/free-solid-svg-icons";
import { getLocalized } from "@/lib/i18n-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FlowStep = 'questions' | 'requests' | 'persona' | 'summary';

interface WizardContainerProps {
    config: AppConfig;
    lang?: string;
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Use the same admin login action
        const res = await fetch("/api/admin/custom-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });
        if (res.ok) {
            onUnlock();
        } else {
            setError(true);
        }
    };

    return (
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden max-w-md mx-auto">
            <CardContent className="p-8 md:p-10 space-y-6">
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                        <FontAwesomeIcon icon={faLock} className="text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Area Riservata</h2>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Il configuratore personalizzato è riservato al fotografo.<br />
                        Inserisci la password admin per procedere.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="custom-pw">Password</Label>
                        <Input
                            id="custom-pw"
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(false); }}
                            placeholder="Password admin"
                            autoFocus
                        />
                        {error && <p className="text-xs text-red-500">Password errata. Riprova.</p>}
                    </div>
                    <Button type="submit" className="w-full h-12">
                        Accedi al configuratore
                    </Button>
                </form>
                <p className="text-xs text-center text-gray-400">
                    Se non conosci la password, scegli uno dei <a href="/" className="text-[#719436] underline">pacchetti standard</a>.
                </p>
            </CardContent>
        </Card>
    );
}

export function WizardContainer({ config, lang = 'it' }: WizardContainerProps) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [flowStep, setFlowStep] = useState<FlowStep>('questions');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<CustomAnswers>({});
    const [additionalRequests, setAdditionalRequests] = useState("");
    const [leadData, setLeadData] = useState<Partial<Lead>>({});
    const [history, setHistory] = useState<{ step: FlowStep; index: number }[]>([
        { step: 'questions', index: 0 }
    ]);

    // Filter enabled questions
    const questions = useMemo(() =>
        config.customFlow.questions
            .filter(q => q.enabled)
            .sort((a, b) => a.order - b.order),
        [config]
    );

    const isQuestionVisible = (q: Question) => {
        if (q.requiredConditions?.requiresVideo) {
            return !!answers["q_video"];
        }
        return true;
    };

    const currentQuestion = questions[currentStepIndex];

    const handleAnswer = (val: boolean) => {
        if (!currentQuestion) return;
        const newAnswers = { ...answers, [currentQuestion.id]: val };
        setAnswers(newAnswers);

        let nextIndex = currentStepIndex + 1;
        while (nextIndex < questions.length && !isQuestionVisible(questions[nextIndex])) {
            nextIndex++;
        }

        if (nextIndex >= questions.length) {
            // Compute showRequestsForm from the NEW answers, not stale state
            const triggerQ = questions.find(q => q.effectsYes?.notes?.triggersAdditionalRequestsBox);
            const needsRequests = triggerQ ? !!newAnswers[triggerQ.id] : false;

            const nextStep = needsRequests ? 'requests' : 'persona';
            setFlowStep(nextStep);
            setHistory(prev => [...prev, { step: nextStep, index: nextIndex }]);
        } else {
            setCurrentStepIndex(nextIndex);
            setHistory(prev => [...prev, { step: 'questions', index: nextIndex }]);
        }
    };

    const goBack = () => {
        if (history.length <= 1) return;
        const newHistory = [...history];
        newHistory.pop();
        const prev = newHistory[newHistory.length - 1];
        setHistory(newHistory);
        setFlowStep(prev.step);
        setCurrentStepIndex(prev.index);
    };

    const goToPersona = () => {
        setFlowStep('persona');
        setHistory(prev => [...prev, { step: 'persona', index: questions.length }]);
    };

    const onPersonaSuccess = (data: Lead) => {
        setLeadData(data);
        setFlowStep('summary');
        setHistory(prev => [...prev, { step: 'summary', index: questions.length + 1 }]);
    };

    const pricing = useMemo(() =>
        calculateCustomQuote(config, answers, 0),
        [config, answers]
    );

    const gdprNotice = getLocalized(config.advancedSettings?.gdprNotice, lang) ||
        (lang === 'it'
            ? "I tuoi dati verranno utilizzati esclusivamente per ricontattarti in merito a questa richiesta. Non verranno utilizzati per marketing né ceduti a terzi."
            : "Your data will be used exclusively to contact you regarding this request. It will not be used for marketing or shared with third parties.");

    // Password gate
    if (!isUnlocked) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 flex items-center justify-between px-4">
                    <Link href="/" className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
                        &larr; {lang === 'it' ? 'Torna alla Home' : 'Back to Home'}
                    </Link>
                </div>
                <PasswordGate onUnlock={() => setIsUnlocked(true)} />
            </div>
        );
    }

    const renderStep = () => {
        switch (flowStep) {
            case 'questions':
                return (
                    <StepQuestion
                        question={currentQuestion}
                        onAnswer={handleAnswer}
                        canGoBack={history.length > 1}
                        onBack={goBack}
                    />
                );
            case 'requests':
                return (
                    <StepAdditionalRequests
                        value={additionalRequests}
                        onChange={setAdditionalRequests}
                        onNext={goToPersona}
                        onBack={goBack}
                        lang={lang}
                    />
                );
            case 'persona':
                return (
                    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
                        <div className="px-6 pt-4">
                            <Button variant="ghost" size="sm" onClick={goBack} className="text-gray-400 hover:text-gray-900 px-0">
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                {lang === 'it' ? 'Indietro' : 'Back'}
                            </Button>
                        </div>
                        <CardContent className="p-8 md:p-10 space-y-8">
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-[#719436]/10 text-[#719436] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FontAwesomeIcon icon={faUserCheck} className="text-2xl" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {lang === 'it' ? 'Dati del cliente' : 'Client details'}
                                </h2>
                                <p className="text-gray-500">
                                    {lang === 'it'
                                        ? 'Inserisci i recapiti del cliente per generare il preventivo.'
                                        : 'Enter client contact info to generate the quote.'}
                                </p>
                            </div>
                            <LeadForm
                                onSubmitSuccess={onPersonaSuccess}
                                gdprNotice={gdprNotice}
                                lang={lang}
                                initialData={{
                                    is_custom: true,
                                    quote_snapshot: pricing,
                                    additional_requests: additionalRequests
                                }}
                                submitLabel={lang === 'it' ? 'Genera Preventivo' : 'Generate Quote'}
                            />
                        </CardContent>
                    </Card>
                );
            case 'summary':
                return (
                    <StepSummary
                        pricing={pricing}
                        config={config}
                        answers={answers}
                        additionalRequests={additionalRequests}
                        leadData={leadData}
                        onBack={goBack}
                        lang={lang}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex items-center justify-between px-4">
                <Link href="/" className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
                    &larr; {lang === 'it' ? 'Annulla' : 'Cancel'}
                </Link>
                {flowStep === 'questions' && (
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#719436] bg-[#719436]/5 px-4 py-1.5 rounded-full border border-[#719436]/20 shadow-sm">
                        Step {currentStepIndex + 1} / {questions.length}
                    </div>
                )}
            </div>

            <div className="relative min-h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={flowStep + (flowStep === 'questions' ? currentStepIndex : '')}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {flowStep === 'questions' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-12 text-center"
                >
                    <div className="inline-block px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-xl">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-widest block mb-1">
                            {lang === 'it' ? 'Stima parziale' : 'Partial estimate'}
                        </span>
                        <span className="text-xl text-gray-900 font-semibold tracking-tight">
                            € {pricing.totalNet.toLocaleString()} <span className="text-xs text-gray-400 font-normal">+ IVA</span>
                        </span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
