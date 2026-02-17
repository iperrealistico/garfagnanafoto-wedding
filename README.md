# Garfagnanafoto Wedding

Production-grade Next.js application for wedding service quotes and admin management.

## Tech Stack
- **Next.js 16 (App Router)**
- **Tailwind CSS**
- **Framer Motion** (Wizard animations)
- **Supabase** (Config persistence)
- **@react-pdf/renderer** (PDF generation)
- **Jose** (JWT session management)
- **Vitest** (Unit tests)

## Features
- **Landing Page**: Modern, Airbnb-like UI showcasing fixed packages and a custom quote wizard.
- **Custom Wizard**: Guided step-by-step experience to build a personalized wedding package.
- **Summary & Export**: Instantly see results with VAT breakdown, and export to PDF or Print.
- **Admin Dashboard**: Single-user password-protected area to manage:
  - Package prices and descriptions
  - Wizard questions and their pricing effects
  - Global settings (VAT, legal copy)

## Setup & Environment Variables

Copy `.env.example` to `.env.local` and fill in the following:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Auth
ADMIN_PASSWORD=your-secure-password
ADMIN_SESSION_SECRET=fh_U2WU2XXV2YT_g1Z-fAm-2bisP5nYij7ciT-8qhqR7Yjc4KfZqorTalYD7XoUS
```

### Database Schema
Create a table in Supabase called `app_config`:
- `key`: text (primary key)
- `value`: jsonb
- `updated_at`: timestamptz (default now())

On first run, the app will attempt to seed the default config if the table exists but is empty/missing our key.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
# Typecheck
npm run typecheck

# Unit Tests (Pricing Engine)
npm run test

# Build
npm run build
```

## Deployment
Deployed on Vercel. Ensure the environment variables are set in the Vercel dashboard.
Domain: `wedding.garfagnanafoto.it`
