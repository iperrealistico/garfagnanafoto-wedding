"use client";

import { useState, useMemo, useEffect } from "react";
import { AppConfig, Question } from "@/lib/config-schema";
import { calculateCustomQuote, CustomAnswers } from "@/lib/pricing-engine";
import { StepQuestion } from "./step-question";
import { StepSummary } from "./step-summary";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface WizardContainerProps {
    config: AppConfig;
}

export function WizardContainer({ config }: WizardContainerProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<CustomAnswers>({});
    const [additionalRequests, setAdditionalRequests] = useState("");
    const [history, setHistory] = useState<number[]>([0]); // Track visited steps for back nav

    // Filter enabled questions
    const questions = useMemo(() =>
        config.customFlow.questions
            .filter(q => q.enabled)
            .sort((a, b) => a.order - b.order),
        [config]
    );

    // Determine effective steps based on logic (skip logic)
    // We compute the NEXT step dynamically.
    // Standard flow: 0 -> 1 -> 2 ...
    // But some questions might be skipped if conditions are not met.

    // Helper to check if a question is visible
    const isQuestionVisible = (q: Question) => {
        if (q.requiredConditions?.requiresVideo) {
            // Check if video is selected.
            // We need to know which question provides video.
            // In default config, it's 'q_video'.
            // Ideally we check if 'answers.q_video' is set. 
            // Or better: check if current line items include video? No, that's circular.
            // We'll rely on ID convention or specific logic for now as per default-config.
            return !!answers["q_video"];
        }
        return true;
    };

    const currentQuestion = questions[currentStepIndex];
    const isFinished = currentStepIndex >= questions.length;

    const handleAnswer = (val: boolean) => {
        if (!currentQuestion) return;

        setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));

        // Move to next valid step
        let nextIndex = currentStepIndex + 1;
        while (nextIndex < questions.length && !isQuestionVisible(questions[nextIndex])) {
            nextIndex++;
        }

        setHistory(prev => [...prev, nextIndex]);
        setCurrentStepIndex(nextIndex);
    };

    const handleBack = () => {
        if (history.length <= 1) return; // Can't go back from start
        const newHistory = [...history];
        newHistory.pop(); // Remove current
        const prevIndex = newHistory[newHistory.length - 1];
        setHistory(newHistory);
        setCurrentStepIndex(prevIndex);
    };

    const pricing = useMemo(() =>
        calculateCustomQuote(config, answers, 0), // customAdjustment could be handled if needed
        [config, answers]
    );

    // Check if we need to show additional requests text area
    // Logic: if the question causing it was answered YES
    const showAdditionalRequests = useMemo(() => {
        // Search for question with triggersAdditionalRequestsBox
        const triggerQ = questions.find(q => q.effectsYes?.notes?.triggersAdditionalRequestsBox);
        if (triggerQ) {
            return !!answers[triggerQ.id];
        }
        return false;
    }, [questions, answers]);

    if (isFinished) {
        return (
            <StepSummary
                pricing={pricing}
                config={config}
                answers={answers}
                additionalRequests={additionalRequests}
                onAdditionalRequestsChange={setAdditionalRequests}
                showAdditionalRequests={showAdditionalRequests}
                onBack={handleBack}
            />
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
                    &larr; Annulla
                </Link>
                <div className="text-sm text-gray-400">
                    Step {currentStepIndex + 1} di {questions.length}
                </div>
            </div>

            <div className="relative overflow-hidden min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStepIndex}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <StepQuestion
                            question={currentQuestion}
                            onAnswer={handleAnswer}
                            canGoBack={history.length > 1}
                            onBack={handleBack}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Live pricing preview (optional) */}
            <div className="mt-8 text-center text-sm text-gray-500">
                Stima parziale: €{pricing.totalNet} + IVA
            </div>
        </div>
    );
}
