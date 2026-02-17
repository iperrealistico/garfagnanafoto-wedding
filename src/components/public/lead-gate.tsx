"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Lead, LeadPayload } from "../../lib/config-schema";
import { LeadModal } from "./lead-modal";
import { hashQuote } from "../../lib/hash-utils";
import { readLeadFromSession, writeLeadToSession } from "../../lib/lead-cache";
import { toLeadPayload } from "../../lib/lead-payload";
import { toast } from "sonner";

interface LeadGateProps {
    children: (props: {
        handleAction: (callback: (lead: LeadPayload) => void) => void;
        hasLead: boolean;
        leadData?: Partial<LeadPayload>;
    }) => React.ReactNode;
    quoteSnapshot: unknown;
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
    const [pendingCallback, setPendingCallback] = useState<((lead: LeadPayload) => void) | null>(null);
    const [leadState, setLeadState] = useState<{ hasLead: boolean; data?: LeadPayload }>({ hasLead: false });
    const quoteId = useMemo(() => hashQuote(quoteSnapshot), [quoteSnapshot]);

    useEffect(() => {
        const cachedLead = readLeadFromSession(quoteId);

        if (cachedLead) {
            setLeadState({
                hasLead: true,
                data: cachedLead,
            });
            return;
        }

        setLeadState({ hasLead: false });
    }, [quoteId]);

    const handleAction = useCallback((callback: (lead: LeadPayload) => void) => {
        if (leadState.hasLead && leadState.data) {
            callback(leadState.data);
            return;
        }

        setPendingCallback(() => callback);
        setIsModalOpen(true);
    }, [leadState]);

    const handleSuccess = (data: LeadPayload) => {
        writeLeadToSession(quoteId, data);

        setLeadState({ hasLead: true, data });
        setIsModalOpen(false);

        // Immediately execute the requested action
        if (pendingCallback) {
            try {
                pendingCallback(data);
            } catch (error) {
                console.error("Failed to execute pending quote action", error);
                toast.error(
                    lang === "it"
                        ? "Si è verificato un errore nell'apertura del documento."
                        : "An error occurred while opening the document."
                );
            }
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
                leadMeta={{
                    ...initialLeadData,
                    quote_id: quoteId,
                    quote_snapshot: quoteSnapshot
                }}
                initialPayload={toLeadPayload(leadState.data)}
            />
        </>
    );
}
