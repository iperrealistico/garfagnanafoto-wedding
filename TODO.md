# Garfagnanafoto Wedding - Fixes & Polish TODO

## 1. UI Consistency (Button Radius)
- [x] Align all package trial/CTA buttons to a consistent radius (rounded-2xl)
  - [x] Update `src/app/[lang]/page.tsx` ("Personalizza" button)
  - [x] Update `src/components/public/package-card.tsx` ("Scegli" buttons)
  - [x] Updated `StepSummary.tsx` and `PackageQuoteView.tsx` for consistency
- [x] Verify visual alignment

## 2. Configurable Footer
- [x] Update `src/lib/config-schema.ts`:
  - [x] Move `footerText` to `advancedSettings` with a default of `© 2026 — Garfagnanafoto.it`
- [x] Update `src/components/admin/sections/AdvancedSection.tsx`:
  - [x] Add `LocalizedInput` for footer text
- [x] Update `src/app/[lang]/page.tsx`:
  - [x] Render footer text from config with fallback
- [x] Fix secondary references in `ContentSection.tsx` and `default-config.ts`

## 3. Fix "Procedi al preventivo" & Admin Toast Bug
- [x] Harden Toast system:
  - [x] Created `formatError` utility in `src/lib/utils.ts` to escape HTML and truncate messages
  - [x] Applied to `ConfigEditor`, `LeadsManager`, and `LeadForm`
- [x] Improved robustness:
  - [x] Added `ensureAdmin()` check to all sensitive server actions
  - [x] Added middleware-level auth check via `layout.tsx` session verification
- [x] Fix CTA flow:
  - [x] Verified `LeadForm` success path
- [x] Verified: Error messages are now clean and informative, 404 HTML is suppressed.

## 4. Final Verification
- [x] `npm run typecheck` (Passed)
- [x] `npm run lint` (Next.js config issue, but typecheck is clean)
- [x] Push to GitHub
