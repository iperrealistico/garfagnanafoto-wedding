# Garfagnanafoto Wedding

Static-first Next.js application for the Garfagnanafoto wedding website, package pricing, custom quotes, and PDF/print output.

## Tech Stack
- **Next.js 16 (App Router)**
- **Tailwind CSS**
- **Framer Motion** (Wizard animations)
- **@react-pdf/renderer** (PDF generation)
- **Vitest** (Unit tests)

## Features
- **Landing Page**: Modern, Airbnb-like UI showcasing fixed packages and a custom quote wizard.
- **Custom Wizard**: Guided step-by-step experience to build a personalized wedding package.
- **Summary & Export**: Instantly see results with VAT breakdown, and export to PDF or Print.
- **Static Configuration**: All public content, pricing, legal copy, and gallery assets live in checked-in code.

## Configuration

The site no longer depends on Supabase or any runtime database.

The single source of truth for site content and pricing is:

- [`src/lib/default-config.ts`](/Users/leonardofiori/Documents/Antigravity/garfagnanafoto-wedding/src/lib/default-config.ts)
- [`src/lib/app-config.ts`](/Users/leonardofiori/Documents/Antigravity/garfagnanafoto-wedding/src/lib/app-config.ts)

Edit the config file directly to update package pricing, custom flow questions, legal copy, SEO text, and gallery image paths.

Lead details entered in the quote flow are used locally to personalize the quote and PDF. They are cached in browser `sessionStorage` for the current quote and are not sent to a database.

## Development

```bash
npm install
npm run dev
```

No environment variables are required for the core site, quote flow, or PDF generation.

## Verification

```bash
npm run typecheck
npm run test
npm run lint
npm run build
```

## Deployment
Deploy as a standard Next.js app. No Supabase or admin credentials are required.

Domain: `wedding.garfagnanafoto.it`
