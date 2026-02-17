"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lead, LeadSchema } from "@/lib/config-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { saveLeadAction } from "@/app/admin/actions";
import { useState } from "react";

interface LeadFormProps {
    onSubmitSuccess: (data: Lead) => void;
    gdprNotice: string;
    lang: string;
    initialData?: Partial<Lead>;
    submitLabel?: string;
}

export function LeadForm({ onSubmitSuccess, gdprNotice, lang, initialData, submitLabel }: LeadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Lead>({
        resolver: zodResolver(LeadSchema),
        defaultValues: {
            locale: lang,
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            wedding_location: "",
            ...initialData,
        },
    });

    const onFormSubmit = async (data: Lead) => {
        setIsSubmitting(true);
        try {
            // Kick off save in background to avoid blocking the window.open interaction context
            saveLeadAction({
                ...data,
                gdpr_accepted_at: new Date().toISOString(),
            }).then(result => {
                if (result.success) {
                    toast.success(lang === 'it' ? "Richiesta inviata con successo!" : "Request sent successfully!");
                } else {
                    console.error("Lead save failed:", result.error);
                }
            }).catch(e => {
                console.error("Lead save exception:", e);
            });

            // Immediately advance flow to preserve "trusted" context for window.open
            onSubmitSuccess(data);
        } catch (e) {
            console.error("Error during submission flow:", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="first_name">{lang === 'it' ? 'Nome' : 'First Name'} *</Label>
                    <Input id="first_name" {...register("first_name")} placeholder={lang === 'it' ? 'Mario' : 'John'} />
                    {errors.first_name && <p className="text-xs text-red-500">{errors.first_name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last_name">{lang === 'it' ? 'Cognome' : 'Last Name'} *</Label>
                    <Input id="last_name" {...register("last_name")} placeholder={lang === 'it' ? 'Rossi' : 'Doe'} />
                    {errors.last_name && <p className="text-xs text-red-500">{errors.last_name.message}</p>}
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
                <Label htmlFor="wedding_location">{lang === 'it' ? 'Luogo del Matrimonio' : 'Wedding Location'}</Label>
                <Input id="wedding_location" {...register("wedding_location")} placeholder={lang === 'it' ? 'Lucca, Toscana' : 'London, UK'} />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 leading-relaxed">
                    {gdprNotice}
                </p>
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 animate-in fade-in slide-in-from-top-1">
                    {lang === 'it' ? 'Per favore, compila tutti i campi obbligatori correttamente.' : 'Please fill all required fields correctly.'}
                </div>
            )}

            <button
                type="submit"
                className="w-full h-14 text-lg font-bold bg-black text-white rounded-2xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg active:scale-95"
                disabled={isSubmitting}
            >
                {isSubmitting ? (lang === 'it' ? 'Invio in corso...' : 'Sending...') : (submitLabel || (lang === 'it' ? 'Procedi al Preventivo' : 'Proceed to Quote'))}
            </button>
        </form>
    );
}
