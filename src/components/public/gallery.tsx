"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

interface GalleryProps {
    images: string[];
    heroImage: string;
    showAllLabel?: string;
}

export function Gallery({ images, heroImage, showAllLabel = "Mostra tutte le foto" }: GalleryProps) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    // Combine hero and gallery for the lightbox slides
    // Ensure hero is first if not already in gallery, or just use gallery if hero is part of it?
    // Usually hero is separate. Let's assume:
    // Lightbox slides = [heroImage, ...images] (deduplicated if necessary)

    // Simple approach: All images available in lightbox
    const allImages = [heroImage, ...images.filter(img => img !== heroImage)];

    const slides = allImages.map(src => ({ src }));

    const handleOpen = (idx: number) => {
        setIndex(idx);
        setOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[450px] md:h-[550px] rounded-2xl overflow-hidden relative">
                <div
                    className="col-span-2 row-span-2 relative cursor-pointer"
                    onClick={() => handleOpen(0)}
                >
                    <Image
                        src={heroImage}
                        alt="Matrimonio in Toscana - Hero"
                        fill
                        className="object-cover hover:brightness-90 transition-all duration-300"
                        priority
                    />
                </div>

                {/* Display up to 4 other images */}
                {images.slice(0, 4).map((img, idx) => (
                    <div
                        key={idx}
                        className="relative cursor-pointer"
                        onClick={() => handleOpen(idx + 1)} // +1 because index 0 is hero
                    >
                        <Image
                            src={img}
                            alt={`Dettaglio matrimonio ${idx + 1}`}
                            fill
                            className="object-cover hover:brightness-90 transition-all duration-300"
                        />
                    </div>
                ))}

                {/* Show sidebar/extra items logic? 
                    If fewer than 4 items, we just show what we have.
                    If more, the button allows seeing all. 
                */}

                <Button
                    variant="outline"
                    className="absolute bottom-6 right-6 bg-white border-black text-xs font-semibold px-4 py-2 hover:bg-gray-100 rounded-lg shadow-sm"
                    onClick={() => setOpen(true)}
                >
                    {showAllLabel}
                </Button>
            </div>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={slides}
                plugins={[Thumbnails, Zoom, Fullscreen]}
            />
        </>
    );
}
