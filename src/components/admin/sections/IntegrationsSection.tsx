"use client";

import { useState } from "react";
import { AppConfig } from "@/lib/config-schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, CheckCircle2, XCircle, Loader2, Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface IntegrationsSectionProps {
    config: AppConfig;
    updateConfig: (updates: Partial<AppConfig>) => void;
}

export function IntegrationsSection({ config, updateConfig }: IntegrationsSectionProps) {
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

    const testConnection = async () => {
        setIsTesting(true);
        setTestResult(null);
        try {
            // This will call a server action we'll implement in Phase 4
            const response = await fetch("/api/admin/github-test", { method: "POST" });
            const data = await response.json();

            if (data.success) {
                setTestResult({ success: true, message: "Connected successfully!", details: data.info });
                toast.success("GitHub connection verified");
            } else {
                setTestResult({ success: false, message: data.error || "Connection failed" });
                toast.error("GitHub connection failed");
            }
        } catch (e) {
            setTestResult({ success: false, message: "Network error while testing connection" });
            toast.error("Test failed");
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-l-4 border-l-gray-900">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Github className="w-5 h-5" />
                        <CardTitle className="text-lg">GitHub Integration</CardTitle>
                    </div>
                    <CardDescription>
                        Used for persistent storage of uploaded images in your repository.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="text-xs text-gray-500 space-y-2">
                            <p className="font-semibold text-gray-700">Environment Variables Required:</p>
                            <ul className="list-disc ml-4 space-y-1">
                                <li><code>GITHUB_TOKEN</code> (Fine-grained or Classic PAT)</li>
                                <li><code>GITHUB_OWNER</code> (Your username/org)</li>
                                <li><code>GITHUB_REPO_NAME</code> (This repo name)</li>
                            </ul>
                            <p>Verify these are set in your Vercel project settings.</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-semibold">Diagnostic Tool</h4>
                                <p className="text-xs text-gray-500">Test if your token has correct permissions.</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={testConnection}
                                disabled={isTesting}
                                className="gap-2"
                            >
                                {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
                                Test Connection
                            </Button>
                        </div>

                        {testResult && (
                            <div className={cn(
                                "p-4 rounded-lg border flex items-start gap-3 mb-4 animate-in fade-in duration-300",
                                testResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                            )}>
                                {testResult.success ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                )}
                                <div className="space-y-1">
                                    <p className={cn(
                                        "text-sm font-bold",
                                        testResult.success ? "text-green-800" : "text-red-800"
                                    )}>
                                        {testResult.message}
                                    </p>
                                    {testResult.details && (
                                        <div className="text-[10px] text-green-700 font-mono space-y-0.5">
                                            <p>Repo: {testResult.details.repo}</p>
                                            <p>Branch: {testResult.details.branch}</p>
                                            <p>Token Scope: {testResult.details.scopes?.join(", ") || "N/A"}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Storage Policy</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        When you upload an image, it is pushed to the <code>/public/images</code> folder in your GitHub repository.
                        Vercel will then automatically redeploy (or you can use dynamic serving) to make the image live.
                        If you prefer direct hosting without GitHub, use the <b>Supabase Storage</b> option in the Gallery settings.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

import { cn } from "@/lib/utils";
