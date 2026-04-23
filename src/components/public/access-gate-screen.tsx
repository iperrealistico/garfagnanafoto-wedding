"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AccessGateScreenProps {
    nextPath: string;
    protectionEnabled: boolean;
    brandTitle: string;
    logoSrc: string;
}

export function AccessGateScreen({
    nextPath,
    protectionEnabled,
    brandTitle,
    logoSrc,
}: AccessGateScreenProps) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const unlockAndRedirect = (target: string) => {
        setErrorMessage("");
        setIsUnlocked(true);
        window.setTimeout(() => {
            router.replace(target);
            router.refresh();
        }, 260);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!protectionEnabled) {
            unlockAndRedirect(nextPath);
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const response = await fetch("/api/access", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password,
                    next: nextPath,
                }),
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                setErrorMessage(
                    typeof payload?.error === "string"
                        ? payload.error
                        : "Non siamo riusciti a verificare la password."
                );
                return;
            }

            unlockAndRedirect(
                typeof payload?.redirectTo === "string" ? payload.redirectTo : nextPath
            );
        } catch {
            setErrorMessage("Errore di connessione. Riprova tra qualche secondo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(113,148,54,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_22%),linear-gradient(140deg,#04060d_0%,#0a1120_45%,#060912_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,4,10,0.22)_48%,rgba(2,4,10,0.74)_100%)]" />

            <motion.div
                aria-hidden
                className="absolute left-[8%] top-[10%] h-56 w-56 rounded-full bg-[#719436]/20 blur-3xl"
                animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.36, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                aria-hidden
                className="absolute bottom-[12%] right-[10%] h-52 w-52 rounded-full bg-[#7e8da9]/18 blur-3xl"
                animate={{ scale: [1.04, 0.98, 1.05], opacity: [0.16, 0.28, 0.16] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={isUnlocked ? { opacity: 0.84, y: -8, scale: 0.985 } : { opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_28px_110px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                >
                    <div className="grid gap-10 px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.1fr_0.82fr] lg:gap-8">
                        <div className="flex flex-col justify-between gap-10">
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/95 p-2 shadow-sm">
                                        <Image src={logoSrc} alt={brandTitle} fill className="object-contain p-2" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/58">
                                            Area privata
                                        </p>
                                        <h1 className="text-xl font-semibold text-white sm:text-2xl">
                                            {brandTitle}
                                        </h1>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/80">
                                        <Sparkles className="h-3.5 w-3.5 text-[#9bc35a]" />
                                        Accesso riservato ai clienti
                                    </div>
                                    <div className="space-y-4">
                                        <h2 className="max-w-xl text-4xl font-semibold leading-[1.02] text-white sm:text-5xl">
                                            Sblocca il listino wedding con una password privata.
                                        </h2>
                                        <p className="max-w-lg text-base leading-7 text-white/68">
                                            Un accesso semplice, discreto e riservato: chi riceve il link dal
                                            fotografo puo vedere prezzi e preventivi in un ambiente dedicato.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-4">
                                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                                        Esperienza
                                    </p>
                                    <p className="mt-3 text-sm leading-6 text-white/76">
                                        Interfaccia privata e minimal, pensata per mostrare solo cio che serve.
                                    </p>
                                </div>
                                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-4">
                                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                                        Accesso
                                    </p>
                                    <p className="mt-3 text-sm leading-6 text-white/76">
                                        Nessun database, nessuna area pubblica aperta, solo un gate rapido lato server.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 18 }}
                            animate={isUnlocked ? { opacity: 0.78, x: 0, scale: 0.985 } : { opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                            className="rounded-[1.8rem] border border-white/10 bg-[#07111d]/88 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#9bc35a]/20 bg-[#9bc35a]/12 text-[#b7dd78]">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/42">
                                        Private gate
                                    </p>
                                    <p className="mt-1 text-sm text-white/72">
                                        Inserisci la password ricevuta per continuare.
                                    </p>
                                </div>
                            </div>

                            <motion.form
                                onSubmit={handleSubmit}
                                animate={errorMessage ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                                transition={{ duration: 0.28 }}
                                className="mt-8 space-y-5"
                            >
                                <label className="block space-y-2.5">
                                    <span className="text-sm font-medium tracking-[0.02em] text-white">
                                        Password di accesso
                                    </span>
                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/38" />
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            autoComplete="current-password"
                                            placeholder="Inserisci la password"
                                            className="h-14 rounded-2xl border-white/10 bg-white/[0.05] pl-11 text-base text-white shadow-none placeholder:text-white/34"
                                            disabled={isSubmitting || isUnlocked}
                                        />
                                    </div>
                                </label>

                                <AnimatePresence>
                                    {errorMessage ? (
                                        <motion.p
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                                        >
                                            {errorMessage}
                                        </motion.p>
                                    ) : null}
                                </AnimatePresence>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || isUnlocked || !password.trim()}
                                    className="group h-14 w-full rounded-2xl bg-[#719436] text-base font-semibold text-white hover:bg-[#7c9d3e]"
                                >
                                    <span>
                                        {isUnlocked
                                            ? "Accesso confermato"
                                            : isSubmitting
                                                ? "Verifica in corso..."
                                                : "Entra nell'area privata"}
                                    </span>
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </Button>
                            </motion.form>

                            <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-[11px] uppercase tracking-[0.22em] text-white/44">
                                <span>wedding.garfagnanafoto.it</span>
                                <span>Solo su invito</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {isUnlocked ? (
                    <motion.div
                        className="pointer-events-none absolute inset-0 z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,195,90,0.22),rgba(7,12,20,0.18)_28%,rgba(7,12,20,0.84)_70%)]"
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: [0, 1, 0], scale: [0.92, 1.06, 1.12] }}
                            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <motion.div
                            className="absolute left-1/2 top-1/2 h-44 w-44 rounded-full border border-white/20"
                            style={{ x: "-50%", y: "-50%" }}
                            initial={{ opacity: 0, scale: 0.35 }}
                            animate={{ opacity: [0, 0.8, 0], scale: [0.35, 1.35, 1.8] }}
                            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: [0, 1, 0], scale: [0.96, 1, 1.04] }}
                            transition={{ duration: 0.32, ease: "easeOut" }}
                        >
                            <div className="rounded-full border border-white/12 bg-white/[0.06] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.32em] text-white">
                                Accesso autorizzato
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </main>
    );
}
