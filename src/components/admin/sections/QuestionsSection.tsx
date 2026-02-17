"use client";

import { AppConfig, Question, LocalizedString } from "@/lib/config-schema";
import { LocalizedInput } from "../localized-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Trash2,
    PlusCircle,
    ArrowUp,
    ArrowDown,
    Settings2,
    Info,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuestionsSectionProps {
    config: AppConfig;
    updateConfig: (updates: Partial<AppConfig>) => void;
}

export function QuestionsSection({ config, updateConfig }: QuestionsSectionProps) {
    const sortedQuestions = [...config.customFlow.questions].sort((a, b) => a.order - b.order);

    const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
        const newQs = config.customFlow.questions.map(q => q.id === id ? { ...q, ...updates } : q);
        updateConfig({ customFlow: { ...config.customFlow, questions: newQs } });
    };

    const handleReorder = (idx: number, direction: 'up' | 'down') => {
        const newQs = [...sortedQuestions];
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= newQs.length) return;

        [newQs[idx], newQs[swapIdx]] = [newQs[swapIdx], newQs[idx]];

        // Update order properties
        const finalQs = newQs.map((q, i) => ({ ...q, order: i }));
        updateConfig({ customFlow: { ...config.customFlow, questions: finalQs } });
    };

    const handleAddQuestion = () => {
        const newId = `q_${Date.now()}`;
        const newQ: Question = {
            id: newId,
            enabled: true,
            order: config.customFlow.questions.length,
            questionText: { it: "Nuova Domanda", en: "New Question" },
            yesLabel: { it: "Sì", en: "Yes" },
            noLabel: { it: "No", en: "No" }
        };
        updateConfig({ customFlow: { ...config.customFlow, questions: [...config.customFlow.questions, newQ] } });
    };

    const handleRemoveQuestion = (id: string) => {
        if (!confirm("Remove this question and its logic?")) return;
        const newQs = config.customFlow.questions.filter(q => q.id !== id).map((q, i) => ({ ...q, order: i }));
        updateConfig({ customFlow: { ...config.customFlow, questions: newQs } });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-sm px-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                        <Info className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 leading-tight">Interactive Flow</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Define logic for the custom quote wizard.</p>
                    </div>
                </div>
                <Button onClick={handleAddQuestion} size="sm" className="gap-2 bg-[#719436] hover:bg-[#719436]/90">
                    <PlusCircle className="w-4 h-4" />
                    New Question
                </Button>
            </div>

            <div className="space-y-4">
                {sortedQuestions.map((q, idx) => (
                    <QuestionCard
                        key={q.id}
                        question={q}
                        isFirst={idx === 0}
                        isLast={idx === sortedQuestions.length - 1}
                        onReorder={(dir) => handleReorder(idx, dir)}
                        onUpdate={(updates) => handleUpdateQuestion(q.id, updates)}
                        onRemove={() => handleRemoveQuestion(q.id)}
                    />
                ))}
            </div>
        </div>
    );
}

interface QuestionCardProps {
    question: Question;
    isFirst: boolean;
    isLast: boolean;
    onReorder: (dir: 'up' | 'down') => void;
    onUpdate: (updates: Partial<Question>) => void;
    onRemove: () => void;
}

function QuestionCard({ question, isFirst, isLast, onReorder, onUpdate, onRemove }: QuestionCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className={cn(
            "overflow-hidden transition-all duration-200 border-l-4",
            question.enabled ? "border-l-blue-500" : "border-l-gray-300 grayscale opacity-60"
        )}>
            <div
                className="p-4 bg-white flex items-center justify-between cursor-pointer group"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex flex-col gap-1 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={isFirst}
                            onClick={(e) => { e.stopPropagation(); onReorder('up'); }}
                        >
                            <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={isLast}
                            onClick={(e) => { e.stopPropagation(); onReorder('down'); }}
                        >
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest">#{question.order + 1}</span>
                            <span className="text-xs font-mono text-gray-400 truncate max-w-[100px]">{question.id}</span>
                        </div>
                        <h4 className="font-medium text-gray-900 truncate">
                            {question.questionText.it || "Untitled Question"}
                        </h4>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={question.enabled}
                        onChange={(e) => { e.stopPropagation(); onUpdate({ enabled: e.target.checked }); }}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-600"
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="text-gray-300">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <CardContent className="p-6 border-t bg-gray-50/50 space-y-6 animate-in slide-in-from-top-2 duration-200">
                    <LocalizedInput
                        label="Question Text"
                        value={question.questionText}
                        onChange={(val) => onUpdate({ questionText: val })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <LocalizedInput
                            label="Yes Button Label"
                            value={question.yesLabel}
                            onChange={(val) => onUpdate({ yesLabel: val })}
                        />
                        <LocalizedInput
                            label="No Button Label"
                            value={question.noLabel}
                            onChange={(val) => onUpdate({ noLabel: val })}
                        />
                    </div>

                    <div className="bg-white p-4 rounded-xl border space-y-4">
                        <div className="flex items-center gap-2">
                            <Settings2 className="w-4 h-4 text-blue-600" />
                            <Label className="font-bold text-sm uppercase tracking-wider">Logic & Effects (If Yes)</Label>
                        </div>

                        <div className="space-y-4">
                            {question.effectsYes?.addLineItems?.map((item, iIdx) => (
                                <div key={item.id} className="p-3 border rounded-lg bg-gray-50 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-mono font-bold text-gray-400">ID: {item.id}</span>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                className="w-20 h-7 text-xs"
                                                value={item.priceNet}
                                                onChange={e => {
                                                    const newItems = [...(question.effectsYes!.addLineItems!)];
                                                    newItems[iIdx] = { ...newItems[iIdx], priceNet: parseFloat(e.target.value) };
                                                    onUpdate({ effectsYes: { ...question.effectsYes!, addLineItems: newItems } });
                                                }}
                                            />
                                            <span className="text-xs text-gray-500">€</span>
                                        </div>
                                    </div>
                                    <LocalizedInput
                                        value={item.label}
                                        onChange={(val) => {
                                            const newItems = [...(question.effectsYes!.addLineItems!)];
                                            newItems[iIdx] = { ...newItems[iIdx], label: val };
                                            onUpdate({ effectsYes: { ...question.effectsYes!, addLineItems: newItems } });
                                        }}
                                    />
                                </div>
                            ))}
                            {!question.effectsYes?.addLineItems?.length && (
                                <p className="text-xs text-gray-400 italic">No price effects configured for this option.</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
