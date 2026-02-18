"use client";

import React, { useState, useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Question, AppConfig, QuestionEffect } from '@/lib/config-schema';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    GripVertical,
    ChevronDown,
    ChevronUp,
    Trash2,
    PlusCircle,
    Settings2,
    Type,
    CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocalizedInput } from './localized-input';
import { getLocalized } from '@/lib/i18n-utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SortableQuestionItemProps {
    question: Question;
    depth: number;
    onUpdate: (updates: Partial<Question>) => void;
    onRemove: () => void;
    onAddChild: () => void;
    isExpanded: boolean;
    onToggleExpand: () => void;
    lang?: string;
}

function SortableQuestionItem({
    question,
    depth,
    onUpdate,
    onRemove,
    onAddChild,
    isExpanded,
    onToggleExpand,
    lang = 'it'
}: SortableQuestionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginLeft: `${depth * 24}px`,
    };

    type EffectKey = "effectsYes" | "effectsNo";

    const handleUpdateEffects = (effectKey: EffectKey, updates: Partial<QuestionEffect>) => {
        const current = (question[effectKey] || { priceDeltaNet: 0, addLineItems: [] }) as QuestionEffect;
        onUpdate({
            [effectKey]: {
                ...current,
                ...updates,
                priceDeltaNet: updates.priceDeltaNet ?? current.priceDeltaNet ?? 0
            }
        } as Partial<Question>);
    };

    const renderPricingEffectsCard = (effectKey: EffectKey, title: string, showNotesToggle = false) => {
        const effects = (question[effectKey] || { priceDeltaNet: 0, addLineItems: [] }) as QuestionEffect;
        const lineItems = effects.addLineItems || [];
        const hasLineItems = lineItems.length > 0;
        const hasPriceDelta = (effects.priceDeltaNet ?? 0) !== 0;

        return (
            <div className="bg-white p-4 rounded-xl border space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                    <Settings2 className="w-4 h-4 text-primary" />
                    <Label className="font-bold text-xs uppercase tracking-wider">{title}</Label>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Price Delta (€)</Label>
                    <Input
                        type="number"
                        step="1"
                        value={effects.priceDeltaNet ?? 0}
                        onChange={(e) => {
                            const nextDelta = parseFloat(e.target.value) || 0;
                            handleUpdateEffects(effectKey, {
                                priceDeltaNet: nextDelta,
                                addLineItems: nextDelta !== 0 ? [] : lineItems
                            });
                        }}
                    />
                    <p className="text-[11px] text-gray-500">Valori negativi = sconti</p>
                    <p className="text-[11px] text-gray-500">Usa solo una modalità: Delta oppure voci di prezzo.</p>
                </div>

                <div className={cn("space-y-3", hasPriceDelta && "opacity-60 pointer-events-none")}>
                    {lineItems.map((item, iIdx) => (
                        <div key={item.id} className="p-3 border rounded-lg bg-gray-50/50 space-y-2 relative group/item">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                onClick={() => {
                                    const newItems = lineItems.filter((_, i) => i !== iIdx);
                                    handleUpdateEffects(effectKey, { addLineItems: newItems });
                                }}
                            >
                                <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                            <div className="flex justify-between items-center gap-2">
                                <div className="flex-1">
                                    <LocalizedInput
                                        value={item.label}
                                        onChange={(val) => {
                                            const newItems = [...lineItems];
                                            newItems[iIdx] = { ...newItems[iIdx], label: val };
                                            handleUpdateEffects(effectKey, { addLineItems: newItems, priceDeltaNet: 0 });
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-1 w-24">
                                    <Input
                                        type="number"
                                        className="h-8 text-xs px-1"
                                        value={item.priceNet}
                                        onChange={e => {
                                            const newItems = [...lineItems];
                                            newItems[iIdx] = { ...newItems[iIdx], priceNet: parseFloat(e.target.value) || 0 };
                                            handleUpdateEffects(effectKey, { addLineItems: newItems, priceDeltaNet: 0 });
                                        }}
                                    />
                                    <span className="text-xs text-gray-500 font-bold">€</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs dashed border-2 border-dashed h-10"
                        disabled={hasPriceDelta}
                        onClick={() => {
                            const newItem = { id: `item_${Date.now()}`, label: { it: "Nuova voce", en: "New item" }, priceNet: 0 };
                            handleUpdateEffects(effectKey, { addLineItems: [...lineItems, newItem], priceDeltaNet: 0 });
                        }}
                    >
                        <PlusCircle className="w-3 h-3 mr-2 text-primary" />
                        Add Line Item Effect
                    </Button>
                </div>
                {hasLineItems && (
                    <p className="text-[11px] text-gray-500">Le voci di prezzo disattivano automaticamente il Price Delta.</p>
                )}

                {showNotesToggle && (
                    <div className="pt-2 flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!question.effectsYes?.notes?.triggersAdditionalRequestsBox}
                                onChange={(e) => {
                                    const currentNotes = question.effectsYes?.notes || {};
                                    handleUpdateEffects("effectsYes", {
                                        notes: { ...currentNotes, triggersAdditionalRequestsBox: e.target.checked }
                                    });
                                }}
                                className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                            />
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-tighter">Triggers additional requests box</span>
                        </label>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div ref={setNodeRef} style={style} className={cn("mb-2", isDragging && "opacity-50 z-50")}>
            <Card className={cn(
                "border-l-4 transition-all duration-200",
                question.enabled ? "border-l-[#719436]" : "border-l-gray-300 grayscale opacity-60",
                isDragging && "shadow-2xl border-2 border-primary"
            )}>
                <div className="flex items-center p-3 gap-3">
                    <div {...attributes} {...listeners} className="cursor-grab hover:text-primary transition-colors">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggleExpand}>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tighter">
                                {question.type === 'text' ? <Type className="w-3 h-3 inline mr-1" /> : <CheckSquare className="w-3 h-3 inline mr-1" />}
                                {question.id}
                            </span>
                            {question.parentId && (
                                <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded border border-blue-100 uppercase font-black">
                                    Child of {question.parentId} ({question.showWhen})
                                </span>
                            )}
                        </div>
                        <h4 className="font-bold text-gray-900 truncate">
                            {getLocalized(question.questionText, lang) || "Untitled Question"}
                        </h4>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary" onClick={(e) => { e.stopPropagation(); onAddChild(); }} title="Add sub-question">
                            <PlusCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-destructive" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400" onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                {isExpanded && (
                    <div className="p-4 border-t bg-gray-50/50 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <LocalizedInput
                                    label="Question Text"
                                    value={question.questionText}
                                    onChange={(val) => onUpdate({ questionText: val })}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Type</Label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm"
                                            value={question.type}
                                            onChange={(e) => onUpdate({ type: e.target.value as any })}
                                        >
                                            <option value="yes_no">Yes / No</option>
                                            <option value="text">Text Input</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Visibility</Label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm disabled:opacity-50"
                                            value={question.showWhen || 'always'}
                                            onChange={(e) => onUpdate({ showWhen: e.target.value as any })}
                                            disabled={!question.parentId}
                                        >
                                            <option value="always">Always (if parent is shown)</option>
                                            <option value="yes">If Parent is YES</option>
                                            <option value="no">If Parent is NO</option>
                                        </select>
                                    </div>
                                </div>

                                {question.type === 'yes_no' ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <LocalizedInput
                                            label="Yes Label"
                                            value={question.yesLabel}
                                            onChange={(val) => onUpdate({ yesLabel: val })}
                                        />
                                        <LocalizedInput
                                            label="No Label"
                                            value={question.noLabel}
                                            onChange={(val) => onUpdate({ noLabel: val })}
                                        />
                                    </div>
                                ) : (
                                    <LocalizedInput
                                        label="Placeholder"
                                        value={question.placeholder || { it: "Scrivi qui...", en: "Type here..." }}
                                        onChange={(val) => onUpdate({ placeholder: val })}
                                    />
                                )}
                            </div>

                            <div className="space-y-4">
                                {renderPricingEffectsCard(
                                    "effectsYes",
                                    `Pricing Effects (If ${question.type === 'text' ? 'Filled' : 'Yes'})`,
                                    true
                                )}
                                {question.type === "yes_no" && renderPricingEffectsCard("effectsNo", "Pricing Effects (If No)")}
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

export function NestedQuestionBuilder({ config, updateConfig }: { config: AppConfig, updateConfig: (updates: Partial<AppConfig>) => void }) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const flatQuestions = config.customFlow.questions;

    const getFlattenedTree = useMemo(() => {
        const flattened: { question: Question; depth: number }[] = [];
        const processed = new Set<string>();

        const process = (q: Question, depth: number) => {
            if (!q || processed.has(q.id)) return;
            processed.add(q.id);
            flattened.push({ question: q, depth });

            const children = config.customFlow.questions
                .filter(child => child.parentId === q.id)
                .sort((a, b) => a.order - b.order);

            children.forEach(child => process(child, depth + 1));
        };

        const roots = config.customFlow.questions
            .filter(q => !q.parentId)
            .sort((a, b) => a.order - b.order);

        roots.forEach(r => process(r, 0));

        config.customFlow.questions.forEach(q => {
            if (!processed.has(q.id)) {
                process(q, 0);
            }
        });

        return flattened;
    }, [config.customFlow.questions]);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = flatQuestions.findIndex(q => q.id === active.id);
        const newIndex = flatQuestions.findIndex(q => q.id === over.id);

        const newQuestions = arrayMove(flatQuestions, oldIndex, newIndex).map((q, i) => ({
            ...q,
            order: i
        }));

        updateConfig({ customFlow: { ...config.customFlow, questions: newQuestions } });
    };

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        const newQs = config.customFlow.questions.map(q => q.id === id ? { ...q, ...updates } : q);
        updateConfig({ customFlow: { ...config.customFlow, questions: newQs } });
    };

    const addQuestion = (parentId?: string) => {
        const newId = `q_${Date.now()}`;
        const newQ: Question = {
            id: newId,
            enabled: true,
            order: config.customFlow.questions.length,
            parentId,
            showWhen: parentId ? 'yes' : 'always',
            type: 'yes_no',
            required: false,
            questionText: { it: "Nuova Domanda", en: "New Question" },
            yesLabel: { it: "Sì", en: "Yes" },
            noLabel: { it: "No", en: "No" }
        };
        updateConfig({ customFlow: { ...config.customFlow, questions: [...config.customFlow.questions, newQ] } });
        setExpandedIds(prev => new Set([...prev, newId]));
    };

    const removeQuestion = (id: string) => {
        if (!confirm("Remove this question and all its sub-questions?")) return;

        const idsToRemove = new Set([id]);
        const findChildren = (parentId: string) => {
            config.customFlow.questions.forEach(q => {
                if (q.parentId === parentId) {
                    idsToRemove.add(q.id);
                    findChildren(q.id);
                }
            });
        };
        findChildren(id);

        const newQs = config.customFlow.questions.filter(q => !idsToRemove.has(q.id)).map((q, i) => ({ ...q, order: i }));
        updateConfig({ customFlow: { ...config.customFlow, questions: newQs } });
    };

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpandedIds(newExpanded);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border shadow-sm px-6 sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl border border-primary/20">
                        <PlusCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 leading-tight">Question Builder</h4>
                        <p className="text-xs text-gray-500 mt-1">Configure nested logic and pricing rules.</p>
                    </div>
                </div>
                <Button onClick={() => addQuestion()} size="sm" className="gap-2 rounded-xl h-11 px-5 shadow-lg shadow-primary/20">
                    <PlusCircle className="w-5 h-5" />
                    Root Question
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={getFlattenedTree.map(item => item.question.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-1">
                        {getFlattenedTree.map(({ question, depth }) => (
                            <SortableQuestionItem
                                key={question.id}
                                question={question}
                                depth={depth}
                                onUpdate={(updates) => updateQuestion(question.id, updates)}
                                onRemove={() => removeQuestion(question.id)}
                                onAddChild={() => addQuestion(question.id)}
                                isExpanded={expandedIds.has(question.id)}
                                onToggleExpand={() => toggleExpand(question.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
