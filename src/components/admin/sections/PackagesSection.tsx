"use client";

import { AppConfig, Package, LocalizedString } from "@/lib/config-schema";
import { LocalizedInput } from "../localized-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle, Tag } from "lucide-react";
import { toast } from "sonner";

interface PackagesSectionProps {
    config: AppConfig;
    updateConfig: (updates: Partial<AppConfig>) => void;
}

export function PackagesSection({ config, updateConfig }: PackagesSectionProps) {
    const handleUpdatePackage = (id: string, updates: Partial<Package>) => {
        const newPkgs = config.packages.map(p => p.id === id ? { ...p, ...updates } : p);
        updateConfig({ packages: newPkgs });
    };

    const handleAddPackage = () => {
        const newPkg: Package = {
            id: `pkg_${Date.now()}`,
            name: { it: "Nuovo Pacchetto", en: "New Package" },
            tagline: { it: "", en: "" },
            description: { it: "", en: "" },
            lineItems: [
                { id: `li_${Date.now()}`, label: { it: "Servizio standard", en: "Standard service" }, priceNet: 1000 }
            ],
            packageAdjustmentNet: 0
        };
        updateConfig({ packages: [...config.packages, newPkg] });
        toast.success("Package added");
    };

    const handleRemovePackage = (id: string) => {
        if (!confirm("Are you sure? This will permanently remove this package.")) return;
        updateConfig({ packages: config.packages.filter(p => p.id !== id) });
        toast.info("Package removed");
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

    const handleAddLineItem = (pkgId: string) => {
        const newPkgs = config.packages.map(p => {
            if (p.id !== pkgId) return p;
            return {
                ...p,
                lineItems: [...p.lineItems, { id: `li_${Date.now()}`, label: { it: "Nuova voce", en: "New item" }, priceNet: 0 }]
            };
        });
        updateConfig({ packages: newPkgs });
    };

    const handleRemoveLineItem = (pkgId: string, itemIdx: number) => {
        const newPkgs = config.packages.map(p => {
            if (p.id !== pkgId) return p;
            const newItems = p.lineItems.filter((_, idx) => idx !== itemIdx);
            return { ...p, lineItems: newItems };
        });
        updateConfig({ packages: newPkgs });
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Standard Packages</h3>
                    <p className="text-sm text-gray-500">Manage the predefined packages shown on the homepage.</p>
                </div>
                <Button onClick={handleAddPackage} className="bg-[#719436] hover:bg-[#5a762b]">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Package
                </Button>
            </div>

            {config.packages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden border-l-4 border-l-[#719436] shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="bg-gray-50/50">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Tag className="w-5 h-5 text-[#719436]" />
                                {pkg.name.it || "Untitled Package"}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded border">ID: {pkg.id}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-red-600 h-8 w-8"
                                    onClick={() => handleRemovePackage(pkg.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
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
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-black text-gray-900 uppercase tracking-widest text-[#719436]">Line Items & Pricing</Label>
                                <Button variant="outline" size="sm" onClick={() => handleAddLineItem(pkg.id)} className="h-8 text-xs">
                                    <PlusCircle className="w-3 h-3 mr-1" />
                                    Add Item
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {pkg.lineItems.map((item, idx) => (
                                    <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3 relative group">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{item.id}</span>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center">
                                                    <Input
                                                        type="number"
                                                        className="w-24 h-9 rounded-r-none border-r-0 focus-visible:ring-0"
                                                        value={item.priceNet}
                                                        onChange={e => handleUpdateLineItem(pkg.id, idx, { priceNet: parseFloat(e.target.value) || 0 })}
                                                    />
                                                    <div className="h-9 px-3 flex items-center bg-gray-50 border border-l-0 rounded-r-md text-xs font-bold text-gray-500">€</div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleRemoveLineItem(pkg.id, idx)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
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

                        <div className="flex items-center justify-between p-5 bg-gray-900 text-white rounded-2xl shadow-xl">
                            <div className="space-y-1">
                                <Label className="text-[10px] uppercase text-gray-400 font-black tracking-[0.2em]">Package Adjustment (Discount)</Label>
                                <p className="text-xs text-gray-500">Enter a negative value (e.g. -100) to apply a discount on the total.</p>
                            </div>
                            <div className="flex items-center">
                                <Input
                                    type="number"
                                    className="w-32 h-12 bg-gray-800 border-gray-700 text-white rounded-l-xl rounded-r-none border-r-0 text-lg font-bold focus-visible:ring-0"
                                    value={pkg.packageAdjustmentNet}
                                    onChange={e => handleUpdatePackage(pkg.id, { packageAdjustmentNet: parseFloat(e.target.value) || 0 })}
                                />
                                <div className="h-12 px-5 flex items-center bg-gray-800 border border-l-0 border-gray-700 rounded-r-xl text-lg font-black text-[#719436]">€</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
