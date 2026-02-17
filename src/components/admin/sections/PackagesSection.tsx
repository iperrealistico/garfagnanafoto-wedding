"use client";

import { AppConfig, Package, LocalizedString } from "@/lib/config-schema";
import { LocalizedInput } from "../localized-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle, Tag } from "lucide-react";

interface PackagesSectionProps {
    config: AppConfig;
    updateConfig: (updates: Partial<AppConfig>) => void;
}

export function PackagesSection({ config, updateConfig }: PackagesSectionProps) {
    const handleUpdatePackage = (id: string, updates: Partial<Package>) => {
        const newPkgs = config.packages.map(p => p.id === id ? { ...p, ...updates } : p);
        updateConfig({ packages: newPkgs });
    };

    const handleUpdateLineItem = (pkgId: string, itemIdx: number, updates: any) => {
        const newPkgs = config.packages.map(p => {
            if (p.id !== pkgId) return p;
            const newItems = [...p.lineItems];
            newItems[itemIdx] = { ...newItems[itemIdx], ...updates };
            return { ...p, lineItems: newItems };
        });
        updateConfig({ packages: newPkgs });
    };

    return (
        <div className="space-y-8">
            {config.packages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden border-l-4 border-l-[#719436]">
                    <CardHeader className="bg-gray-50/50">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Tag className="w-5 h-5 text-[#719436]" />
                                {pkg.name.it}
                            </CardTitle>
                            <span className="text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded border">ID: {pkg.id}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <LocalizedInput
                                label="Package Name"
                                value={pkg.name}
                                onChange={(val) => handleUpdatePackage(pkg.id, { name: val })}
                            />
                            <LocalizedInput
                                label="Tagline"
                                value={pkg.tagline || { it: "", en: "" }}
                                onChange={(val) => handleUpdatePackage(pkg.id, { tagline: val })}
                            />
                        </div>

                        <LocalizedInput
                            label="Detailed Description"
                            multiline
                            value={pkg.description || { it: "", en: "" }}
                            onChange={(val) => handleUpdatePackage(pkg.id, { description: val })}
                        />

                        <div className="space-y-4 pt-4 border-t">
                            <Label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Line Items & Pricing</Label>
                            <div className="space-y-3">
                                {pkg.lineItems.map((item, idx) => (
                                    <div key={item.id} className="bg-gray-50 p-4 rounded-xl border space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-mono text-gray-500">{item.id}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center">
                                                    <Input
                                                        type="number"
                                                        className="w-24 h-9 rounded-r-none border-r-0"
                                                        value={item.priceNet}
                                                        onChange={e => handleUpdateLineItem(pkg.id, idx, { priceNet: parseFloat(e.target.value) })}
                                                    />
                                                    <div className="h-9 px-3 flex items-center bg-white border border-l-0 rounded-r-md text-sm text-gray-500">€</div>
                                                </div>
                                            </div>
                                        </div>
                                        <LocalizedInput
                                            value={item.label}
                                            onChange={(val) => handleUpdateLineItem(pkg.id, idx, { label: val })}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-900 text-white rounded-xl">
                            <div className="space-y-0.5">
                                <Label className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Package Adjustment (Discount)</Label>
                                <p className="text-xs text-gray-500">Negative values for discounts, positive for fees.</p>
                            </div>
                            <div className="flex items-center">
                                <Input
                                    type="number"
                                    className="w-32 h-10 bg-gray-800 border-gray-700 text-white rounded-r-none border-r-0"
                                    value={pkg.packageAdjustmentNet}
                                    onChange={e => handleUpdatePackage(pkg.id, { packageAdjustmentNet: parseFloat(e.target.value) })}
                                />
                                <div className="h-10 px-4 flex items-center bg-gray-800 border border-l-0 border-gray-700 rounded-r-md text-sm">€</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
