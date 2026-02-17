import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.ADMIN_SESSION_SECRET || "fh_U2WU2XXV2YT_g1Z-fAm-2bisP5nYij7ciT-8qhqR7Yjc4KfZqorTalYD7XoUS";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") // 7 days session
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function login(formData: FormData) {
    const password = formData.get("password");

    if (password !== process.env.ADMIN_PASSWORD) {
        return false;
    }

    // Create the session
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = await encrypt({ user: "admin", expires });

    // Save the session in a cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", session, { expires, httpOnly: true, sameSite: "strict", secure: true });

    return true;
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "", { expires: new Date(0) });
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch (e) {
        return null;
    }
}
