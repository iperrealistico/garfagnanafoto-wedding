"use client";

import { AppConfig } from "@/lib/config-schema";
import { LocalizedInput } from "../localized-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Palette, ListPlus } from "lucide-react";

interface AdvancedSectionProps {
    config: AppConfig;
    updateConfig: (updates: Partial<AppConfig>) => void;
}

export function AdvancedSection({ config, updateConfig }: AdvancedSectionProps) {
    const handleUpdateAdvanced = (updates: any) => {
        updateConfig({
            advancedSettings: {
                ...config.advancedSettings,
                ...updates
            }
        });
    };

    return (
        <div className="space-y-8">
            <Card className="border-l-4 border-l-amber-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-amber-500" />
                        Privacy & GDPR
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-sm text-gray-500">
                        This notice is displayed on the lead capture form. It should clearly state how you use the collected data.
                    </p>
                    <LocalizedInput
                        label="GDPR Notice"
                        multiline
                        value={config.advancedSettings?.gdprNotice || { it: "", en: "" }}
                        onChange={(val) => handleUpdateAdvanced({ gdprNotice: val })}
                    />
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-blue-500" />
                        Footer Copy
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-sm text-gray-500">
                        Customize the text displayed at the bottom of every page.
                    </p>
                    <LocalizedInput
                        label="Footer Text"
                        value={config.advancedSettings?.footerText || { it: "© 2026 — Garfagnanafoto.it", en: "© 2026 — Garfagnanafoto.it" }}
                        onChange={(val) => handleUpdateAdvanced({ footerText: val })}
                    />
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ListPlus className="w-5 h-5 text-emerald-500" />
                        Additional Adjustments
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-sm text-gray-500">
                        Configure the custom quote multi-item adjustments section. Negative values are shown as discounts.
                    </p>

                    <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <input
                            type="checkbox"
                            checked={config.advancedSettings?.additionalAdjustments?.enabled ?? true}
                            onChange={(e) => handleUpdateAdvanced({
                                additionalAdjustments: {
                                    ...config.advancedSettings?.additionalAdjustments,
                                    enabled: e.target.checked
                                }
                            })}
                            className="rounded border-gray-300 text-[#719436] focus:ring-[#719436] w-4 h-4"
                        />
                        Enable additional adjustments in guest flow
                    </label>

                    <LocalizedInput
                        label="Section Title"
                        value={config.advancedSettings?.additionalAdjustments?.sectionTitle || { it: "Voci aggiuntive", en: "Additional items" }}
                        onChange={(val) => handleUpdateAdvanced({
                            additionalAdjustments: {
                                ...config.advancedSettings?.additionalAdjustments,
                                sectionTitle: val
                            }
                        })}
                    />

                    <LocalizedInput
                        label="Add Button Label"
                        value={config.advancedSettings?.additionalAdjustments?.addButtonLabel || { it: "Aggiungi voce", en: "Add item" }}
                        onChange={(val) => handleUpdateAdvanced({
                            additionalAdjustments: {
                                ...config.advancedSettings?.additionalAdjustments,
                                addButtonLabel: val
                            }
                        })}
                    />

                    <LocalizedInput
                        label="Amount Label"
                        value={config.advancedSettings?.additionalAdjustments?.amountLabel || { it: "Importo (IVA esclusa)", en: "Amount (VAT excluded)" }}
                        onChange={(val) => handleUpdateAdvanced({
                            additionalAdjustments: {
                                ...config.advancedSettings?.additionalAdjustments,
                                amountLabel: val
                            }
                        })}
                    />

                    <LocalizedInput
                        label="Amount Hint"
                        value={config.advancedSettings?.additionalAdjustments?.amountHint || { it: "Usa un valore negativo per uno sconto.", en: "Use a negative value for a discount." }}
                        onChange={(val) => handleUpdateAdvanced({
                            additionalAdjustments: {
                                ...config.advancedSettings?.additionalAdjustments,
                                amountHint: val
                            }
                        })}
                    />

                    <LocalizedInput
                        label="Legacy Notes Label"
                        value={config.advancedSettings?.additionalAdjustments?.legacyNotesLabel || { it: "Note legacy (opzionale)", en: "Legacy notes (optional)" }}
                        onChange={(val) => handleUpdateAdvanced({
                            additionalAdjustments: {
                                ...config.advancedSettings?.additionalAdjustments,
                                legacyNotesLabel: val
                            }
                        })}
                    />
                </CardContent>
            </Card>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 italic text-sm text-amber-800">
                Tip: Keep the GDPR notice short and transparent to increase conversion rates.
            </div>
        </div>
    );
}
