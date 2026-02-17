import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["it", "en"];
const defaultLocale = "it";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    // Additional check: exclude API routes, static files, admin routes, quote routes (which might be shared or handled differently, but for now let's keep them out of locale prefix if they are special, OR include them if we want localized quotes)
    // Actually, standard practice is everything localized.
    // BUT: /admin, /quote/pdf, /api/og should probably be excluded or handled carefully.
    // /quote/pdf is an API route effectively.
    // /admin is internal.
    // Let's exclude specific paths from locale redirect.
    if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/quote/pdf") ||
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
        // Skip all internal paths (_next)
        // "/((?!_next).*)",
        // Optional: only run on root and specific pages? No, usually exclude static.
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - admin
         * - quote/pdf
         */
        "/((?!api|_next/static|_next/image|favicon.ico|admin|quote/pdf).*)",
    ],
};
