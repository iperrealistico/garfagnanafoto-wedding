import { z } from "zod";
import { AdditionalAdjustment, AdditionalAdjustmentSchema } from "./config-schema";

const AdditionalAdjustmentsArraySchema = z.array(AdditionalAdjustmentSchema);

type AdditionalAdjustmentInput = Partial<AdditionalAdjustment> & {
    priceDeltaNet?: number | string;
};

function normalizeText(value?: string) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
}

function normalizeNumber(value?: number | string) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string" && value.trim()) {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    return 0;
}

export function normalizeAdditionalAdjustments(items?: ReadonlyArray<AdditionalAdjustmentInput>): AdditionalAdjustment[] {
    if (!items || items.length === 0) return [];

    return items
        .map((item, index) => ({
            id: item.id?.trim() || `adj_${index + 1}`,
            title: item.title?.trim() || "",
            description: normalizeText(item.description),
            priceDeltaNet: normalizeNumber(item.priceDeltaNet),
        }))
        .filter((item) => item.title || item.description || item.priceDeltaNet !== 0)
        .map((item) => AdditionalAdjustmentSchema.parse(item));
}

export function serializeAdditionalAdjustments(items?: ReadonlyArray<AdditionalAdjustmentInput>) {
    const normalized = normalizeAdditionalAdjustments(items);
    if (normalized.length === 0) return "";
    return JSON.stringify(normalized);
}

export function parseAdditionalAdjustments(serialized?: string | null): AdditionalAdjustment[] {
    if (!serialized?.trim()) return [];

    const raw = JSON.parse(serialized) as unknown;
    const parsed = AdditionalAdjustmentsArraySchema.parse(raw);

    return parsed.map((item, index) => ({
        ...item,
        id: item.id || `adj_${index + 1}`,
        description: normalizeText(item.description),
    }));
}
