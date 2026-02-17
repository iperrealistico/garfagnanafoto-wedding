import { CustomAnswers } from "@/lib/pricing-engine";

export function parseCustomParams(searchParams: URLSearchParams): { answers: CustomAnswers, additionalRequests: string } {
    const answers: CustomAnswers = {};
    const additionalRequests = searchParams.get("requests") || "";
    const reservedKeys = new Set([
        "custom",
        "requests",
        "packageId",
        "firstName",
        "lastName",
        "weddingLocation",
        "email",
        "phone",
        "first_name",
        "last_name",
        "location",
    ]);

    searchParams.forEach((value, key) => {
        if (reservedKeys.has(key)) return;

        if (value === "1" || value === "true") {
            answers[key] = true;
            return;
        }

        if (value.trim()) {
            answers[key] = value;
        }
    });

    return { answers, additionalRequests };
}
