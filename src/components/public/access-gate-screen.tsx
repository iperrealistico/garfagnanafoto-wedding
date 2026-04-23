"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AccessGateScreenProps {
    nextPath: string;
    protectionEnabled: boolean;
    brandTitle: string;
    logoSrc: string;
    heroImage: string;
}

export function AccessGateScreen({
    nextPath,
    protectionEnabled,
    brandTitle,
    logoSrc,
    heroImage,
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
        }, 950);
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
        <main className="relative min-h-screen overflow-hidden bg-[#f4efe7] text-slate-950">
            <Image
                src={heroImage}
                alt="Garfagnanafoto Wedding"
                fill
                priority
                className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,17,13,0.82),rgba(11,17,13,0.38)_40%,rgba(244,239,231,0.18))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(113,148,54,0.32),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_30%)]" />

            <motion.div
                aria-hidden
                className="absolute left-[8%] top-[12%] h-40 w-40 rounded-full bg-[#719436]/25 blur-3xl"
                animate={{ scale: [1, 1.08, 1], opacity: [0.32, 0.5, 0.32] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                aria-hidden
                className="absolute bottom-[10%] right-[8%] h-48 w-48 rounded-full bg-white/20 blur-3xl"
                animate={{ scale: [1.05, 1, 1.06], opacity: [0.2, 0.34, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl"
                >
                    <div className="border-b border-white/15 bg-white/10 px-6 py-5 sm:px-8">
                        <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white/90 p-2 shadow-sm">
                                <Image src={logoSrc} alt={brandTitle} fill className="object-contain p-2" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                                    Area privata
                                </p>
                                <h1 className="text-xl font-semibold text-white sm:text-2xl">
                                    {brandTitle}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 px-6 py-7 sm:px-8 sm:py-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                                <Sparkles className="h-3.5 w-3.5" />
                                Listino wedding riservato
                            </div>
                            <div className="space-y-3">
                                <h2 className="max-w-md text-3xl font-semibold leading-tight text-white sm:text-4xl">
                                    Inserisci la password per sbloccare i prezzi.
                                </h2>
                                <p className="max-w-lg text-sm leading-6 text-white/72 sm:text-base">
                                    Questa pagina e i relativi preventivi sono visibili solo ai clienti che
                                    ricevono l&apos;accesso diretto dal fotografo.
                                </p>
                            </div>
                        </div>

                        <motion.form
                            onSubmit={handleSubmit}
                            animate={errorMessage ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                            transition={{ duration: 0.28 }}
                            className="space-y-4"
                        >
                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-white/88">Password di accesso</span>
                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        autoComplete="current-password"
                                        placeholder="Inserisci la password"
                                        className="h-14 rounded-2xl border-white/20 bg-white pl-11 text-base text-slate-900 shadow-sm placeholder:text-slate-400"
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
                                        className="rounded-2xl border border-rose-200/70 bg-rose-50/95 px-4 py-3 text-sm text-rose-700"
                                    >
                                        {errorMessage}
                                    </motion.p>
                                ) : null}
                            </AnimatePresence>

                            <Button
                                type="submit"
                                disabled={isSubmitting || isUnlocked || !password.trim()}
                                className="h-14 w-full rounded-2xl bg-[#719436] text-base font-semibold text-white hover:bg-[#64852f]"
                            >
                                {isUnlocked
                                    ? "Accesso sbloccato"
                                    : isSubmitting
                                        ? "Verifica in corso..."
                                        : "Sblocca l'accesso"}
                            </Button>
                        </motion.form>

                        <div className="flex items-center justify-between gap-4 border-t border-white/12 pt-4 text-xs uppercase tracking-[0.24em] text-white/52">
                            <span>wedding.garfagnanafoto.it</span>
                            <span>Accesso riservato</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {isUnlocked ? (
                    <motion.div
                        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-y-0 left-0 w-1/2 bg-[#111a12]"
                            initial={{ x: 0 }}
                            animate={{ x: "-100%" }}
                            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        />
                        <motion.div
                            className="absolute inset-y-0 right-0 w-1/2 bg-[#111a12]"
                            initial={{ x: 0 }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        />
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: [0, 1, 0], scale: [0.92, 1, 1.04] }}
                            transition={{ duration: 0.9, ease: "easeInOut" }}
                        >
                            <div className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-medium uppercase tracking-[0.28em] text-white">
                                Accesso autorizzato
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </main>
    );
}
