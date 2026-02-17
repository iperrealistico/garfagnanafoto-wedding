"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LeadForm } from "./lead-form";
import { Lead, LeadPayload } from "../../lib/config-schema";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface LeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: LeadPayload) => void;
    gdprNotice: string;
    lang: string;
    leadMeta?: Partial<Lead>;
    initialPayload?: Partial<LeadPayload>;
    title?: string;
}

export function LeadModal({ isOpen, onClose, onSuccess, gdprNotice, lang, leadMeta, initialPayload, title }: LeadModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900">
                                {title || (lang === 'it' ? 'I tuoi recapiti' : 'Your Contact Info')}
                            </h2>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full"
                                aria-label={lang === "it" ? "Chiudi" : "Close"}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="p-8">
                            <LeadForm
                                onSubmitSuccess={onSuccess}
                                gdprNotice={gdprNotice}
                                lang={lang}
                                leadMeta={leadMeta}
                                initialPayload={initialPayload}
                                submitLabel={lang === 'it' ? 'Conferma e Genera' : 'Confirm and Generate'}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
