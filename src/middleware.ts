import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.ADMIN_SESSION_SECRET || "fh_U2WU2XXV2YT_g1Z-fAm-2bisP5nYij7ciT-8qhqR7Yjc4KfZqorTalYD7XoUS";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
    const adminSession = request.cookies.get("admin_session")?.value;

    // Paths to protect
    if (request.nextUrl.pathname.startsWith("/admin")) {

        // Allow login page public
        if (request.nextUrl.pathname.startsWith("/admin/login")) {
            return NextResponse.next();
        }

        if (!adminSession) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        try {
            await jwtVerify(adminSession, key, { algorithms: ["HS256"] });
            return NextResponse.next();
        } catch (error) {
            // Invalid token
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
