"use client";

import { AppConfig } from "@/lib/config-schema";
import { LocalizedInput } from "../localized-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Palette } from "lucide-react";

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

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 italic text-sm text-amber-800">
                Tip: Keep the GDPR notice short and transparent to increase conversion rates.
            </div>
        </div>
    );
}
