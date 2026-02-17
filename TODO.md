# Ticket TODO - Lead/PDF/Print Reliability

## 1) Full codebase analysis and root-cause confirmation
- [x] Trace lead state source(s): in-memory gate state, DB save action, no browser cache layer.
- [x] Trace quote snapshot source(s): pricing snapshot passed to `LeadGate`.
- [x] Trace PDF renderer path: `/quote/pdf` route -> `QuoteDocument`.
- [x] Trace print path: `/quote/print` currently separate layout (must be unified to PDF bytes).
- [x] Confirm `---` root cause:
  - [x] stale callback closure in `package-quote-view.tsx` and `step-summary.tsx`
  - [x] `email`/`phone` dropped in `/quote/pdf` route payload
- [x] Confirm modal close regression:
  - [x] ESC close handler removed from `lead-modal.tsx`

## 2) Payload standardization and flow fixes
- [x] Add normalized `LeadPayload` schema/type (`firstName`, `lastName`, `email`, `phone`, `weddingLocation`).
- [x] Add mappers between normalized payload and legacy DB `Lead` shape.
- [x] Route all PDF-generation params through normalized payload composer.
- [x] Ensure lead submit path uses normalized payload for action execution.

## 3) Modal close behavior
- [x] Ensure X closes modal deterministically.
- [x] Ensure ESC closes modal.
- [x] Ensure close clears pending action state in `LeadGate`.

## 4) PDF generation reliability
- [x] Fix `Conferma e Genera` first-submit path (no stale query strings).
- [x] Add deterministic loading/error handling around action execution.
- [x] Verify repeated actions reuse captured lead without resubmission.

## 5) Print unification
- [x] Replace separate print layout with PDF-print wrapper that embeds `/quote/pdf`.
- [x] Trigger print dialog on load (best effort) and provide one-click fallback button.
- [x] Ensure print action uses same PDF query/payload as download.

## 6) Tests
- [x] Unit: payload composer includes all lead fields.
- [x] Unit: lead cache retrieval + PDF URL generation includes lead fields.
- [x] Unit: action router maps print -> open PDF + print wrapper.
- [x] E2E (Playwright): download flow with lead -> PDF includes lead data.
- [x] E2E (Playwright): print flow with lead -> PDF route opened + print trigger path.
- [x] E2E (Playwright): modal closes via X.
- [x] E2E (Playwright): modal closes via ESC.
- [x] E2E (Playwright): "Conferma e Genera" triggers PDF generation.

## 7) Gates and delivery
- [x] `pnpm lint` (ran via `npm run lint`, `pnpm` not available in environment)
- [x] `pnpm typecheck` (ran via `npm run typecheck`, `pnpm` not available in environment)
- [x] `pnpm test` (ran via `npm run test`, `pnpm` not available in environment)
- [x] `pnpm build` (ran via `npm run build`, `pnpm` not available in environment)
- [x] `pnpm test:e2e` (ran via `npm run test:e2e`, `pnpm` not available in environment)
- [x] Commit
- [x] Push to GitHub
