"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

declare global {
    interface Window {
        __GARFAGNANA_PRINT_TRIGGERED__?: boolean;
    }
}

interface PrintPdfPageProps {
    queryString: string;
}

export function PrintPdfPage({ queryString }: PrintPdfPageProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const pdfUrl = useMemo(() => `/quote/pdf${queryString ? `?${queryString}` : ""}`, [queryString]);

    const triggerPrint = useCallback(() => {
        const iframe = iframeRef.current;
        if (!iframe?.contentWindow) return false;

        try {
            window.__GARFAGNANA_PRINT_TRIGGERED__ = true;
            window.dispatchEvent(new CustomEvent("garfagnana:print-triggered", { detail: { pdfUrl } }));
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            return true;
        } catch (error) {
            console.error("Print trigger failed:", error);
            return false;
        }
    }, [pdfUrl]);

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
        setTimeout(() => {
            triggerPrint();
        }, 400);
    }, [triggerPrint]);

    return (
        <div className="fixed inset-0 bg-white flex flex-col z-50">
            {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/90">
                    <Loader2 className="w-10 h-10 animate-spin text-[#719436]" />
                    <p className="text-gray-600 font-medium">Preparazione del PDF...</p>
                </div>
            )}

            <iframe
                ref={iframeRef}
                src={pdfUrl}
                onLoad={handleLoad}
                className="w-full h-full border-none"
                title="Stampa Preventivo PDF"
                data-testid="print-pdf-iframe"
            />

            <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur border border-gray-200 rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <p className="text-xs text-gray-600">
                    Se la stampa non si apre automaticamente, premi il pulsante.
                </p>
                <Button type="button" onClick={triggerPrint} className="h-9 rounded-xl px-4">
                    Stampa
                </Button>
            </div>
        </div>
    );
}
