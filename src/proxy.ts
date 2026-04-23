import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["it", "en"];
const defaultLocale = "it";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    // Keep utility routes unlocalized.
    if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/quote") ||
        pathname.startsWith("/custom") ||
        pathname.startsWith("/_next") ||
        pathname.includes(".") // files
    ) {
        return;
    }

    // Redirect if no locale
    const locale = defaultLocale;
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|admin|quote|custom).*)",
    ],
};
