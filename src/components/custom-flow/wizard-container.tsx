"use client";

import { useState, useMemo, useCallback } from "react";
import { AdditionalAdjustment, AppConfig, Question } from "@/lib/config-schema";
import { calculateCustomQuote, CustomAnswers } from "@/lib/pricing-engine";
import { StepQuestion } from "./step-question";
import { StepSummary } from "./step-summary";
import { StepAdditionalRequests } from "./step-additional-requests";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { getLocalized } from "@/lib/i18n-utils";
import { LeadGate } from "../public/lead-gate";

type FlowStep = 'questions' | 'requests' | 'summary';

interface WizardContainerProps {
    config: AppConfig;
    lang?: string;
}

export function WizardContainer({ config, lang = 'it' }: WizardContainerProps) {
    const [flowStep, setFlowStep] = useState<FlowStep>('questions');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<CustomAnswers>({});
    const [additionalRequests, setAdditionalRequests] = useState("");
    const [additionalAdjustments, setAdditionalAdjustments] = useState<AdditionalAdjustment[]>([]);
    const [history, setHistory] = useState<{ step: FlowStep; index: number }[]>([
        { step: 'questions', index: 0 }
    ]);

    // Compute the sequence of visible questions based on current answers
    const getVisibleSequence = useCallback(() => {
        const sequence: Question[] = [];
        const processed = new Set<string>();

        const process = (q: Question) => {
            if (!q.enabled || processed.has(q.id)) return;
            processed.add(q.id);
            sequence.push(q);

            const answer = answers[q.id];

            // Should children be shown?
            const children = config.customFlow.questions
                .filter(child => child.parentId === q.id)
                .sort((a, b) => a.order - b.order);

            children.forEach(child => {
                const isVisible = child.showWhen === "always" ||
                    (child.showWhen === "yes" && !!answer) ||
                    (child.showWhen === "no" && !answer);

                if (isVisible) {
                    process(child);
                }
            });
        };

        const roots = config.customFlow.questions
            .filter(q => !q.parentId)
            .sort((a, b) => a.order - b.order);

        roots.forEach(process);
        return sequence;
    }, [config, answers]);

    const visibleQuestions = useMemo(() => getVisibleSequence(), [getVisibleSequence]);
    const currentQuestion = visibleQuestions[currentStepIndex];

    const handleAnswer = (val: boolean | string) => {
        if (!currentQuestion) return;

        const newAnswers = { ...answers, [currentQuestion.id]: val };
        setAnswers(newAnswers);

        const nextIndex = currentStepIndex + 1;

        // Re-calculate visible sequence with NEW answers to check if we are at the end
        // This is tricky because calculateVisibleSequence depends on state...
        // Let's use a manual check for the "next" step.

        // If the current question was the last in the visible sequence
        if (nextIndex >= visibleQuestions.length) {
            // Check if ANY sub-questions MIGHT show up after this answer
            const triggerQ = config.customFlow.questions.find(q => q.effectsYes?.notes?.triggersAdditionalRequestsBox);
            const needsRequests = triggerQ ? !!newAnswers[triggerQ.id] : false;

            const nextStep = needsRequests ? 'requests' : 'summary';
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

    const goToSummary = () => {
        setFlowStep('summary');
        setHistory(prev => [...prev, { step: 'summary', index: visibleQuestions.length }]);
    };

    const pricing = useMemo(() =>
        calculateCustomQuote(config, answers, { customAdjustmentNet: 0, additionalAdjustments }),
        [config, answers, additionalAdjustments]
    );

    const quoteSnapshot = useMemo(() => ({
        flow: "custom",
        answers,
        additionalRequests,
        additionalAdjustments,
        pricing,
    }), [answers, additionalRequests, additionalAdjustments, pricing]);

    const additionalAdjustmentsSettings = config.advancedSettings?.additionalAdjustments;
    const additionalAdjustmentsEnabled = additionalAdjustmentsSettings?.enabled ?? true;

    const gdprNotice = getLocalized(config.advancedSettings?.gdprNotice, lang) ||
        (lang === 'it'
            ? "I dati inseriti vengono usati solo per personalizzare il preventivo nel tuo browser."
            : "The details you enter are only used to personalize the quote in your browser.");

    return (
        <LeadGate
            quoteSnapshot={quoteSnapshot}
            gdprNotice={gdprNotice}
            lang={lang}
        >
            {({ handleAction, leadData }) => {
                const renderStep = () => {
                    switch (flowStep) {
                        case 'questions':
                            return (
                                <StepQuestion
                                    question={currentQuestion}
                                    onAnswer={handleAnswer}
                                    canGoBack={history.length > 1}
                                    onBack={goBack}
                                    lang={lang}
                                    initialValue={answers[currentQuestion?.id]}
                                />
                            );
                        case 'requests':
                            return (
                                <StepAdditionalRequests
                                    value={additionalRequests}
                                    onChange={setAdditionalRequests}
                                    items={additionalAdjustments}
                                    onItemsChange={setAdditionalAdjustments}
                                    onNext={goToSummary}
                                    onBack={goBack}
                                    lang={lang}
                                    adjustmentsEnabled={additionalAdjustmentsEnabled}
                                    labels={additionalAdjustmentsSettings}
                                />
                            );
                        case 'summary':
                            return (
                                <StepSummary
                                    pricing={pricing}
                                    answers={answers}
                                    additionalRequests={additionalRequests}
                                    additionalAdjustments={additionalAdjustments}
                                    onBack={goBack}
                                    handleAction={handleAction}
                                    leadData={leadData}
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
                                    Step {currentStepIndex + 1} / {visibleQuestions.length}
                                </div>
                            )}
                        </div>

                        <div className="relative min-h-[500px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={flowStep + (flowStep === 'questions' ? currentQuestion?.id : '')}
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
            }}
        </LeadGate>
    );
}
