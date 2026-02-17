"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadImageAction } from "@/app/admin/actions";

interface ImageUploadProps {
    onUploadSuccess: (path: string) => void;
    label?: string;
    className?: string;
}

export function ImageUpload({ onUploadSuccess, label = "Upload Image", className }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("File is too large (max 5MB)");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadImageAction(formData);
            if (result.success && result.path) {
                onUploadSuccess(result.path);
                toast.success("Image uploaded successfully");
            } else {
                toast.error(result.error || "Upload failed");
            }
        } catch (error) {
            toast.error("An error occurred during upload");
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    return (
        <div className={className}>
            <div className="relative">
                <Input
                    type="file"
                    className="hidden"
                    id="image-upload-input"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
                <Button
                    asChild
                    variant="outline"
                    className="w-full cursor-pointer h-10 border-dashed border-2 hover:border-[#719436] hover:bg-green-50 transition-all"
                    disabled={isUploading}
                >
                    <label htmlFor="image-upload-input" className="flex items-center justify-center gap-2">
                        {isUploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4" />
                        )}
                        {isUploading ? "Uploading..." : label}
                    </label>
                </Button>
            </div>
        </div>
    );
}
