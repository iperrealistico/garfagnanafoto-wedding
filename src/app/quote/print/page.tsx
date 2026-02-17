"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Loader2 } from "lucide-react";

function PrintContent() {
    const searchParams = useSearchParams();
    const [isLoaded, setIsLoaded] = useState(false);

    const pdfUrl = `/quote/pdf?${searchParams.toString()}`;

    useEffect(() => {
        // We want to trigger print after some time to ensure the iframe content is ready
        // and fonts are loaded if possible.
        const timer = setTimeout(() => {
            if (isLoaded) {
                try {
                    const iframe = document.getElementById('print-iframe') as HTMLIFrameElement;
                    if (iframe && iframe.contentWindow) {
                        iframe.contentWindow.focus();
                        iframe.contentWindow.print();
                    }
                } catch (e) {
                    console.error("Print failed:", e);
                    // Fallback to window.print if iframe print fails
                    window.print();
                }
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [isLoaded]);

    return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
            {!isLoaded && (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#719436]" />
                    <p className="text-gray-500 font-medium">Preparazione alla stampa...</p>
                </div>
            )}
            <iframe
                id="print-iframe"
                src={pdfUrl}
                className={`w-full h-full border-none ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                title="Stampa Preventivo"
            />
            {isLoaded && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 no-print bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-6">
                    <p className="text-sm text-gray-600 font-medium">Il dialogo di stampa dovrebbe aprirsi automaticamente.</p>
                    <button
                        onClick={() => {
                            const iframe = document.getElementById('print-iframe') as HTMLIFrameElement;
                            iframe?.contentWindow?.print();
                        }}
                        className="bg-[#719436] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#5a762b] transition-colors"
                    >
                        Riapri Stampa
                    </button>
                    <button
                        onClick={() => window.close()}
                        className="text-gray-400 hover:text-gray-600 font-medium"
                    >
                        Chiudi
                    </button>
                </div>
            )}
        </div>
    );
}

export default function PrintPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#719436]" />
            </div>
        }>
            <PrintContent />
        </Suspense>
    );
}
