# OCMBR-003 — Changed Files Register

## New Files Created

### Schema (OCMBR-002 — already merged)
- src/server/db/schema/org-foundation.ts (MODIFIED: fixed integer/serial types)
- src/server/db/schema/tenant-foundation.ts (MODIFIED: fixed integer/serial types)
- src/server/db/schema/branch-rbac-foundation.ts (MODIFIED: fixed integer/serial types)

### Service Layer
- src/server/services/org.service.ts — Brand + Branch CRUD
- src/server/services/tenant.service.ts — Tenant management + invites
- src/server/services/branch-rbac.service.ts — Branch RBAC management
- src/server/services/event-outbox.service.ts — Event outbox + job queue
- src/server/services/audit.service.ts — Append-only audit trail

### API Layer (tRPC Routers)
- src/server/api/routers/org.ts — orgRouter (brands + branches)
- src/server/api/routers/tenant.ts — tenantRouter (tenant lifecycle)
- src/server/api/routers/branch-rbac.ts — branchRbacRouter (RBAC management)

### Root Router (modified)
- src/server/api/root.ts — Added org, tenant, branchRbac

### Permission Layer (modified)
- src/lib/permissions.ts — Added 7 new permissions: org:read, org:write, tenant:read, tenant:write, rbac:manage, audit:read, events:read

### UI Layer
- src/app/org/layout.tsx — Admin/founder-gated layout
- src/app/org/page.tsx — Redirect to /org/brands
- src/app/org/brands/page.tsx — Brand list + create form
- src/app/org/branches/page.tsx — Branch list + create form

### Test Scripts
- scripts/test-found-01.ts — FOUND-IU-01 verification (15 scenarios)
- scripts/test-found-02.ts — FOUND-IU-02 verification (14 scenarios)
- scripts/test-found-03.ts — FOUND-IU-03 verification (14 scenarios)
- scripts/test-found-04.ts — FOUND-IU-04 verification (14 scenarios)
- scripts/test-found-05.ts — FOUND-IU-05 verification (14 scenarios)

## Total: 23 files created/modified
