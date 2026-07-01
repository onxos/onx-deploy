# OCMBR-002 — Implemented IUs

**Document:** EV-CODE_OCMBR-002_20260701_implemented-ius.md
**Date:** 2026-07-01
**Branch:** ocmbr/foundation-p0
**Authority:** Founder / Program Director

---

## Foundation P0 IUs Implemented

| IU-ID | Description | Schema File | Tables Created | Status |
|---|---|---|---|---|
| FOUND-IU-01 | Branch / Brand Foundation | `src/server/db/schema/org-foundation.ts` | `onx_brand`, `onx_branch` | COMPLETE |
| FOUND-IU-02 | Tenant Foundation | `src/server/db/schema/tenant-foundation.ts` | `onx_tenant`, `onx_tenant_brand`, `onx_tenant_config`, `onx_tenant_invite` | COMPLETE |
| FOUND-IU-03 | Branch-level RBAC Extension | `src/server/db/schema/branch-rbac-foundation.ts` | `onx_user_branch_role`, `onx_user_tenant_membership`, `onx_branch_role_permission` | COMPLETE |
| FOUND-IU-04 | Event Outbox + Job Queue | `src/server/db/schema/intelligence-foundation.ts` | `onx_event_outbox`, `onx_job_queue` | COMPLETE |
| FOUND-IU-05 | Domain Audit Trail Event Stream | `src/server/db/schema/audit-foundation.ts` | `onx_domain_audit_event`, `onx_audit_retention_policy` | COMPLETE |

## Tables Created: 13

| Table | Domain | Purpose |
|---|---|---|
| `onx_brand` | D15 | Top-level brand entity |
| `onx_branch` | D15 | Operational location within a brand |
| `onx_tenant` | D15 | Top-level SaaS tenant / legal entity |
| `onx_tenant_brand` | D15 | Link: tenant owns brands |
| `onx_tenant_config` | D15 | Per-tenant configuration overrides |
| `onx_tenant_invite` | D15 | Invitation tokens for tenant onboarding |
| `onx_user_branch_role` | D15 | Scoped role assignment per user per branch |
| `onx_user_tenant_membership` | D15 | User membership within a tenant |
| `onx_branch_role_permission` | D15 | Branch role → resource/action permission mapping |
| `onx_event_outbox` | D13 | Transactional outbox for domain events |
| `onx_job_queue` | D13 | Async background job execution queue |
| `onx_domain_audit_event` | D13/D12 | Immutable audit log for all domain operations |
| `onx_audit_retention_policy` | D13/D12 | Configures retention duration per domain/tenant |

## Migration File

`drizzle/0003_foundation_p0.sql` — hand-crafted migration using `CREATE TABLE IF NOT EXISTS` guards, consistent with the approach established by `drizzle/0002_atlas_v5_trains_nz.sql`.

**Note:** `drizzle/meta/0002_snapshot.json` is pre-existing technical debt (empty/malformed from the hand-crafted migration workflow). This does not affect code quality, build, or test gates. Tracked as a separate item for future resolution.

## IU Type Scope

These are all IU-SCH (Schema) type IUs. The corresponding IU-API, IU-UI, and IU-TST units are NOT in scope for OCMBR-002. They belong to Wave 1 (D15) and Wave 2–3 (D13) builds.
