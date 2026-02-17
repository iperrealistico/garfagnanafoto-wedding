"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { AppConfig, LocalizedString } from "@/lib/config-schema";
import { updateConfigAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { LocalizedInput } from "./localized-input";

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
            className
        )}
        {...props}
    />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

interface ConfigEditorProps {
    initialConfig: AppConfig;
}

export function ConfigEditor({ initialConfig }: ConfigEditorProps) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");
    const [config, setConfig] = useState<AppConfig>(initialConfig);

    const handleSave = () => {
        startTransition(async () => {
            const res = await updateConfigAction(config);
            if (res.success) setMessage("Saved successfully!");
            else setMessage("Error saving: " + res.error);
        });
    };

    const updatePackagePrice = (pkgId: string, itemIndex: number, newPrice: number) => {
        const newPackages = [...config.packages];
        const pkgIndex = newPackages.findIndex(p => p.id === pkgId);
        if (pkgIndex === -1) return;

        const newItems = [...newPackages[pkgIndex].lineItems];
        newItems[itemIndex] = { ...newItems[itemIndex], priceNet: newPrice };
        newPackages[pkgIndex] = { ...newPackages[pkgIndex], lineItems: newItems };

        setConfig({ ...config, packages: newPackages });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Admin Editor</h2>
                <Button onClick={handleSave} disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
            {message && <p className={message.includes("Error") ? "text-red-500" : "text-green-500"}>{message}</p>}

            <Tabs defaultValue="packages" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="packages">Packages</TabsTrigger>
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                    <TabsTrigger value="legal">Global</TabsTrigger>
                    <TabsTrigger value="images">Gallery</TabsTrigger>
                </TabsList>


                <TabsContent value="packages" className="space-y-4">
                    {config.packages.map(pkg => (
                        <Card key={pkg.id}>
                            <CardHeader>
                                <CardTitle>{pkg.name.it} ({pkg.id})</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <LocalizedInput
                                    label="Name"
                                    value={pkg.name}
                                    onChange={(val) => {
                                        const newPkgs = config.packages.map(p => p.id === pkg.id ? { ...p, name: val } : p);
                                        setConfig({ ...config, packages: newPkgs });
                                    }}
                                />
                                <LocalizedInput
                                    label="Tagline"
                                    value={pkg.tagline || { it: "", en: "" }}
                                    onChange={(val) => {
                                        const newPkgs = config.packages.map(p => p.id === pkg.id ? { ...p, tagline: val } : p);
                                        setConfig({ ...config, packages: newPkgs });
                                    }}
                                />
                                <LocalizedInput
                                    label="Description"
                                    multiline
                                    value={pkg.description || { it: "", en: "" }}
                                    onChange={(val) => {
                                        const newPkgs = config.packages.map(p => p.id === pkg.id ? { ...p, description: val } : p);
                                        setConfig({ ...config, packages: newPkgs });
                                    }}
                                />

                                <div className="space-y-2">
                                    <Label>Line Items (Prices & Labels)</Label>
                                    {pkg.lineItems.map((item, idx) => (
                                        <div key={item.id} className="border p-2 rounded">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm font-bold">{item.id}</span>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        className="w-24 h-8"
                                                        value={item.priceNet}
                                                        onChange={e => updatePackagePrice(pkg.id, idx, Number(e.target.value))}
                                                    />
                                                    <span className="text-sm">€</span>
                                                </div>
                                            </div>
                                            <LocalizedInput
                                                value={item.label}
                                                onChange={(val) => {
                                                    const newPackages = [...config.packages];
                                                    const newItems = [...newPackages.find(p => p.id === pkg.id)!.lineItems];
                                                    newItems[idx] = { ...newItems[idx], label: val };
                                                    const newPkgs = config.packages.map(p => p.id === pkg.id ? { ...p, lineItems: newItems } : p);
                                                    setConfig({ ...config, packages: newPkgs });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t">
                                    <span className="flex-1 font-bold">Adjustment (Discount)</span>
                                    <Input
                                        type="number"
                                        className="w-32"
                                        value={pkg.packageAdjustmentNet}
                                        onChange={e => {
                                            const newPkgs = config.packages.map(p => p.id === pkg.id ? { ...p, packageAdjustmentNet: Number(e.target.value) } : p);
                                            setConfig({ ...config, packages: newPkgs });
                                        }}
                                    />
                                    <span className="text-sm text-gray-500">€</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="questions" className="space-y-4">
                    {config.customFlow.questions.map((q, qIndex) => (
                        <Card key={q.id}>
                            <CardHeader className="py-3">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={qIndex === 0}
                                        onClick={() => {
                                            const newQs = [...config.customFlow.questions];
                                            [newQs[qIndex - 1], newQs[qIndex]] = [newQs[qIndex], newQs[qIndex - 1]];
                                            // Update order property
                                            newQs.forEach((q, i) => q.order = i);
                                            setConfig({ ...config, customFlow: { ...config.customFlow, questions: newQs } });
                                        }}
                                    >
                                        ↑
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={qIndex === config.customFlow.questions.length - 1}
                                        onClick={() => {
                                            const newQs = [...config.customFlow.questions];
                                            [newQs[qIndex + 1], newQs[qIndex]] = [newQs[qIndex], newQs[qIndex + 1]];
                                            // Update order property
                                            newQs.forEach((q, i) => q.order = i);
                                            setConfig({ ...config, customFlow: { ...config.customFlow, questions: newQs } });
                                        }}
                                    >
                                        ↓
                                    </Button>
                                    <input
                                        type="checkbox"
                                        checked={q.enabled}
                                        onChange={e => {
                                            const newQs = [...config.customFlow.questions];
                                            newQs[qIndex] = { ...newQs[qIndex], enabled: e.target.checked };
                                            setConfig({ ...config, customFlow: { ...config.customFlow, questions: newQs } });
                                        }}
                                    />
                                    <span className="font-bold text-sm text-gray-400">#{qIndex + 1}</span>
                                    <Input
                                        value={q.id}
                                        readOnly
                                        className="w-32 h-7 text-xs bg-gray-100 text-gray-500"
                                    />
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        if (!confirm("Are you sure you want to delete this question?")) return;
                                        const newQs = config.customFlow.questions.filter((_, i) => i !== qIndex);
                                        setConfig({ ...config, customFlow: { ...config.customFlow, questions: newQs } });
                                    }}
                                >
                                    Delete
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4 py-4">
                                <LocalizedInput
                                    label="Question Text"
                                    value={q.questionText}
                                    onChange={(val) => {
                                        const newQs = [...config.customFlow.questions];
                                        newQs[qIndex] = { ...newQs[qIndex], questionText: val };
                                        setConfig({ ...config, customFlow: { ...config.customFlow, questions: newQs } });
                                    }}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <LocalizedInput
                                        label="Yes Label"
                                        value={q.yesLabel}
                                        onChange={(val) => {
                                            const newQs = [...config.customFlow.questions];
                                            newQs[qIndex] = { ...newQs[qIndex], yesLabel: val };
                                            setConfig({ ...config, customFlow: { ...config.customFlow, questions: newQs } });
                                        }}
                                    />
                                    <LocalizedInput
                                        label="No Label"
                                        value={q.noLabel}
                                        onChange={(val) => {
                                            const newQs = [...config.customFlow.questions];
                                            newQs[qIndex] = { ...newQs[qIndex], noLabel: val };
                                            setConfig({ ...config, customFlow: { ...config.customFlow, questions: newQs } });
                                        }}
                                    />
                                </div>

                                {q.effectsYes?.addLineItems?.map((item, iIdx) => (
                                    <div key={item.id} className="border p-2 rounded bg-gray-50">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-xs font-bold uppercase">Effect Item</span>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    className="w-20 h-6 text-xs"
                                                    value={item.priceNet}
                                                    onChange={e => {
                                                        const newQs = [...config.customFlow.questions];
                                                        const newItems = [...(newQs[qIndex].effectsYes!.addLineItems!)];
                                                        newItems[iIdx] = { ...newItems[iIdx], priceNet: Number(e.target.value) };
                                                        newQs[qIndex] = { ...newQs[qIndex], effectsYes: { ...newQs[qIndex].effectsYes!, addLineItems: newItems } };
                                                        setConfig({ ...config, customFlow: { ...config.customFlow, questions: newQs } });
                                                    }}
                                                />
                                                <span className="text-xs">€</span>
                                            </div>
                                        </div>
                                        <LocalizedInput
                                            value={item.label}
                                            onChange={(val) => {
                                                const newQs = [...config.customFlow.questions];
                                                const newItems = [...(newQs[qIndex].effectsYes!.addLineItems!)];
                                                newItems[iIdx] = { ...newItems[iIdx], label: val };
                                                newQs[qIndex] = { ...newQs[qIndex], effectsYes: { ...newQs[qIndex].effectsYes!, addLineItems: newItems } };
                                                setConfig({ ...config, customFlow: { ...config.customFlow, questions: newQs } });
                                            }}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                    <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => {
                            const newQs = [...config.customFlow.questions];
                            const newId = `q_${Date.now()}`;
                            newQs.push({
                                id: newId,
                                enabled: true,
                                order: newQs.length,
                                questionText: { it: "Nuova Domanda", en: "New Question" },
                                yesLabel: { it: "Sì", en: "Yes" },
                                noLabel: { it: "No", en: "No" }
                            });
                            setConfig({ ...config, customFlow: { ...config.customFlow, questions: newQs } });
                        }}
                    >
                        + Add Question
                    </Button>
                </TabsContent>

                <TabsContent value="legal" className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle>Global Settings: Legal & VAT</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>VAT Rate (0.22 = 22%)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={config.vatRate}
                                    onChange={e => setConfig({ ...config, vatRate: Number(e.target.value) })}
                                />
                            </div>
                            <LocalizedInput
                                label="Delivery Time"
                                value={config.legalCopy.deliveryTime}
                                onChange={val => setConfig({ ...config, legalCopy: { ...config.legalCopy, deliveryTime: val } })}
                            />
                            <LocalizedInput
                                label="Payment Terms"
                                value={config.legalCopy.paymentTerms}
                                onChange={val => setConfig({ ...config, legalCopy: { ...config.legalCopy, paymentTerms: val } })}
                            />
                            <LocalizedInput
                                label="Disclaimer"
                                multiline
                                value={config.legalCopy.disclaimer}
                                onChange={val => setConfig({ ...config, legalCopy: { ...config.legalCopy, disclaimer: val } })}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Website Copy (Hero & Footer)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <LocalizedInput
                                label="Hero Title"
                                value={config.copy?.heroTitle || { it: "Reportage di Matrimonio in Toscana", en: "Wedding Reportage in Tuscany" }}
                                onChange={val => {
                                    const newCopy = { ...config.copy, heroTitle: val } as any;
                                    // Use type assertion or default object construction to avoid TS issues if copy is undefined
                                    setConfig({ ...config, copy: { ...(config.copy || {}), heroTitle: val } as any });
                                }}
                            />
                            <LocalizedInput
                                label="Hero Subtitle"
                                value={config.copy?.heroSubtitle || { it: "", en: "" }}
                                onChange={val => {
                                    setConfig({ ...config, copy: { ...(config.copy || {}), heroSubtitle: val } as any });
                                }}
                            />
                            <LocalizedInput
                                label="Footer Text"
                                value={config.copy?.footerText || { it: "", en: "" }}
                                onChange={val => {
                                    setConfig({ ...config, copy: { ...(config.copy || {}), footerText: val } as any });
                                }}
                            />

                            <div className="space-y-4 pt-4 border-t">
                                <Label className="text-lg font-semibold">Reviews Widget</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Rating Value (e.g. 5.0)</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            value={config.copy?.reviews?.ratingValue ?? 5.0}
                                            onChange={e => {
                                                const currentCopy = config.copy || {};
                                                const currentReviews = (currentCopy as any).reviews || { ratingLabel: { it: "", en: "" }, location: { it: "", en: "" } };
                                                const newReviews = { ...currentReviews, ratingValue: Number(e.target.value) };
                                                setConfig({ ...config, copy: { ...currentCopy, reviews: newReviews } as any });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label>Reviews URL</Label>
                                        <Input
                                            value={config.copy?.reviews?.reviewsUrl ?? "#"}
                                            onChange={e => {
                                                const currentCopy = config.copy || {};
                                                const currentReviews = (currentCopy as any).reviews || { ratingLabel: { it: "", en: "" }, location: { it: "", en: "" } };
                                                const newReviews = { ...currentReviews, reviewsUrl: e.target.value };
                                                setConfig({ ...config, copy: { ...currentCopy, reviews: newReviews } as any });
                                            }}
                                        />
                                    </div>
                                </div>
                                <LocalizedInput
                                    label="Rating Label (e.g. '124 recensioni')"
                                    value={config.copy?.reviews?.ratingLabel || { it: "124 recensioni", en: "124 reviews" }}
                                    onChange={val => {
                                        const currentCopy = config.copy || {};
                                        const currentReviews = (currentCopy as any).reviews || { ratingValue: 5.0, reviewsUrl: "#", location: { it: "", en: "" } };
                                        const newReviews = { ...currentReviews, ratingLabel: val };
                                        setConfig({ ...config, copy: { ...currentCopy, reviews: newReviews } as any });
                                    }}
                                />
                                <LocalizedInput
                                    label="Location Label"
                                    value={config.copy?.reviews?.location || { it: "Toscana, Italia", en: "Tuscany, Italy" }}
                                    onChange={val => {
                                        const currentCopy = config.copy || {};
                                        const currentReviews = (currentCopy as any).reviews || { ratingValue: 5.0, reviewsUrl: "#", ratingLabel: { it: "", en: "" } };
                                        const newReviews = { ...currentReviews, location: val };
                                        setConfig({ ...config, copy: { ...currentCopy, reviews: newReviews } as any });
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="images" className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle>Hero Image</CardTitle></CardHeader>
                        <CardContent>
                            <Input
                                value={config.images?.hero || ""}
                                onChange={e => setConfig({ ...config, images: { ...config.images!, hero: e.target.value } })}
                                placeholder="/images/your-hero.jpg"
                            />
                            <p className="text-xs text-gray-400 mt-2 italic">Percorso relativo all'immagine principale (es. /images/hero.jpg)</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Gallery Images</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {config.images?.gallery?.map((img, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input
                                        value={img}
                                        onChange={e => {
                                            const newGal = [...(config.images?.gallery || [])];
                                            newGal[idx] = e.target.value;
                                            setConfig({ ...config, images: { ...config.images!, gallery: newGal } });
                                        }}
                                    />
                                    <Button variant="ghost" onClick={() => {
                                        const newGal = config.images?.gallery?.filter((_, i) => i !== idx);
                                        setConfig({ ...config, images: { ...config.images!, gallery: newGal || [] } });
                                    }}>Remove</Button>
                                </div>
                            ))}
                            <Button variant="outline" onClick={() => {
                                const newGal = [...(config.images?.gallery || []), ""];
                                setConfig({ ...config, images: { ...config.images!, gallery: newGal } });
                            }}>Add Image Path</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Upload (Coming Soon)</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">
                                L'upload diretto su GitHub sarà abilitato configurando `GITHUB_TOKEN` nelle variabili d'ambiente.
                                Per ora, inserisci i percorsi dei file caricati manualmente in `/public/images`.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    );
}

