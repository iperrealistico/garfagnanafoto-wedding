import { LeadPayload, LeadPayloadSchema } from "./config-schema";

type SearchParamsLike = Pick<URLSearchParams, "get">;

const toOptional = (value?: string | null) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
};

export function parseLeadPayload(payload: Partial<LeadPayload>): LeadPayload {
    return LeadPayloadSchema.parse({
        ...payload,
        weddingLocation: payload.weddingLocation ?? "",
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
