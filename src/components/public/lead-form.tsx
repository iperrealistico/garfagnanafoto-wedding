"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lead, LeadPayload, LeadPayloadSchema } from "../../lib/config-schema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { saveLeadAction } from "../../app/admin/actions";
import { useState } from "react";
import { parseLeadPayload, toLeadPayload, toLeadRecord } from "../../lib/lead-payload";

interface LeadFormProps {
    onSubmitSuccess: (data: LeadPayload) => void;
    gdprNotice: string;
    lang: string;
    leadMeta?: Partial<Lead>;
    initialPayload?: Partial<LeadPayload>;
    submitLabel?: string;
}

export function LeadForm({ onSubmitSuccess, gdprNotice, lang, leadMeta, initialPayload, submitLabel }: LeadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialLeadPayload = toLeadPayload(leadMeta);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LeadPayload>({
        resolver: zodResolver(LeadPayloadSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            weddingLocation: "",
            ...initialLeadPayload,
            ...initialPayload,
        },
    });

    const persistLead = async (payload: LeadPayload) => {
        try {
            const result = await saveLeadAction(
                toLeadRecord(payload, {
                    ...leadMeta,
                    locale: lang,
                    gdpr_accepted_at: new Date().toISOString(),
                })
            );

            if (result.success) {
                toast.success(lang === 'it' ? "Richiesta inviata con successo!" : "Request sent successfully!");
                return;
            }

            console.error("Lead save failed:", result.error);
            toast.warning(
                lang === 'it'
                    ? "Non siamo riusciti a salvare i tuoi dati, ma il preventivo è pronto."
                    : "We couldn't save your data, but your quote is ready."
            );
        } catch (e) {
            console.error("Lead save exception:", e);
            toast.warning(
                lang === 'it'
                    ? "Errore di connessione. Il preventivo è comunque disponibile."
                    : "Connection error. Your quote is still available."
            );
        }
    };

    const onFormSubmit = (data: LeadPayload) => {
        setIsSubmitting(true);
        const payload = parseLeadPayload(data);

        // Execute the requested action immediately after validation
        // so browsers do not block the document popup as "async".
        onSubmitSuccess(payload);
        setIsSubmitting(false);

        void persistLead(payload);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">{lang === 'it' ? 'Nome' : 'First Name'} *</Label>
                    <Input id="firstName" {...register("firstName")} placeholder={lang === 'it' ? 'Mario' : 'John'} />
                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">{lang === 'it' ? 'Cognome' : 'Last Name'} *</Label>
                    <Input id="lastName" {...register("lastName")} placeholder={lang === 'it' ? 'Rossi' : 'Doe'} />
                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="mario@esempio.it" />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">{lang === 'it' ? 'Telefono' : 'Phone'} *</Label>
                    <Input id="phone" {...register("phone")} placeholder="+39 123 456 7890" />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="weddingLocation">{lang === 'it' ? 'Indirizzo location matrimonio' : 'Wedding location address'}</Label>
                <Input id="weddingLocation" {...register("weddingLocation")} placeholder={lang === 'it' ? 'Lucca, Toscana' : 'London, UK'} />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 leading-relaxed">
                    {gdprNotice}
                </p>
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? (lang === 'it' ? 'Invio in corso...' : 'Sending...') : (submitLabel || (lang === 'it' ? 'Procedi al Preventivo' : 'Proceed to Quote'))}
            </Button>
        </form>
    );
}
