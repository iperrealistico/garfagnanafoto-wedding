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
import { faArrowLeft, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { getLocalized } from "@/lib/i18n-utils";
import { Card, CardContent } from "@/components/ui/card";

type FlowStep = 'questions' | 'requests' | 'persona' | 'summary';

interface WizardContainerProps {
    config: AppConfig;
    lang?: string;
}

export function WizardContainer({ config, lang = 'it' }: WizardContainerProps) {
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

    const showRequestsForm = useMemo(() => {
        const triggerQ = questions.find(q => q.effectsYes?.notes?.triggersAdditionalRequestsBox);
        return triggerQ ? !!answers[triggerQ.id] : false;
    }, [questions, answers]);

    const handleAnswer = (val: boolean) => {
        if (!currentQuestion) return;
        const newAnswers = { ...answers, [currentQuestion.id]: val };
        setAnswers(newAnswers);

        let nextIndex = currentStepIndex + 1;
        while (nextIndex < questions.length && !isQuestionVisible(questions[nextIndex])) {
            nextIndex++;
        }

        if (nextIndex >= questions.length) {
            // Finished questions, determine next flow step
            const nextStep = showRequestsForm ? 'requests' : 'persona';
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
                                    {lang === 'it' ? 'Ultimo passo!' : 'One last step!'}
                                </h2>
                                <p className="text-gray-500">
                                    {lang === 'it'
                                        ? 'Completa con i tuoi dati per ricevere il preventivo.'
                                        : 'Fill in your details to receive the quote.'}
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
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-1">
                            {lang === 'it' ? 'Stima parziale' : 'Partial estimate'}
                        </span>
                        <span className="text-xl text-gray-900 font-black tracking-tighter">
                            € {pricing.totalNet.toLocaleString()} <span className="text-xs text-gray-400 font-medium">+ IVA</span>
                        </span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
