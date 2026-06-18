# ONX Engineering Patch — Order #001-A
**Spec:** ONX-EPA-2026-001A | **Feature:** Option C+ Gate 5 Identity Protection  
**Total:** 32 files — 6 data modules, 8 routes, 14 components, 1 footer, 3 static dirs

---

## Phase 1 — Setup
Install required dependencies before any file creation.

- [ ] Install `react-markdown` and `remark-gfm`
  ```
  bun add react-markdown remark-gfm
  ```

---

## Phase 2 — Data Modules (`src/lib/`)
All components depend on these. Create first.

- [ ] `src/lib/constitution/principles.ts` — 7 ONX founding principles
- [ ] `src/lib/registry/titans.ts` — 5 Titan lineage entries
- [ ] `src/lib/memory/knowledge-data.ts` — knowledge categories + items
- [ ] `src/lib/gaps/gap-data.ts` — 13 gaps (7 closed, 6 roadmap)
- [ ] `src/lib/va-capabilities/capabilities.ts` — 25 VA capabilities (19 operational, 6 deferred)
- [ ] `src/lib/pulse/pulse-data.ts` — systems list, preservation score, SECH/community metrics

**Verify:** `npx tsc --noEmit` must pass before moving on.

---

## Phase 3 — Route Pages (`src/app/`)
One page per feature. All follow the same pattern.

- [ ] `src/app/knowledge/layout.tsx` — Knowledge Center layout
- [ ] `src/app/knowledge/page.tsx` — `/knowledge` route
- [ ] `src/app/constitution/page.tsx` — `/constitution` route
- [ ] `src/app/registry/page.tsx` — `/registry` route
- [ ] `src/app/memory/page.tsx` — `/memory` route
- [ ] `src/app/gaps/page.tsx` — `/gaps` route
- [ ] `src/app/va-capabilities/page.tsx` — `/va-capabilities` route
- [ ] `src/app/pulse/page.tsx` — `/pulse` route

---

## Phase 4 — Components (`src/components/`)
UI components consumed by the route pages above.

### SECH
- [ ] `src/components/sech/SentinelBadge.tsx` — live ethics check counter in footer

### Knowledge Center
- [ ] `src/components/knowledge/DocumentTree.tsx` — expandable category tree
- [ ] `src/components/knowledge/SearchBar.tsx` — knowledge search with live results
- [ ] `src/components/knowledge/MarkdownViewer.tsx` — fetches + renders `.md` files from `public/docs/`

### Constitution
- [ ] `src/components/constitution/PrinciplesList.tsx` — accordion list of 7 principles

### Registry
- [ ] `src/components/registry/TitanTree.tsx` — timeline tree of 5 Titans

### Memory
- [ ] `src/components/memory/KnowledgeGraph.tsx` — filterable knowledge category grid

### Gaps
- [ ] `src/components/gaps/GapCards.tsx` — filtered card grid (all / closed / roadmap)

### VA Capabilities
- [ ] `src/components/va-capabilities/CapabilityList.tsx` — operational + deferred capability lists

### Pulse
- [ ] `src/components/pulse/PulseDashboard.tsx` — 2×2 dashboard grid, auto-refreshes every 30s
- [ ] `src/components/pulse/SystemsStatus.tsx` — 25 systems health grid
- [ ] `src/components/pulse/PreservationScore.tsx` — preservation percentage bar
- [ ] `src/components/pulse/SechActivity.tsx` — ethics checks / memory / harmony metrics
- [ ] `src/components/pulse/CommunityMetrics.tsx` — users, clinics, conversations, contributions

---

## Phase 5 — Footer + Layout Wire-up
- [ ] Create `src/components/layout/Footer.tsx` with `SentinelBadge` embedded
- [ ] Add `<Footer />` to `src/app/layout.tsx` (before closing `</body>`)

---

## Phase 6 — Static Docs (`public/docs/`)
> **Status: SKIPPED** — source `.md` files path unknown. Wire up when available.

- [ ] Create `public/docs/sbps/` and copy SBP `.md` files
- [ ] Create `public/docs/programs/` and copy program `.md` files
- [ ] Create `public/docs/preservation/` and copy preservation `.md` files

> `MarkdownViewer` fetches from these paths at runtime. Pages render without them but doc viewer will show "Document not found."

---

## Verification Checklist
- [ ] `npx tsc --noEmit` — zero errors
- [ ] `bun run lint` — zero errors
- [ ] All 8 routes load in browser without crashing
- [ ] `SentinelBadge` renders on every page (via footer)
- [ ] `PulseDashboard` auto-refreshes (check at 30s intervals)

---

## Features Summary
| # | Route | Component | Status |
|---|-------|-----------|--------|
| 1 | `/knowledge` | DocumentTree + SearchBar | ⬜ |
| 2 | `/constitution` | PrinciplesList | ⬜ |
| 3 | `/registry` | TitanTree | ⬜ |
| 4 | `/memory` | KnowledgeGraph | ⬜ |
| 5 | `/gaps` | GapCards | ⬜ |
| 6 | `/va-capabilities` | CapabilityList | ⬜ |
| 7 | `/pulse` | PulseDashboard | ⬜ |
| 8 | global footer | SentinelBadge | ⬜ |
