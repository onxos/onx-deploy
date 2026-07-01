# OCMBR-005 Wave 2a — Deployment Evidence

**Date:** 2026-07-01
**Branch:** ocmbr/wave2a-execution

## Build Result

- `bun run build` — Compiled successfully in ~37s (Turbopack)
- TypeScript type check — PASSED
- All 9 new routes visible in build output:
  - `/attendance` ƒ (Dynamic)
  - `/leave` ƒ (Dynamic)
  - `/ar` ƒ (Dynamic)
  - `/procurement-pr` ƒ (Dynamic)
  - `/approval-workflows` ƒ (Dynamic)
  - `/stock-movements` ƒ (Dynamic)
  - `/insurance-policies` ƒ (Dynamic)
  - `/appointments` ƒ (Dynamic)
  - `/vaccinations` ƒ (Dynamic)

## Lint Result

- `bun run lint` (Biome 2.2.0) — 0 errors, 691 files checked

## Migration

- `drizzle/0005_wave2a_systems.sql` — 14 tables with IF NOT EXISTS guards
- All FK constraints reference existing Wave 1 tables
