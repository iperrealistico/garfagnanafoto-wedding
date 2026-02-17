"use client";

import { AppConfig, LocalizedString } from "@/lib/config-schema";
import { LocalizedInput } from "../localized-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentSectionProps {
    config: AppConfig;
    updateConfig: (updates: Partial<AppConfig>) => void;
}

export function ContentSection({ config, updateConfig }: ContentSectionProps) {
    const handleHeroTitleChange = (val: LocalizedString) => {
        updateConfig({
            copy: {
                ...(config.copy || {
                    reviews: { ratingValue: 5.0, ratingLabel: { it: "", en: "" }, location: { it: "", en: "" }, reviewsUrl: "#" }
                }),
                heroTitle: val
            }
        });
    };

    const handleHeroSubtitleChange = (val: LocalizedString) => {
        updateConfig({
            copy: {
                ...(config.copy || {
                    heroTitle: { it: "", en: "" },
                    reviews: { ratingValue: 5.0, ratingLabel: { it: "", en: "" }, location: { it: "", en: "" }, reviewsUrl: "#" }
                }),
                heroSubtitle: val
            }
        });
    };

    const handleFooterTextChange = (val: LocalizedString) => {
        updateConfig({
            copy: {
                ...(config.copy || {
                    heroTitle: { it: "", en: "" },
                    reviews: { ratingValue: 5.0, ratingLabel: { it: "", en: "" }, location: { it: "", en: "" }, reviewsUrl: "#" }
                }),
                footerText: val
            }
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Hero Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <LocalizedInput
                        label="Hero Main Title"
                        value={config.copy?.heroTitle || { it: "", en: "" }}
                        onChange={handleHeroTitleChange}
                    />
                    <LocalizedInput
                        label="Hero Subtitle"
                        multiline
                        value={config.copy?.heroSubtitle || { it: "", en: "" }}
                        onChange={handleHeroSubtitleChange}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Footer Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <LocalizedInput
                        label="Footer Information / Legal Text"
                        multiline
                        value={config.copy?.footerText || { it: "", en: "" }}
                        onChange={handleFooterTextChange}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
