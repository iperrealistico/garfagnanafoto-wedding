"use client";

import { AppConfig, LocalizedString } from "@/lib/config-schema";
import { LocalizedInput } from "../localized-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LegalSectionProps {
    config: AppConfig;
    updateConfig: (updates: Partial<AppConfig>) => void;
}

export function LegalSection({ config, updateConfig }: LegalSectionProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Taxes & Economics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="max-w-xs">
                        <Label>VAT Rate (0.22 = 22%)</Label>
                        <div className="flex items-center mt-1">
                            <Input
                                type="number"
                                step="0.01"
                                value={config.vatRate}
                                onChange={(e) => updateConfig({ vatRate: parseFloat(e.target.value) })}
                                className="rounded-r-none border-r-0"
                            />
                            <div className="h-10 px-4 flex items-center bg-gray-50 border border-l-0 rounded-r-md text-sm text-gray-500">%</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Legal Copy & Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <LocalizedInput
                        label="Delivery Time Information"
                        value={config.legalCopy.deliveryTime}
                        onChange={(val) => updateConfig({ legalCopy: { ...config.legalCopy, deliveryTime: val } })}
                    />
                    <LocalizedInput
                        label="Payment Terms & Deposit"
                        value={config.legalCopy.paymentTerms}
                        onChange={(val) => updateConfig({ legalCopy: { ...config.legalCopy, paymentTerms: val } })}
                    />
                    <LocalizedInput
                        label="General Disclaimer / Travel Fees"
                        multiline
                        value={config.legalCopy.disclaimer}
                        onChange={(val) => updateConfig({ legalCopy: { ...config.legalCopy, disclaimer: val } })}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
