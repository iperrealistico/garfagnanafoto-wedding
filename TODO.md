# Garfagnanafoto Wedding - v3 Upgrade TODO

## 1. Foundation & Stability
- [x] Implement robust Env Adapter for Supabase/GitHub keys (Canonical names + Fallbacks)
- [x] Debug and fix "Failed to update config" (Better error reporting + Schema alignment)
- [x] Create Supabase `leads` table (SQL Migration)
- [x] Update `AppConfigSchema` for unlimited packages and custom GDPR notice
- [x] Verify: `npm run build` passes with new schema

## 2. Public UI Refinements
- [x] Fix Wizard "Indietro" button overlap (CSS/Flexbox fix)
- [x] Simplify Discount display: Remove blinking badge, replace with simple red line
- [x] Ensure "Additional Requests" text is passed to summary and documents
- [x] Verify: Responsive check on Wizard at 375px width

## 3. Lead Capture & Flows
- [x] Integrate Personal Data form (Location, Name, Phone, Email) into Custom Wizard
- [x] Implement Lead Capture Modal for Standard Packages (triggered by Print/PDF)
- [x] Show GDPR notice in flows (Configurable via Admin)
- [x] Implement `saveLead` server action
- [x] Verify: Custom flow doesn't show summary until persona data is submitted

## 4. Admin Management
- [x] Implement Package CRUD (Add/Delete/Reorder unlimited packages)
- [x] Create "Leads" tab in Admin with search, sort, pagination, and delete actions
- [x] Add "Advanced Settings" for GDPR notice configuration
- [x] Verify: CRUD operations reflect on landing page instantly

## 5. Unified Documentation (PDF/Print)
- [x] Unify Printer/PDF layout into a single Source of Truth
- [x] Add monochrome low-opacity logo watermark
- [x] Add timestamp (Europe/Rome) to documents
- [x] Ensure discount and additional requests are included
- [x] Implement auto-trigger for browser print
- [x] Verify: PDF and Print outputs are visually identical

## 6. Final Verification
- [x] Full build and typecheck
- [x] Smoke test all critical flows
- [x] Push to GitHub with clean commit messages
