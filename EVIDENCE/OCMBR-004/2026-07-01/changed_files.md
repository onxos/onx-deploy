# OCMBR-004 Changed Files

**Evidence Category**: EV-CODE  
**Date**: 2026-07-01

## Schema Files (9 new)

| File | Tables Created | IU-ID |
|------|----------------|-------|
| `src/server/db/schema/crm-foundation.ts` | `onx_client`, `onx_pet` | D07-S01-IU-SCH |
| `src/server/db/schema/hr-foundation.ts` | `onx_department`, `onx_employee` | D02-S01-IU-SCH |
| `src/server/db/schema/inventory-foundation.ts` | `onx_item_category`, `onx_item` | D05-S01-IU-SCH |
| `src/server/db/schema/procurement-foundation.ts` | `onx_vendor` | D04-S01-IU-SCH |
| `src/server/db/schema/insurance-foundation.ts` | `onx_insurance_company` | D06-S01-IU-SCH |
| `src/server/db/schema/finance-foundation.ts` | `onx_account` | D03-S01-IU-SCH |
| `src/server/db/schema/clinical-foundation.ts` | `onx_patient_visit` | D09-S01-IU-SCH |
| `src/server/db/schema/gl-foundation.ts` | `onx_gl_period`, `onx_gl_entry`, `onx_gl_entry_line` | D03-S02-IU-SCH |
| `src/server/db/schema/pos-foundation.ts` | `onx_pos_terminal`, `onx_pos_shift` | D08-S01-IU-SCH |

## Schema Barrel

- `src/server/db/schema.ts` — added exports for all 9 new schema files

## Migration

- `drizzle/0004_wave1_systems.sql` — 14 tables with IF NOT EXISTS guards
- `drizzle/meta/_journal.json` — entry idx 4 added

## Service Files (9 new)

| File | IU-ID |
|------|-------|
| `src/server/services/crm.service.ts` | D07-S01-IU-API |
| `src/server/services/hr.service.ts` | D02-S01-IU-API |
| `src/server/services/inventory.service.ts` | D05-S01-IU-API |
| `src/server/services/procurement.service.ts` | D04-S01-IU-API |
| `src/server/services/insurance.service.ts` | D06-S01-IU-API |
| `src/server/services/finance.service.ts` | D03-S01-IU-API |
| `src/server/services/clinical.service.ts` | D09-S01-IU-API |
| `src/server/services/gl.service.ts` | D03-S02-IU-API |
| `src/server/services/pos.service.ts` | D08-S01-IU-API |

## tRPC Routers (9 new)

| File | IU-ID |
|------|-------|
| `src/server/api/routers/crm.ts` | D07-S01-IU-API |
| `src/server/api/routers/hr.ts` | D02-S01-IU-API |
| `src/server/api/routers/inventory.ts` | D05-S01-IU-API |
| `src/server/api/routers/procurement.ts` | D04-S01-IU-API |
| `src/server/api/routers/insurance.ts` | D06-S01-IU-API |
| `src/server/api/routers/finance.ts` | D03-S01-IU-API |
| `src/server/api/routers/clinical.ts` | D09-S01-IU-API |
| `src/server/api/routers/gl.ts` | D03-S02-IU-API |
| `src/server/api/routers/pos.ts` | D08-S01-IU-API |

## Root Router + Permissions (2 modified)

- `src/server/api/root.ts` — +9 routers registered
- `src/lib/permissions.ts` — +16 permissions (crm/hr/inventory/procurement/insurance/finance/clinical/pos read+write)

## UI Pages (new — 20 files)

- `src/app/crm/` — layout, page, clients/page, pets/page
- `src/app/hr/` — layout, page, employees/page, departments/page
- `src/app/inventory/` — layout, page, items/page, categories/page
- `src/app/procurement/` — layout, vendors/page
- `src/app/insurance/` — layout, companies/page
- `src/app/finance/` — layout, accounts/page
- `src/app/clinical/` — layout, visits/page
- `src/app/gl/` — layout, entries/page, periods/page
- `src/app/pos/` — layout, terminals/page

## Test Scripts (9 new)

- `scripts/test-d07-s01.ts` — CRM tests
- `scripts/test-d02-s01.ts` — HR tests
- `scripts/test-d05-s01.ts` — Inventory tests
- `scripts/test-d04-s01.ts` — Procurement tests
- `scripts/test-d06-s01.ts` — Insurance tests
- `scripts/test-d03-s01.ts` — Finance tests
- `scripts/test-d09-s01.ts` — Clinical tests
- `scripts/test-d03-s02.ts` — GL tests
- `scripts/test-d08-s01.ts` — POS tests
