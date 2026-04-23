import { NextResponse } from "next/server";
import {
    ACCESS_COOKIE_MAX_AGE,
    ACCESS_COOKIE_NAME,
    createAccessSessionToken,
    isAccessProtectionEnabled,
    isSubmittedPasswordValid,
    sanitizeAccessRedirectTarget,
} from "@/lib/access-control";

export async function POST(request: Request) {
    const payload = await request.json().catch(() => null);
    const password = typeof payload?.password === "string" ? payload.password : "";
    const nextPath = sanitizeAccessRedirectTarget(
        typeof payload?.next === "string" ? payload.next : null
    );

    if (!isAccessProtectionEnabled()) {
        return NextResponse.json(
            { error: "Protezione non configurata sul server." },
            { status: 503 }
        );
    }

    if (!isSubmittedPasswordValid(password)) {
        return NextResponse.json(
            { error: "Password non corretta." },
            { status: 401 }
        );
    }

    const response = NextResponse.json({
        ok: true,
        redirectTo: nextPath,
    });

    response.cookies.set({
        name: ACCESS_COOKIE_NAME,
        value: await createAccessSessionToken(),
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: ACCESS_COOKIE_MAX_AGE,
    });

    return response;
}
