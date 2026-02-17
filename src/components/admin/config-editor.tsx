"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AppConfig } from "@/lib/config-schema";
import { updateConfigAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Save,
    Undo2,
    Loader2,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sections
import { BrandingSection } from "./sections/BrandingSection";
import { GalleryManager } from "./sections/GalleryManager";
import { ContentSection } from "./sections/ContentSection";
import { ReviewsSection } from "./sections/ReviewsSection";
import { PackagesSection } from "./sections/PackagesSection";
import { QuestionsSection } from "./sections/QuestionsSection";
import { LegalSection } from "./sections/LegalSection";
import { IntegrationsSection } from "./sections/IntegrationsSection";

interface ConfigEditorProps {
    initialConfig: AppConfig;
}

export function ConfigEditor({ initialConfig }: ConfigEditorProps) {
    const [isPending, startTransition] = useTransition();
    const [config, setConfig] = useState<AppConfig>(initialConfig);
    const searchParams = useSearchParams();
    const activeSection = searchParams.get("section") || "branding";

    // Track dirty state
    const isDirty = useMemo(() => {
        return JSON.stringify(config) !== JSON.stringify(initialConfig);
    }, [config, initialConfig]);

    const handleUpdateConfig = (updates: Partial<AppConfig>) => {
        setConfig((prev) => ({ ...prev, ...updates }));
    };

    const handleSave = () => {
        startTransition(async () => {
            const res = await updateConfigAction(config);
            if (res.success) {
                toast.success("Changes saved successfully", {
                    description: "Your live configuration has been updated."
                });
            } else {
                toast.error("Failed to save changes", {
                    description: res.error
                });
            }
        });
    };

    const handleReset = () => {
        if (confirm("Discard all unsaved changes?")) {
            setConfig(initialConfig);
            toast.info("Changes discarded");
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case "branding":
                return <BrandingSection config={config} updateConfig={handleUpdateConfig} />;
            case "gallery":
                return <GalleryManager config={config} updateConfig={handleUpdateConfig} />;
            case "copy":
                return <ContentSection config={config} updateConfig={handleUpdateConfig} />;
            case "reviews":
                return <ReviewsSection config={config} updateConfig={handleUpdateConfig} />;
            case "packages":
                return <PackagesSection config={config} updateConfig={handleUpdateConfig} />;
            case "questions":
                return <QuestionsSection config={config} updateConfig={handleUpdateConfig} />;
            case "legal":
                return <LegalSection config={config} updateConfig={handleUpdateConfig} />;
            case "integrations":
                return <IntegrationsSection config={config} updateConfig={handleUpdateConfig} />;
            default:
                return <BrandingSection config={config} updateConfig={handleUpdateConfig} />;
        }
    };

    return (
        <div className="pb-32 animate-in fade-in duration-500">
            {/* Active Content */}
            <div className="space-y-8">
                {renderSection()}
            </div>

            {/* Sticky Save Bar */}
            <div className={cn(
                "fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-50 transition-all duration-300 transform",
                isDirty ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
            )}>
                <div className="bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 px-2">
                        <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Unsaved Changes</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">You have pending modifications</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="text-gray-400 hover:text-white hover:bg-gray-800 h-10 px-4"
                        >
                            <Undo2 className="w-4 h-4 mr-2" />
                            Discard
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isPending}
                            className="bg-[#719436] hover:bg-[#719436]/90 text-white font-bold h-10 px-6 shadow-lg shadow-[#719436]/20"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Status indicator for non-dirty state */}
            {!isDirty && (
                <div className="fixed bottom-10 right-10 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 transition-opacity duration-1000">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    All changes synced
                </div>
            )}
        </div>
    );
}

