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

export interface GalleryImage {
    id: string;
    src: string;
    altByLocale?: { it: string; en: string };
    order: number;
}

interface GalleryProps {
    images: GalleryImage[];
    heroImage: string;
    showAllLabel?: string;
    lang?: string;
}

export function Gallery({ images, heroImage, showAllLabel = "Mostra tutte le foto", lang = "it" }: GalleryProps) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    // Filter out hero from images if it's there? Normally it shouldn't be.
    // Ensure images are sorted by order
    const sortedGallery = [...images].sort((a, b) => a.order - b.order);

    const slides = [
        { src: heroImage, alt: "Hero" },
        ...sortedGallery.map(img => ({
            src: img.src,
            alt: lang === 'en' ? img.altByLocale?.en : img.altByLocale?.it
        }))
    ];

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
                {sortedGallery.slice(0, 4).map((img, idx) => (
                    <div
                        key={img.id}
                        className="relative cursor-pointer"
                        onClick={() => handleOpen(idx + 1)} // +1 because index 0 is hero
                    >
                        <Image
                            src={img.src}
                            alt={lang === 'en' ? (img.altByLocale?.en || "") : (img.altByLocale?.it || "")}
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
