import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
    ACCESS_COOKIE_NAME,
    hasValidAccessSession,
    isAccessProtectionEnabled,
    sanitizeAccessRedirectTarget,
} from "@/lib/access-control";

const locales = ["it", "en"];
const defaultLocale = "it";

function hasLocale(pathname: string) {
    return locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
}

function isStaticAsset(pathname: string) {
    return (
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico" ||
        pathname.includes(".")
    );
}

function isUnlocalizedUtilityRoute(pathname: string) {
    return (
        pathname === "/access" ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/quote")
    );
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isStaticAsset(pathname)) return;

    const pathnameHasLocale = hasLocale(pathname);

    if (!pathnameHasLocale && !isUnlocalizedUtilityRoute(pathname)) {
        request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
        return NextResponse.redirect(request.nextUrl);
    }

    if (!isAccessProtectionEnabled()) {
        return;
    }

    if (pathname.startsWith("/api/access")) return;

    const hasSession = await hasValidAccessSession(
        request.cookies.get(ACCESS_COOKIE_NAME)?.value
    );

    if (pathname === "/access") {
        if (!hasSession) return;

        const redirectUrl = new URL(
            sanitizeAccessRedirectTarget(request.nextUrl.searchParams.get("next")),
            request.url
        );
        return NextResponse.redirect(redirectUrl);
    }

    if (hasSession) return;

    const redirectUrl = new URL("/access", request.url);
    redirectUrl.searchParams.set(
        "next",
        `${pathname}${request.nextUrl.search || ""}`
    );
    return NextResponse.redirect(redirectUrl);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};
