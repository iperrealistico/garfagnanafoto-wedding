"use client";

import { useMemo, useState } from "react";
import { AdditionalAdjustment, LocalizedString } from "@/lib/config-schema";
import { normalizeAdditionalAdjustments } from "@/lib/additional-adjustments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getLocalized } from "@/lib/i18n-utils";

interface StepAdditionalRequestsProps {
    value: string;
    onChange: (val: string) => void;
    items: AdditionalAdjustment[];
    onItemsChange: (items: AdditionalAdjustment[]) => void;
    onNext: () => void;
    onBack: () => void;
    lang: string;
    adjustmentsEnabled?: boolean;
    labels?: {
        sectionTitle?: LocalizedString;
        addButtonLabel?: LocalizedString;
        amountLabel?: LocalizedString;
        amountHint?: LocalizedString;
        legacyNotesLabel?: LocalizedString;
    };
}

export function StepAdditionalRequests({
    value,
    onChange,
    items,
    onItemsChange,
    onNext,
    onBack,
    lang,
    adjustmentsEnabled = true,
    labels,
}: StepAdditionalRequestsProps) {
    const [error, setError] = useState<string | null>(null);

    const localizedLabels = useMemo(() => ({
        sectionTitle: getLocalized(labels?.sectionTitle, lang) || (lang === "it" ? "Voci aggiuntive" : "Additional items"),
        addButtonLabel: getLocalized(labels?.addButtonLabel, lang) || (lang === "it" ? "Aggiungi voce" : "Add item"),
        amountLabel: getLocalized(labels?.amountLabel, lang) || (lang === "it" ? "Importo (IVA esclusa)" : "Amount (VAT excluded)"),
        amountHint: getLocalized(labels?.amountHint, lang) || (lang === "it" ? "Usa un valore negativo per uno sconto." : "Use a negative value for a discount."),
        legacyNotesLabel: getLocalized(labels?.legacyNotesLabel, lang) || (lang === "it" ? "Note legacy (opzionale)" : "Legacy notes (optional)"),
    }), [labels, lang]);

    const updateItem = (id: string, updates: Partial<AdditionalAdjustment>) => {
        onItemsChange(items.map((item) => item.id === id ? { ...item, ...updates } : item));
        setError(null);
    };

    const addItem = () => {
        onItemsChange([
            ...items,
            {
                id: `adj_${Date.now()}`,
                title: "",
                description: "",
                priceDeltaNet: 0,
            },
        ]);
        setError(null);
    };

    const removeItem = (id: string) => {
        onItemsChange(items.filter((item) => item.id !== id));
        setError(null);
    };

    const handleNext = () => {
        const hasUntitledValue = items.some((item) => {
            const hasContent = Boolean(item.title.trim() || item.description?.trim() || item.priceDeltaNet !== 0);
            return hasContent && !item.title.trim();
        });

        if (hasUntitledValue) {
            setError(lang === "it" ? "Ogni voce con importo o descrizione deve avere un titolo." : "Each item with amount or description requires a title.");
            return;
        }

        try {
            const normalized = normalizeAdditionalAdjustments(items);
            onItemsChange(normalized);
            setError(null);
            onNext();
        } catch (validationError) {
            console.error("Additional adjustments validation failed", validationError);
            setError(lang === "it" ? "Controlla le voci aggiuntive inserite e riprova." : "Please review the additional items and try again.");
        }
    };

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
                        {lang === 'it' ? 'Aggiungi più voci con importo, incluse eventuali riduzioni/sconti.' : 'Add multiple items with amount, including discounts/reductions.'}
                    </p>
                </div>

                {adjustmentsEnabled && (
                    <div className="text-left space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>{localizedLabels.sectionTitle}</Label>
                            <Button type="button" size="sm" variant="outline" onClick={addItem}>
                                <FontAwesomeIcon icon={faPlus} className="mr-2 text-xs" />
                                {localizedLabels.addButtonLabel}
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500">{localizedLabels.amountHint}</p>

                        {items.length === 0 && (
                            <p className="text-sm text-gray-500 italic">
                                {lang === "it" ? "Nessuna voce aggiuntiva inserita." : "No additional items yet."}
                            </p>
                        )}

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={item.id} className="p-4 border rounded-xl bg-gray-50/60 space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <Label htmlFor={`adj-title-${item.id}`} className="text-xs uppercase tracking-wider text-gray-500">
                                            {lang === "it" ? `Voce ${index + 1}` : `Item ${index + 1}`}
                                        </Label>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-gray-400 hover:text-red-600"
                                            onClick={() => removeItem(item.id)}
                                            aria-label={lang === "it" ? "Rimuovi voce" : "Remove item"}
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                        </Button>
                                    </div>
                                    <Input
                                        id={`adj-title-${item.id}`}
                                        value={item.title}
                                        onChange={(e) => updateItem(item.id, { title: e.target.value })}
                                        placeholder={lang === "it" ? "Titolo" : "Title"}
                                    />
                                    <Textarea
                                        value={item.description || ""}
                                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                        placeholder={lang === "it" ? "Descrizione (opzionale)" : "Description (optional)"}
                                        className="min-h-[88px]"
                                    />
                                    <div className="space-y-2">
                                        <Label htmlFor={`adj-amount-${item.id}`}>{localizedLabels.amountLabel}</Label>
                                        <Input
                                            id={`adj-amount-${item.id}`}
                                            type="number"
                                            step="1"
                                            value={Number.isFinite(item.priceDeltaNet) ? item.priceDeltaNet : 0}
                                            onChange={(e) => updateItem(item.id, { priceDeltaNet: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-left space-y-4">
                    <Label htmlFor="requests">{localizedLabels.legacyNotesLabel}</Label>
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

                {error && (
                    <p role="alert" className="text-sm text-red-600 font-medium text-left">
                        {error}
                    </p>
                )}

                <Button size="lg" className="w-full h-14 text-lg mt-4" onClick={handleNext}>
                    {lang === 'it' ? 'Continua' : 'Continue'}
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Button>
            </CardContent>
        </Card>
    );
}
