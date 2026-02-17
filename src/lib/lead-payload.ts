import { Lead, LeadPayload, LeadPayloadSchema, LeadSchema } from "./config-schema";

type SearchParamsLike = Pick<URLSearchParams, "get">;

const toOptional = (value?: string | null) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
};

export function toLeadPayload(data?: Partial<Lead> | Partial<LeadPayload>): Partial<LeadPayload> {
    if (!data) return {};

    const input = data as Partial<Lead> & Partial<LeadPayload>;

    return {
        firstName: input.firstName ?? input.first_name,
        lastName: input.lastName ?? input.last_name,
        email: input.email,
        phone: input.phone,
        weddingLocation: input.weddingLocation ?? input.wedding_location,
    };
}

export function parseLeadPayload(payload: Partial<LeadPayload>): LeadPayload {
    return LeadPayloadSchema.parse({
        ...payload,
        weddingLocation: payload.weddingLocation ?? "",
    });
}

export function toLeadRecord(payload: LeadPayload, meta?: Partial<Lead>): Lead {
    return LeadSchema.parse({
        ...meta,
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        wedding_location: payload.weddingLocation || "",
    });
}

export function readLeadPayloadFromSearchParams(searchParams: SearchParamsLike): Partial<LeadPayload> {
    return {
        firstName: toOptional(searchParams.get("firstName")) ?? toOptional(searchParams.get("first_name")),
        lastName: toOptional(searchParams.get("lastName")) ?? toOptional(searchParams.get("last_name")),
        email: toOptional(searchParams.get("email")),
        phone: toOptional(searchParams.get("phone")),
        weddingLocation: toOptional(searchParams.get("weddingLocation")) ?? toOptional(searchParams.get("location")),
    };
}

export function writeLeadPayloadToSearchParams(searchParams: URLSearchParams, payload?: Partial<LeadPayload>) {
    if (!payload) return;

    if (payload.firstName) searchParams.set("firstName", payload.firstName);
    if (payload.lastName) searchParams.set("lastName", payload.lastName);
    if (payload.email) searchParams.set("email", payload.email);
    if (payload.phone) searchParams.set("phone", payload.phone);
    if (payload.weddingLocation) searchParams.set("weddingLocation", payload.weddingLocation);
}
