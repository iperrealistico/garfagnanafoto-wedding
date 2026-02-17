"use client";

import { AppConfig, LocalizedString } from "@/lib/config-schema";
import { LocalizedInput } from "../localized-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface BrandingSectionProps {
    config: AppConfig;
    updateConfig: (updates: Partial<AppConfig>) => void;
}

import { ImageUpload } from "../image-upload";

export function BrandingSection({ config, updateConfig }: BrandingSectionProps) {
    const handleHeaderTitleChange = (val: LocalizedString) => {
        updateConfig({
            header: {
                ...(config.header || { logo: { src: "/images/logo.png", alt: { it: "", en: "" } } }),
                title: val
            }
        });
    };

    const handleLogoSrcChange = (src: string) => {
        updateConfig({
            header: {
                ...(config.header || { title: { it: "Garfagnanafoto", en: "" }, logo: { src: "", alt: { it: "", en: "" } } }),
                logo: {
                    ...(config.header?.logo || { alt: { it: "", en: "" } }),
                    src
                }
            }
        });
    };

    const handleLogoAltChange = (val: LocalizedString) => {
        updateConfig({
            header: {
                ...(config.header || { title: { it: "Garfagnanafoto", en: "" }, logo: { src: "/images/logo.png", alt: { it: "", en: "" } } }),
                logo: {
                    ...(config.header?.logo || { src: "/images/logo.png" }),
                    alt: val
                }
            }
        });
    };

    const handleHeroChange = (src: string) => {
        updateConfig({
            images: {
                ...(config.images || { gallery: [] }),
                hero: src
            }
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Header Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <LocalizedInput
                        label="Menu Bar Title"
                        value={config.header?.title || { it: "Garfagnanafoto", en: "" }}
                        onChange={handleHeaderTitleChange}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Logo Image</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={config.header?.logo?.src || ""}
                                        onChange={(e) => handleLogoSrcChange(e.target.value)}
                                        placeholder="/images/logo.png"
                                        className="flex-1"
                                    />
                                    <ImageUpload onUploadSuccess={handleLogoSrcChange} label="Upload" className="w-32" />
                                </div>
                            </div>
                            <LocalizedInput
                                label="Logo Accessibility Alt Text"
                                value={config.header?.logo?.alt || { it: "", en: "" }}
                                onChange={handleLogoAltChange}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-dashed">
                            <Label className="mb-4">Logo Preview</Label>
                            <div className="relative w-32 h-32 flex items-center justify-center bg-white rounded-lg shadow-sm p-4 overflow-hidden">
                                {config.header?.logo?.src ? (
                                    <img
                                        src={config.header.logo.src}
                                        alt="Logo Preview"
                                        className="max-w-full max-h-full object-contain"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-gray-200" />
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Hero Section Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Hero Image Source</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={config.images?.hero || ""}
                                        onChange={(e) => handleHeroChange(e.target.value)}
                                        placeholder="/images/hero.jpg"
                                        className="flex-1"
                                    />
                                    <ImageUpload onUploadSuccess={handleHeroChange} label="Upload" className="w-32" />
                                </div>
                            </div>
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Questa immagine appare nella parte superiore della home page.
                                    Si consiglia un'immagine orizzontale di alta qualità (min. 1920px).
                                </p>
                            </div>
                        </div>
                        <div className="relative aspect-video rounded-xl overflow-hidden border shadow-inner bg-gray-50">
                            {config.images?.hero ? (
                                <img
                                    src={config.images.hero}
                                    alt="Hero Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

import { ImageIcon } from "lucide-react";
