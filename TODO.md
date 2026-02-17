# TODO.md - v2 Upgrade Tracking

## Phase 1: Foundation & Branding
- [ ] Update Brand Colors (#719436, #4c4c4c) in Tailwind/CSS `// verify: check buttons/text colors`
- [ ] Remove "Booking" aside block `// verify: visual check`
- [ ] Remove Footer Links (Privacy/Terms) `// verify: visual check`
- [ ] Replace Header Logo `// verify: check header`

## Phase 2: Schema & i18n Data
- [ ] Update `AppConfigSchema` for i18n (copyByLocale, etc.) `// verify: typecheck`
- [ ] Update `DEFAULT_CONFIG` with default IT/EN content `// verify: typecheck`

## Phase 3: Routing & Middleware
- [ ] Move `src/app/page.tsx` to `src/app/[lang]/page.tsx` `// verify: build`
- [ ] Implement `src/middleware.ts` for locale redirection `// verify: curl localhost:3000 -> 307 to /it`
- [ ] Update Metadata for SEO (canonical, hreflang) `// verify: inspect HTML head`

## Phase 4: Gallery & Lightbox
- [ ] Install `yet-another-react-lightbox`
- [ ] Implement `Gallery` component with Grid + Lightbox `// verify: click open, swipe`
- [ ] Implement "Show All Photos" button behavior `// verify: opens full view`

## Phase 5: Admin Panel
- [ ] Refactor `ConfigEditor` for localized fields `// verify: edit EN title, save, check EN page`
- [ ] Implement Image Management (Upload/Reorder) `// verify: add image in admin, appears in gallery`

## Phase 6: Polish
- [ ] Implement Share Button (Web Share / Copy) `// verify: click share`
- [ ] Enable Smooth Scrolling `// verify: click anchor links`
- [ ] Full E2E Smoke Test `// verify: npm run test:e2e`
