# Ticket TODO - Q/A Pricing + Additional Adjustments + "Su Misura" Layout

## 1) Analysis and mapping (no code edits)
- [x] Map config schema/types for questions, effects, and pricing fields.
- [x] Map config storage path (`app_config` in Supabase JSON).
- [x] Map custom wizard answer state and question rendering flow.
- [x] Map pricing engine calculation path and totals clamp behavior.
- [x] Map summary + PDF/print rendering paths.
- [x] Map current "Su Misura" rendering in homepage packages grid.

## 2) Data model and backward compatibility
- [x] Add `additionalAdjustments` model (`id`, `title`, `description?`, `priceDeltaNet`) for custom quote transport/snapshot.
- [x] Keep legacy `additionalRequests` support and parse/serialize compatibility.
- [x] Extend advanced settings with defaults for additional-adjustments feature labels/help and enable flag.
- [x] Ensure old configs parse with defaults and no migration breakage.

## 3) Pricing engine changes
- [x] Support negative `lineItems[].priceNet` in schema validation.
- [x] Apply `effectsYes.priceDeltaNet` and `effectsNo.priceDeltaNet`.
- [x] Carry applied question-level deltas into result breakdown.
- [x] Apply additional adjustments (positive/negative) to totals.
- [x] Clamp custom/fixed total net to minimum `0`.

## 4) Guest flow UI (custom quote)
- [x] Replace/extend additional requests step with multi-item editor.
- [x] Allow add/remove multiple items and negative amounts with helper copy.
- [x] Keep legacy notes textarea (compatibility) and include in output.
- [x] Ensure summary actions fail loudly with user-facing errors if payload cannot be built.

## 5) Admin UI updates
- [x] Question builder: allow negative values for yes/no deltas.
- [x] Question builder: add helper text (`Valori negativi = sconti`).
- [x] Advanced settings: allow enable/disable and labels/help for additional adjustments.

## 6) Summary + PDF/print output
- [x] Show additional adjustments in quote summary with negative values as discounts.
- [x] Show question-level discounts/deltas in breakdown.
- [x] Include additional adjustments in PDF payload and render in PDF notes/breakdown.

## 7) Packages layout fix
- [x] Keep standard packages inside grid only.
- [x] Move "Su Misura" to separate full-width CTA block aligned with grid container.
- [x] Ensure responsive behavior and keyboard-accessible CTA button.

## 8) Tests
- [x] Unit: negative answer delta scenario.
- [x] Unit: multiple additional adjustments (positive + negative) totals scenario.
- [x] Unit: URL/search params serialize + parse additional adjustments.
- [x] UI/e2e: verify "Su Misura" CTA is full-width and not a package grid item.

## 9) Verification gates
- [x] `pnpm lint` (or `npm run lint` if `pnpm` unavailable)
- [x] `pnpm typecheck` (or `npm run typecheck` if `pnpm` unavailable)
- [x] `pnpm test` (or `npm run test` if `pnpm` unavailable)
- [x] `pnpm build` (or `npm run build` if `pnpm` unavailable)
- [x] `pnpm test:e2e` (or `npm run test:e2e` if `pnpm` unavailable)

## 10) Delivery
- [x] Summarize changes by requested categories.
- [x] List exact local verification commands.
- [x] List DB migrations and file paths.
- [x] Commit with clear message.
