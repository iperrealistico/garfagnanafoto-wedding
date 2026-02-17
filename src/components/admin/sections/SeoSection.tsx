import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppConfig, LocalizedString } from "@/lib/config-schema";
import { LocalizedInput } from "../localized-input";
import { ImageUpload } from "../image-upload";
import { ImageIcon } from "lucide-react";

interface SeoSectionProps {
    config: AppConfig;
    updateConfig: (updates: Partial<AppConfig>) => void;
}

export function SeoSection({ config, updateConfig }: SeoSectionProps) {
    const handleMetaTitleChange = (val: LocalizedString) => {
        updateConfig({
            seo: {
                ...(config.seo || {}),
                metaTitle: val
            }
        });
    };

    const handleMetaDescriptionChange = (val: LocalizedString) => {
        updateConfig({
            seo: {
                ...(config.seo || {}),
                metaDescription: val
            }
        });
    };

    const handleFeaturedImageChange = (src: string) => {
        updateConfig({
            seo: {
                ...(config.seo || {}),
                featuredImage: src
            }
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Search Engine Optimization (SEO)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <LocalizedInput
                        label="Meta Title (Browser Tab)"
                        value={config.seo?.metaTitle || { it: "", en: "" }}
                        onChange={handleMetaTitleChange}
                        placeholder={{ it: "Titolo per Google...", en: "Title for Google..." }}
                    />

                    <div className="space-y-2">
                        <Label>Meta Description</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">Italian</Label>
                                <Textarea
                                    value={config.seo?.metaDescription?.it || ""}
                                    onChange={(e) => handleMetaDescriptionChange({ ...config.seo?.metaDescription || { it: "", en: "" }, it: e.target.value })}
                                    placeholder="Descrizione per i risultati di ricerca..."
                                    className="h-24 resize-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">English</Label>
                                <Textarea
                                    value={config.seo?.metaDescription?.en || ""}
                                    onChange={(e) => handleMetaDescriptionChange({ ...config.seo?.metaDescription || { it: "", en: "" }, en: e.target.value })}
                                    placeholder="Description for search results..."
                                    className="h-24 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Featured Image (Social Share)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={config.seo?.featuredImage || ""}
                                        onChange={(e) => handleFeaturedImageChange(e.target.value)}
                                        placeholder="/images/og-image.jpg"
                                        className="flex-1"
                                    />
                                    <ImageUpload onUploadSuccess={handleFeaturedImageChange} label="Upload" className="w-32" />
                                </div>
                                <p className="text-xs text-gray-500">Immagine mostrata quando il sito viene condiviso su Facebook, WhatsApp, ecc.</p>
                            </div>
                        </div>
                        <div className="relative aspect-video rounded-xl overflow-hidden border bg-gray-50">
                            {config.seo?.featuredImage ? (
                                <img
                                    src={config.seo.featuredImage}
                                    alt="Featured Preview"
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
