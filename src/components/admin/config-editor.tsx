"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { AppConfig } from "@/lib/config-schema";
import { updateConfigAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

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


// NOTE: For MVP, we are using a simplified form approach. 
// Ideally we valid with Zod Schema, but for "edit fields" we can just bind to state or use react-hook-form.
// Given complexity of nested arrays, react-hook-form is best.

interface ConfigEditorProps {
    initialConfig: AppConfig;
}

export function ConfigEditor({ initialConfig }: ConfigEditorProps) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    // We'll manage form state via React Hook Form
    // BUT to avoid installing @hookform/resolvers and complex setup right now,
    // I'll implement a "JSON Dump" editor for fallback + specific fields editor?
    // No, let's try to make a nice form for critical parts.

    // Actually, full form is huge. 
    // Let's implement editing for:
    // 1. Package Prices (Net)
    // 2. Legal Copy
    // 3. Questions (just text and prices)

    // I will use a simple state approach for MVP speed.
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
                                <CardTitle>{pkg.name} ({pkg.id})</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={pkg.description}
                                        onChange={e => {
                                            const newPkgs = config.packages.map(p => p.id === pkg.id ? { ...p, description: e.target.value } : p);
                                            setConfig({ ...config, packages: newPkgs });
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Line Items (Prices)</Label>
                                    {pkg.lineItems.map((item, idx) => (
                                        <div key={item.id} className="flex items-center gap-2">
                                            <span className="flex-1 text-sm">{item.label}</span>
                                            <Input
                                                type="number"
                                                className="w-32"
                                                value={item.priceNet}
                                                onChange={e => updatePackagePrice(pkg.id, idx, Number(e.target.value))}
                                            />
                                            <span className="text-sm text-gray-500">€</span>
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
                                    <input
                                        type="checkbox"
                                        checked={q.enabled}
                                        onChange={e => {
                                            const newQs = [...config.customFlow.questions];
                                            newQs[qIndex] = { ...newQs[qIndex], enabled: e.target.checked };
                                            setConfig({ ...config, customFlow: { ...config.customFlow, questions: newQs } });
                                        }}
                                    />
                                    <span className="font-bold text-sm">#{q.order} {q.id}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2 py-4">
                                <Input
                                    value={q.questionText}
                                    onChange={e => {
                                        const newQs = [...config.customFlow.questions];
                                        newQs[qIndex] = { ...newQs[qIndex], questionText: e.target.value };
                                        setConfig({ ...config, customFlow: { ...config.customFlow, questions: newQs } });
                                    }}
                                />
                                {/* Price editing for effects. Simplification: Assume single item in effectsYes */}
                                {q.effectsYes?.addLineItems?.map((item, iIdx) => (
                                    <div key={item.id} className="flex items-center gap-2 ml-4">
                                        <span className="text-sm text-gray-500">Effect: {item.label}</span>
                                        <Input
                                            type="number"
                                            className="w-24 h-8"
                                            value={item.priceNet}
                                            onChange={e => {
                                                const newQs = [...config.customFlow.questions];
                                                const newItems = [...(newQs[qIndex].effectsYes!.addLineItems!)];
                                                newItems[iIdx] = { ...newItems[iIdx], priceNet: Number(e.target.value) };
                                                newQs[qIndex] = { ...newQs[qIndex], effectsYes: { ...newQs[qIndex].effectsYes!, addLineItems: newItems } };
                                                setConfig({ ...config, customFlow: { ...config.customFlow, questions: newQs } });
                                            }}
                                        />
                                        <span className="text-sm">€</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="legal" className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle>Global Settings</CardTitle></CardHeader>
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
                            <div>
                                <Label>Delivery Time</Label>
                                <Input
                                    value={config.legalCopy.deliveryTime}
                                    onChange={e => setConfig({ ...config, legalCopy: { ...config.legalCopy, deliveryTime: e.target.value } })}
                                />
                            </div>
                            <div>
                                <Label>Payment Terms</Label>
                                <Input
                                    value={config.legalCopy.paymentTerms}
                                    onChange={e => setConfig({ ...config, legalCopy: { ...config.legalCopy, paymentTerms: e.target.value } })}
                                />
                            </div>
                            <div>
                                <Label>Disclaimer</Label>
                                <Textarea
                                    value={config.legalCopy.disclaimer}
                                    onChange={e => setConfig({ ...config, legalCopy: { ...config.legalCopy, disclaimer: e.target.value } })}
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
        </div>
    );
}

