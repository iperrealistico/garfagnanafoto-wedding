import { CustomAnswers } from "@/lib/pricing-engine";

export function parseCustomParams(searchParams: URLSearchParams): { answers: CustomAnswers, additionalRequests: string } {
    const answers: CustomAnswers = {};
    const additionalRequests = searchParams.get("requests") || "";

    searchParams.forEach((value, key) => {
        if (key === "custom" || key === "requests" || key === "packageId") return;
        if (value === "1" || value === "true") {
            answers[key] = true;
        }
    });

    return { answers, additionalRequests };
}
