# ONX Engineering Patch — Order #001-A

**Spec:** ONX-EPA-2026-001A | **Feature:** Option C+ Gate 5 Identity Protection  
**Total:** 32 files — 6 data modules, 8 routes, 14 components, 1 footer, 3 static dirs

---

## Phase 1 — Setup

- [x] Install `react-markdown` and `remark-gfm`

---

## Phase 2 — Data Modules (`src/lib/`)

**Commit:** `71ff01c`

- [x] `src/lib/constitution/principles.ts` — 7 ONX founding principles
- [x] `src/lib/registry/titans.ts` — 5 Titan lineage entries
- [x] `src/lib/memory/knowledge-data.ts` — knowledge categories + items
- [x] `src/lib/gaps/gap-data.ts` — 13 gaps (7 closed, 6 roadmap)
- [x] `src/lib/va-capabilities/capabilities.ts` — 25 VA capabilities (19 operational, 6 deferred)
- [x] `src/lib/pulse/pulse-data.ts` — systems list, preservation score, SECH/community metrics

---

## Phase 3 — Route Pages (`src/app/`)

**Commit:** `6020935`

- [x] `src/app/knowledge/layout.tsx` — Knowledge Center layout
- [x] `src/app/knowledge/page.tsx` — `/knowledge` route
- [x] `src/app/constitution/page.tsx` — `/constitution` route
- [x] `src/app/registry/page.tsx` — `/registry` route
- [x] `src/app/memory/page.tsx` — `/memory` route
- [x] `src/app/gaps/page.tsx` — `/gaps` route
- [x] `src/app/va-capabilities/page.tsx` — `/va-capabilities` route
- [x] `src/app/pulse/page.tsx` — `/pulse` route

---

## Phase 4 — Components (`src/components/`)

**Commit:** `fefdc8f`

- [x] `src/components/sech/SentinelBadge.tsx` — live ethics check counter in footer
- [x] `src/components/knowledge/DocumentTree.tsx` — expandable category tree
- [x] `src/components/knowledge/SearchBar.tsx` — knowledge search with live results
- [x] `src/components/knowledge/MarkdownViewer.tsx` — fetches + renders `.md` files from `public/docs/`
- [x] `src/components/constitution/PrinciplesList.tsx` — accordion list of 7 principles
- [x] `src/components/registry/TitanTree.tsx` — timeline tree of 5 Titans
- [x] `src/components/memory/KnowledgeGraph.tsx` — filterable knowledge category grid
- [x] `src/components/gaps/GapCards.tsx` — filtered card grid (all / closed / roadmap)
- [x] `src/components/va-capabilities/CapabilityList.tsx` — operational + deferred capability lists
- [x] `src/components/pulse/PulseDashboard.tsx` — 2×2 dashboard grid, auto-refreshes every 30s
- [x] `src/components/pulse/SystemsStatus.tsx` — 25 systems health grid
- [x] `src/components/pulse/PreservationScore.tsx` — preservation percentage bar
- [x] `src/components/pulse/SechActivity.tsx` — ethics checks / memory / harmony metrics
- [x] `src/components/pulse/CommunityMetrics.tsx` — users, clinics, conversations, contributions

---

## Phase 5 — Footer + Layout Wire-up

**Commit:** `e490184`

- [x] Create `src/components/layout/Footer.tsx` with `SentinelBadge` embedded
- [x] Add `<Footer />` to `src/app/layout.tsx`
- [x] Force light theme (removed dark media query, `colorScheme: "light"` on `<html>`)
- [x] Update `src/app/page.tsx` — ONX home page with all 7 route cards

---

## Phase 6 — Static Docs (`public/docs/`)

> **Status: BLOCKED** — source `.md` file path unknown. Provide path to ONX Documentation repo to unblock.

- [ ] Create `public/docs/sbps/` and copy SBP `.md` files
- [ ] Create `public/docs/programs/` and copy program `.md` files
- [ ] Create `public/docs/preservation/` and copy preservation `.md` files

> `MarkdownViewer` fetches from these paths at runtime. All pages render fine without them — doc viewer shows "Document not found" until files are present.

---

## Verification

- [x] `tsc --noEmit` — 0 errors
- [x] `bun run lint` — 0 errors
- [ ] All 8 routes load in browser without crashing
- [ ] `SentinelBadge` renders on every page (via footer)
- [ ] `PulseDashboard` auto-refreshes (check at 30s intervals)

---

## Features Summary

| #   | Route              | Component                | Status |
| --- | ------------------ | ------------------------ | ------ |
| 1   | `/knowledge`       | DocumentTree + SearchBar | ✅     |
| 2   | `/constitution`    | PrinciplesList           | ✅     |
| 3   | `/registry`        | TitanTree                | ✅     |
| 4   | `/memory`          | KnowledgeGraph           | ✅     |
| 5   | `/gaps`            | GapCards                 | ✅     |
| 6   | `/va-capabilities` | CapabilityList           | ✅     |
| 7   | `/pulse`           | PulseDashboard           | ✅     |
| 8   | global footer      | SentinelBadge            | ✅     |
