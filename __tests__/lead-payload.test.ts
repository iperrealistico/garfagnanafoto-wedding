import { describe, expect, it } from "vitest";
import { readLeadPayloadFromSearchParams, writeLeadPayloadToSearchParams } from "../src/lib/lead-payload";

describe("lead payload composer", () => {
    it("reads all customer fields from query params for PDF payload", () => {
        const params = new URLSearchParams({
            firstName: "Mario",
            lastName: "Rossi",
            email: "mario@example.com",
            phone: "+39 333 123 4567",
            weddingLocation: "Lucca, Toscana",
        });

        const payload = readLeadPayloadFromSearchParams(params);

        expect(payload).toEqual({
            firstName: "Mario",
            lastName: "Rossi",
            email: "mario@example.com",
            phone: "+39 333 123 4567",
            weddingLocation: "Lucca, Toscana",
        });
    });

    it("supports legacy snake_case params as fallback", () => {
        const params = new URLSearchParams({
            first_name: "Giulia",
            last_name: "Bianchi",
            email: "giulia@example.com",
            phone: "+39 333 765 4321",
            location: "Pisa",
        });

        const payload = readLeadPayloadFromSearchParams(params);
        expect(payload.firstName).toBe("Giulia");
        expect(payload.lastName).toBe("Bianchi");
        expect(payload.weddingLocation).toBe("Pisa");
    });

    it("writes all customer fields to query params", () => {
        const params = new URLSearchParams();
        writeLeadPayloadToSearchParams(params, {
            firstName: "Luca",
            lastName: "Verdi",
            email: "luca@example.com",
            phone: "+39 333 000 1111",
            weddingLocation: "Firenze",
        });

        expect(params.get("firstName")).toBe("Luca");
        expect(params.get("lastName")).toBe("Verdi");
        expect(params.get("email")).toBe("luca@example.com");
        expect(params.get("phone")).toBe("+39 333 000 1111");
        expect(params.get("weddingLocation")).toBe("Firenze");
    });
});
