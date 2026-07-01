# OCMBR-002 — Remaining P0 IUs

**Document:** EV-CODE_OCMBR-002_20260701_remaining-p0-ius.md
**Date:** 2026-07-01

---

## P0 IU Status After OCMBR-002

| IU-ID | Description | Status After This PR |
|---|---|---|
| FOUND-IU-01 | Branch / Brand schema (IU-SCH) | **COMPLETE** |
| FOUND-IU-02 | Tenant schema (IU-SCH) | **COMPLETE** |
| FOUND-IU-03 | Branch-level RBAC extension (IU-SCH) | **COMPLETE** |
| FOUND-IU-04 | Event outbox + job queue (IU-SCH) | **COMPLETE** |
| FOUND-IU-05 | Domain audit trail event stream (IU-SCH) | **COMPLETE** |

## P0 IUs Remaining

**None.** All 5 Foundation P0 IU-SCH (schema) units are COMPLETE.

## What Is NOT Yet Done (Wave 1 Scope)

The Foundation P0 items above are schema-only. The following are NOT in scope for OCMBR-002 and belong to their respective Wave assignments:

| IU-ID | Description | Wave | Status |
|---|---|---|---|
| D15-S01-IU-API | Branch API (org.ts router) | W1 | NOT_STARTED |
| D15-S01-IU-UI | Branch UI (`/org/branches`) | W1 | NOT_STARTED |
| D15-S01-IU-TST | Branch tests | W1 | NOT_STARTED |
| D15-S02-IU-API | Brand API | W1 | NOT_STARTED |
| D15-S02-IU-UI | Brand UI (`/org/brands`) | W1 | NOT_STARTED |
| D15-S02-IU-TST | Brand tests | W1 | NOT_STARTED |
| D15-S03-IU-API | Tenant API | W2 | NOT_STARTED |
| D15-S04-IU-API | Branch RBAC API | W1 | NOT_STARTED |
| D13-S01-IU-API | Event outbox processor | W2 | NOT_STARTED |
| D13-S08-IU-API | Job queue processor | W2 | NOT_STARTED |
| D13-S02-IU-API | Audit trail stream API | W2 | NOT_STARTED |

## Gate CG-01 Status

Per OCMBR Certification Gate CG-01 definition:
> "Gate opens when FOUND-IU-01..05 all COMPLETE."

All 5 Foundation IU-SCH are now COMPLETE. **CG-01 is OPEN for Founder review.**

Note: CG-01 requires Founder sign-off to be marked PASSED.
