# Garfagnanafoto Wedding

Static-first Next.js application for the Garfagnanafoto wedding website, package pricing, and PDF/print output.

## Tech Stack
- **Next.js 16 (App Router)**
- **Tailwind CSS**
- **Framer Motion** (Wizard animations)
- **@react-pdf/renderer** (PDF generation)
- **Vitest** (Unit tests)

## Features
- **Private Landing Page**: Reserved access with password gate before visitors can see pricing.
- **Landing Page**: Modern, Airbnb-like UI showcasing the fixed wedding packages.
- **Summary & Export**: Instantly see results with VAT breakdown, and export to PDF or Print.
- **Static Configuration**: All public content, pricing, legal copy, and gallery assets live in checked-in code.

## Configuration

The site no longer depends on Supabase or any runtime database.

The single source of truth for site content and pricing is:

- [`src/lib/default-config.ts`](/Users/leonardofiori/Documents/Antigravity/garfagnanafoto-wedding/src/lib/default-config.ts)
- [`src/lib/app-config.ts`](/Users/leonardofiori/Documents/Antigravity/garfagnanafoto-wedding/src/lib/app-config.ts)

Edit the config file directly to update package pricing, legal copy, SEO text, and gallery image paths.

Lead details entered in the quote flow are used locally to personalize the quote and PDF. They are cached in browser `sessionStorage` for the current quote and are not sent to a database.

## Development

```bash
npm install
npm run dev
```

The site ships with a default private password: `garfamatrimoni`

Set `WEDDING_ACCESS_PASSWORD` to override it in local/dev/prod.

Optional:

- `WEDDING_ACCESS_COOKIE_SECRET` to rotate or harden the signed access cookie independently from the password.

## Verification

```bash
npm run typecheck
npm run test
npm run lint
npm run build
```

## Deployment
Deploy as a standard Next.js app. No Supabase or database is required.

Domain: `wedding.garfagnanafoto.it`
