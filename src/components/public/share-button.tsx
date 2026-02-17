"use client";

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Fallback for safety
        if (typeof window === 'undefined') return;

        const url = window.location.href;
        const title = "Garfagnanafoto Wedding";
        const text = "Guarda questo reportage di matrimonio!";

        // Check for navigator.share support
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch (err) {
                console.log("Error sharing", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy", err);
            }
        }
    };

    return (
        <Button
            variant="ghost"
            className="underline font-semibold h-auto p-0 hover:bg-transparent gap-2"
            onClick={handleShare}
        >
            <FontAwesomeIcon icon={copied ? faCheck : faShareNodes} />
            {copied ? "Copiato!" : "Condividi"}
        </Button>
    );
}
