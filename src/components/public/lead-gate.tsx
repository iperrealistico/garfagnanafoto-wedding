"use client";

import { useState, useCallback, useEffect } from "react";
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

const LEAD_KEY_PREFIX = "garfagnana_lead_complete_";

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

    // Generate a stable ID for this quote configuration
    const quoteId = useMemo(() => hashQuote(quoteSnapshot), [quoteSnapshot]);
    const storageKey = `${LEAD_KEY_PREFIX}${quoteId}`;

    useEffect(() => {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
            try {
                setLeadState({ hasLead: true, data: JSON.parse(stored) });
            } catch (e) {
                console.error("Failed to parse stored lead", e);
            }
        }
    }, [storageKey]);

    const handleAction = useCallback((callback: (lead: Lead) => void) => {
        if (leadState.hasLead && leadState.data) {
            callback(leadState.data);
            return;
        }

        setPendingCallback(() => callback);
        setIsModalOpen(true);
    }, [leadState]);

    const handleSuccess = (data: Lead) => {
        // Cache the lead state for this session/quote
        const leadWithQuote = { ...data, quote_id: quoteId, quote_snapshot: quoteSnapshot };
        sessionStorage.setItem(storageKey, JSON.stringify(leadWithQuote));
        setLeadState({ hasLead: true, data: leadWithQuote });
        setIsModalOpen(false);

        // Immediately execute the requested action
        if (pendingCallback) {
            pendingCallback(leadWithQuote);
            setPendingCallback(null);
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
                    quote_id: quoteId,
                    quote_snapshot: quoteSnapshot
                }}
            />
        </>
    );
}

import { useMemo } from "react";
