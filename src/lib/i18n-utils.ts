import { LocalizedString } from "./config-schema";

export type ValidLocale = "it" | "en";

export function getLocalized(obj: LocalizedString | undefined, lang: string): string {
    if (!obj) return "";
    const locale = (lang === "en" ? "en" : "it") as ValidLocale;
    return obj[locale] || obj["it"] || "";
}
