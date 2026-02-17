"use client";

import { AppConfig, Question } from "@/lib/config-schema";
import { NestedQuestionBuilder } from "../nested-question-builder";

interface QuestionsSectionProps {
    config: AppConfig;
    updateConfig: (updates: Partial<AppConfig>) => void;
}

export function QuestionsSection({ config, updateConfig }: QuestionsSectionProps) {
    return <NestedQuestionBuilder config={config} updateConfig={updateConfig} />;
}
