"use client";

import { useState, useCallback } from "react";
import { Lead } from "@/lib/config-schema";
import { LeadModal } from "./lead-modal";
import { hashQuote } from "@/lib/hash-utils";

interface LeadGateProps {
    children: (props: {
        handleAction: (callback: (lead: Lead) => void) => void;
        hasLead: boolean;
        leadData?: Partial<Lead>;
    }) => React.ReactNode;
    quoteSnapshot: any;
    gdprNotice: string;
    lang: string;
    initialLeadData?: Partial<Lead>;
}

export function LeadGate({
    children,
    quoteSnapshot,
    gdprNotice,
    lang,
    initialLeadData
}: LeadGateProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingCallback, setPendingCallback] = useState<((lead: Lead) => void) | null>(null);
    const [leadState, setLeadState] = useState<{ hasLead: boolean; data?: Lead }>({ hasLead: false });

    const handleAction = useCallback((callback: (lead: Lead) => void) => {
        console.log("LeadGate: handleAction triggered");
        if (leadState.hasLead && leadState.data) {
            console.log("LeadGate: Lead already exists, executing callback immediately");
            callback(leadState.data);
            return;
        }

        console.log("LeadGate: Opening modal...");
        setPendingCallback(() => callback);
        setIsModalOpen(true);
    }, [leadState]);

    const handleSuccess = (data: Lead) => {
        console.log("LeadGate: handleSuccess triggered", data);
        try {
            // Just keep in memory for this component's lifecycle
            const quoteId = hashQuote(quoteSnapshot);
            const leadWithQuote = { ...data, quote_id: quoteId, quote_snapshot: quoteSnapshot };

            console.log("LeadGate: Updating state and closing modal");
            setLeadState({ hasLead: true, data: leadWithQuote });
            setIsModalOpen(false);

            // Immediately execute the requested action
            if (pendingCallback) {
                console.log("LeadGate: Executing pendingCallback");
                const callback = pendingCallback;
                setPendingCallback(null);
                callback(leadWithQuote);
            } else {
                console.warn("LeadGate: No pendingCallback found in handleSuccess");
            }
        } catch (e) {
            console.error("Critical error in handleSuccess:", e);
            // Fallback: at least try to close modal
            setIsModalOpen(false);
        }
    };

    return (
        <>
            {children({
                handleAction,
                hasLead: leadState.hasLead,
                leadData: leadState.data
            })}
            <LeadModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setPendingCallback(null);
                }}
                onSuccess={handleSuccess}
                gdprNotice={gdprNotice}
                lang={lang}
                initialData={{
                    ...initialLeadData,
                    quote_snapshot: quoteSnapshot
                }}
            />
        </>
    );
}
