# OCMBR-002 — Changed Files

**Document:** EV-CODE_OCMBR-002_20260701_changed-files.md
**Date:** 2026-07-01
**Branch:** ocmbr/foundation-p0

---

## New Files Created

| File | Type | Purpose |
|---|---|---|
| `src/server/db/schema/org-foundation.ts` | Schema | FOUND-IU-01: `onx_brand` + `onx_branch` tables |
| `src/server/db/schema/tenant-foundation.ts` | Schema | FOUND-IU-02: `onx_tenant`, `onx_tenant_brand`, `onx_tenant_config`, `onx_tenant_invite` tables |
| `src/server/db/schema/branch-rbac-foundation.ts` | Schema | FOUND-IU-03: `onx_user_branch_role`, `onx_user_tenant_membership`, `onx_branch_role_permission` tables |
| `src/server/db/schema/intelligence-foundation.ts` | Schema | FOUND-IU-04: `onx_event_outbox`, `onx_job_queue` tables |
| `src/server/db/schema/audit-foundation.ts` | Schema | FOUND-IU-05: `onx_domain_audit_event`, `onx_audit_retention_policy` tables |
| `drizzle/0003_foundation_p0.sql` | Migration SQL | Foundation P0 migration — 13 tables, `IF NOT EXISTS` guards |
| `EVIDENCE/OCMBR-002/implemented_ius.md` | Evidence | IU implementation record |
| `EVIDENCE/OCMBR-002/changed_files.md` | Evidence | This file |
| `EVIDENCE/OCMBR-002/verification.md` | Evidence | Quality gate results |
| `EVIDENCE/OCMBR-002/remaining_p0_ius.md` | Evidence | P0 IUs remaining after this PR |
| `EVIDENCE/OCMBR-002/ocmbr_status_update.md` | Evidence | OCMBR status update |

## Modified Files

| File | Change |
|---|---|
| `src/server/db/schema.ts` | Added 5 new schema exports (`audit-foundation`, `branch-rbac-foundation`, `intelligence-foundation`, `org-foundation`, `tenant-foundation`) |
| `drizzle/meta/_journal.json` | Added entry for migration `0003_foundation_p0` at index 3 |

## Files NOT Changed

- No application source files (pages, components, routers) modified
- No existing schema files modified
- No auth or RBAC logic modified
- No test scripts modified

## OCMBR Scope Compliance

This PR contains ONLY Foundation P0 schema work. No Wave 1-5 modules were touched.
