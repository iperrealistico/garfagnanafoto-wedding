/* @vitest-environment jsdom */

import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LeadGate } from "../src/components/public/lead-gate";
import { resolveQuoteDocumentActionUrl } from "../src/lib/quote-document-url";

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        warning: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("../src/components/public/lead-form", () => {
    function MockLeadForm({
        onSubmitSuccess,
        submitLabel,
        lang,
    }: {
        onSubmitSuccess: (data: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            weddingLocation: string;
        }) => void;
        submitLabel?: string;
        lang: string;
    }) {
        const [firstName, setFirstName] = React.useState("");
        const [lastName, setLastName] = React.useState("");
        const [email, setEmail] = React.useState("");
        const [phone, setPhone] = React.useState("");
        const [weddingLocation, setWeddingLocation] = React.useState("");

        return (
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmitSuccess({
                        firstName,
                        lastName,
                        email,
                        phone,
                        weddingLocation,
                    });
                }}
            >
                <label htmlFor="firstName">{lang === "it" ? "Nome" : "First Name"}</label>
                <input id="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} />

                <label htmlFor="lastName">{lang === "it" ? "Cognome" : "Last Name"}</label>
                <input id="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} />

                <label htmlFor="email">Email</label>
                <input id="email" value={email} onChange={(event) => setEmail(event.target.value)} />

                <label htmlFor="phone">{lang === "it" ? "Telefono" : "Phone"}</label>
                <input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} />

                <label htmlFor="weddingLocation">
                    {lang === "it" ? "Indirizzo location matrimonio" : "Wedding location address"}
                </label>
                <input
                    id="weddingLocation"
                    value={weddingLocation}
                    onChange={(event) => setWeddingLocation(event.target.value)}
                />

                <button type="submit">{submitLabel || "Conferma e Genera"}</button>
            </form>
        );
    }

    return {
        LeadForm: MockLeadForm,
    };
});

type DocumentAction = "download" | "print";

function ActionHarness({ action }: { action: DocumentAction }) {
    return (
        <LeadGate
            quoteSnapshot={{ packageId: "pkg_photo_only", totalNet: 1100 }}
            gdprNotice="GDPR"
            lang="it"
            initialLeadData={{ package_id: "pkg_photo_only" }}
        >
            {({ handleAction }) => (
                <button
                    type="button"
                    onClick={() =>
                        handleAction((lead) => {
                            const href = resolveQuoteDocumentActionUrl(action, {
                                packageId: "pkg_photo_only",
                                lead,
                            });
                            window.open(href, "_blank", "noopener,noreferrer");
                        })
                    }
                >
                    {action === "download" ? "Download" : "Print"}
                </button>
            )}
        </LeadGate>
    );
}

async function fillLeadForm() {
    fireEvent.change(screen.getByLabelText(/^nome/i), { target: { value: "Mario" } });
    fireEvent.change(screen.getByLabelText(/^cognome/i), { target: { value: "Rossi" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "mario@example.com" } });
    fireEvent.change(screen.getByLabelText(/telefono/i), { target: { value: "+39 333 123 4567" } });
    fireEvent.change(screen.getByLabelText(/indirizzo location matrimonio/i), { target: { value: "Lucca, Toscana" } });
}

describe("quote generation e2e flow", () => {
    const openSpy = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        window.sessionStorage.clear();
        openSpy.mockReset();
        Object.defineProperty(window, "open", {
            writable: true,
            value: openSpy,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
    });

    it("standard package download captures lead and opens PDF with all lead fields", async () => {
        render(<ActionHarness action="download" />);

        fireEvent.click(screen.getByRole("button", { name: "Download" }));
        expect(screen.getByText("I tuoi recapiti")).toBeTruthy();

        await fillLeadForm();
        fireEvent.click(screen.getByRole("button", { name: "Conferma e Genera" }));

        await waitFor(() => {
            expect(openSpy).toHaveBeenCalledTimes(1);
        });

        const [url] = openSpy.mock.calls[0] as [string];
        expect(url.startsWith("/quote/pdf?")).toBe(true);

        const query = new URL(url, "https://example.test").searchParams;
        expect(query.get("firstName")).toBe("Mario");
        expect(query.get("lastName")).toBe("Rossi");
        expect(query.get("email")).toBe("mario@example.com");
        expect(query.get("phone")).toBe("+39 333 123 4567");
        expect(query.get("weddingLocation")).toBe("Lucca, Toscana");
    });

    it("print flow opens print wrapper that carries the same PDF payload", async () => {
        render(<ActionHarness action="print" />);

        fireEvent.click(screen.getByRole("button", { name: "Print" }));
        await fillLeadForm();
        fireEvent.click(screen.getByRole("button", { name: "Conferma e Genera" }));

        await waitFor(() => {
            expect(openSpy).toHaveBeenCalledTimes(1);
        });

        const [url] = openSpy.mock.calls[0] as [string];
        expect(url.startsWith("/quote/print?")).toBe(true);
        expect(url).toContain("firstName=Mario");
    });

    it("modal closes via X and clears pending action state", async () => {
        render(<ActionHarness action="download" />);

        fireEvent.click(screen.getByRole("button", { name: "Download" }));
        fireEvent.click(screen.getByRole("button", { name: "Chiudi" }));

        await waitFor(() => {
            expect(screen.queryByText("I tuoi recapiti")).toBeNull();
        });
        expect(openSpy).toHaveBeenCalledTimes(0);

        fireEvent.click(screen.getByRole("button", { name: "Download" }));
        await fillLeadForm();
        fireEvent.click(screen.getByRole("button", { name: "Conferma e Genera" }));

        await waitFor(() => {
            expect(openSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("modal closes via ESC", async () => {
        render(<ActionHarness action="download" />);

        fireEvent.click(screen.getByRole("button", { name: "Download" }));
        fireEvent.keyDown(window, { key: "Escape" });

        await waitFor(() => {
            expect(screen.queryByText("I tuoi recapiti")).toBeNull();
        });
        expect(openSpy).toHaveBeenCalledTimes(0);
    });

    it("print wrapper triggers print hook when iframe is loaded", async () => {
        vi.useFakeTimers();
        const { PrintPdfPage } = await import("../src/components/public/print-pdf-page");
        render(
            <PrintPdfPage queryString="packageId=pkg_photo_only&firstName=Mario&lastName=Rossi&email=mario%40example.com&phone=%2B39%20333%20123%204567&weddingLocation=Lucca" />
        );

        const iframe = screen.getByTestId("print-pdf-iframe") as HTMLIFrameElement;
        const printSpy = vi.fn();
        const focusSpy = vi.fn();
        Object.defineProperty(iframe, "contentWindow", {
            configurable: true,
            value: {
                focus: focusSpy,
                print: printSpy,
            },
        });

        fireEvent.load(iframe);
        vi.advanceTimersByTime(450);

        expect(window.__GARFAGNANA_PRINT_TRIGGERED__).toBe(true);
        expect(focusSpy).toHaveBeenCalledTimes(1);
        expect(printSpy).toHaveBeenCalledTimes(1);

        vi.useRealTimers();
    });
});
