"use client";

import { useState, useMemo } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    TouchSensor
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    GripVertical,
    Trash2,
    Plus,
    Edit2,
    Check,
    X,
    Upload,
    ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppConfig, GalleryImage, LocalizedString } from "@/lib/config-schema";
import { cn } from "@/lib/utils";
import { LocalizedInput } from "../localized-input";
import { toast } from "sonner";
import { ImageUpload } from "../image-upload";

interface GalleryManagerProps {
    config: AppConfig;
    updateConfig: (updates: Partial<AppConfig>) => void;
}

export function GalleryManager({ config, updateConfig }: GalleryManagerProps) {
    const images = useMemo(() => {
        return [...(config.images?.gallery || [])].sort((a, b) => a.order - b.order);
    }, [config.images?.gallery]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = images.findIndex((img) => img.id === active.id);
            const newIndex = images.findIndex((img) => img.id === over.id);

            const newArray = arrayMove(images, oldIndex, newIndex);

            // Re-assign orders
            const updatedImages = newArray.map((img, idx) => ({
                ...img,
                order: idx,
            }));

            updateConfig({
                images: {
                    ...(config.images || { hero: "" }),
                    gallery: updatedImages,
                },
            });

            toast.success("Order updated");
        }
    };

    const handleAddImage = (src = "") => {
        const newImage: GalleryImage = {
            id: `img_${Date.now()}`,
            src: src,
            order: images.length,
            altByLocale: { it: "", en: "" }
        };

        updateConfig({
            images: {
                ...(config.images || { hero: "" }),
                gallery: [...images, newImage],
            },
        });
    };

    const handleRemoveImage = (id: string) => {
        if (!confirm("Are you sure you want to remove this image?")) return;

        const updatedImages = images
            .filter((img) => img.id !== id)
            .map((img, idx) => ({ ...img, order: idx }));

        updateConfig({
            images: {
                ...(config.images || { hero: "" }),
                gallery: updatedImages,
            },
        });
    };

    const handleUpdateImage = (id: string, updates: Partial<GalleryImage>) => {
        const updatedImages = images.map((img) =>
            img.id === id ? { ...img, ...updates } : img
        );

        updateConfig({
            images: {
                ...(config.images || { hero: "" }),
                gallery: updatedImages,
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Gallery Management</h3>
                    <p className="text-sm text-gray-500">Drag and drop to reorder images. Best for reportage shots.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => handleAddImage()} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Empty
                    </Button>
                    <ImageUpload
                        onUploadSuccess={(path) => handleAddImage(path)}
                        label="Upload New"
                        className="flex-1 sm:flex-initial"
                    />
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={images.map(img => img.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((img) => (
                            <SortableImageCard
                                key={img.id}
                                image={img}
                                onRemove={() => handleRemoveImage(img.id)}
                                onUpdate={(updates) => handleUpdateImage(img.id, updates)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {images.length === 0 && (
                <div className="border-2 border-dashed rounded-2xl p-20 flex flex-col items-center justify-center text-center bg-gray-50">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 mb-4">
                        <ImageIcon className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">No images yet</h4>
                    <p className="text-sm text-gray-500 mt-2 max-w-xs">Start building your gallery by adding your first wedding reportage image.</p>
                    <div className="mt-8 flex gap-3">
                        <Button onClick={() => handleAddImage()} variant="outline">
                            Manual Path
                        </Button>
                        <ImageUpload
                            onUploadSuccess={(path) => handleAddImage(path)}
                            label="Upload First Photos"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

interface SortableImageCardProps {
    image: GalleryImage;
    onRemove: () => void;
    onUpdate: (updates: Partial<GalleryImage>) => void;
}

function SortableImageCard({ image, onRemove, onUpdate }: SortableImageCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: image.id });

    const [isEditing, setIsEditing] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200",
                isDragging && "shadow-xl ring-2 ring-[#719436] ring-offset-2"
            )}
        >
            <div className="relative aspect-video bg-gray-100">
                {image.src ? (
                    <img
                        src={image.src}
                        alt="Gallery"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                    </div>
                )}

                {/* Drag Handle Overlay */}
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 bg-black/5 flex items-center justify-center transition-opacity"
                >
                    <div className="bg-white/90 p-2 rounded-lg shadow-lg">
                        <GripVertical className="w-6 h-6 text-gray-600" />
                    </div>
                </div>

                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 shadow-md"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 shadow-md"
                        onClick={onRemove}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="p-4 space-y-3">
                {isEditing ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Image Source</Label>
                            <Input
                                value={image.src}
                                onChange={(e) => onUpdate({ src: e.target.value })}
                                className="h-8 text-xs"
                                placeholder="/images/wedding.jpg"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Alt Text (IT)</Label>
                            <Input
                                value={image.altByLocale?.it || ""}
                                onChange={(e) => onUpdate({ altByLocale: { ...(image.altByLocale || { it: "", en: "" }), it: e.target.value } })}
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Alt Text (EN)</Label>
                            <Input
                                value={image.altByLocale?.en || ""}
                                onChange={(e) => onUpdate({ altByLocale: { ...(image.altByLocale || { it: "", en: "" }), en: e.target.value } })}
                                className="h-8 text-xs"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-8 text-xs"
                            onClick={() => setIsEditing(false)}
                        >
                            Done
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 truncate font-mono">{image.src || "No source"}</p>
                            <p className="text-sm font-medium text-gray-700 truncate mt-0.5">
                                {image.altByLocale?.it || (image.altByLocale?.en || "No description")}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
