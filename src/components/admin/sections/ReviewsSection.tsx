"use client";

import { AppConfig, LocalizedString } from "@/lib/config-schema";
import { LocalizedInput } from "../localized-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReviewsSectionProps {
    config: AppConfig;
    updateConfig: (updates: Partial<AppConfig>) => void;
}

export function ReviewsSection({ config, updateConfig }: ReviewsSectionProps) {
    const handleUpdateReviews = (updates: any) => {
        const currentCopy = config.copy || {
            heroTitle: { it: "", en: "" },
            reviews: { ratingValue: 5.0, ratingLabel: { it: "", en: "" }, location: { it: "", en: "" }, reviewsUrl: "#" }
        };
        const currentReviews = currentCopy.reviews;

        updateConfig({
            copy: {
                ...currentCopy,
                heroTitle: currentCopy.heroTitle || { it: "", en: "" },
                reviews: {
                    ...currentReviews,
                    ...updates
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Reviews Widget Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Rating Value (e.g. 5.0)</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={config.copy?.reviews?.ratingValue ?? 5.0}
                                onChange={(e) => handleUpdateReviews({ ratingValue: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>

                    <LocalizedInput
                        label="Rating Label (e.g. '124 reviews')"
                        value={config.copy?.reviews?.ratingLabel || { it: "", en: "" }}
                        onChange={(val) => handleUpdateReviews({ ratingLabel: val })}
                    />

                    <LocalizedInput
                        label="Main Office / Studio Location"
                        value={config.copy?.reviews?.location || { it: "", en: "" }}
                        onChange={(val) => handleUpdateReviews({ location: val })}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
