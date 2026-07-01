# OCMBR-005 Wave 2a — Implemented IUs

**Date:** 2026-07-01
**Branch:** ocmbr/wave2a-execution
**PR Target:** main

## Summary

Wave 2a delivers 9 domain systems × 4 IU types (SCH + SVC + API + UI) = **36 Implementation Units**

## IUs Delivered

### D02-S03 — Attendance & Timesheet (HR)
- D02-S03-IU-SCH: `src/server/db/schema/attendance-foundation.ts` → `onx_timesheet_entry`
- D02-S03-IU-SVC: `src/server/services/attendance.service.ts`
- D02-S03-IU-API: `src/server/api/routers/attendance.ts` → `attendanceRouter`
- D02-S03-IU-UI: `src/app/attendance/layout.tsx` + `src/app/attendance/page.tsx`

### D02-S04 — Leave Management (HR)
- D02-S04-IU-SCH: `src/server/db/schema/leave-foundation.ts` → `onx_leave_type`, `onx_leave_request`
- D02-S04-IU-SVC: `src/server/services/leave.service.ts`
- D02-S04-IU-API: `src/server/api/routers/leave.ts` → `leaveRouter`
- D02-S04-IU-UI: `src/app/leave/layout.tsx` + `src/app/leave/page.tsx`

### D03-S03 — Accounts Receivable (Finance)
- D03-S03-IU-SCH: `src/server/db/schema/ar-foundation.ts` → `onx_ar_invoice`, `onx_ar_payment`
- D03-S03-IU-SVC: `src/server/services/ar.service.ts`
- D03-S03-IU-API: `src/server/api/routers/ar.ts` → `arRouter`
- D03-S03-IU-UI: `src/app/ar/layout.tsx` + `src/app/ar/page.tsx`

### D04-S02 — Purchase Requisition (Procurement)
- D04-S02-IU-SCH: `src/server/db/schema/procurement-pr-foundation.ts` → `onx_purchase_requisition`, `onx_pr_line`
- D04-S02-IU-SVC: `src/server/services/procurement-pr.service.ts`
- D04-S02-IU-API: `src/server/api/routers/procurement-pr.ts` → `procurementPrRouter`
- D04-S02-IU-UI: `src/app/procurement-pr/layout.tsx` + `src/app/procurement-pr/page.tsx`

### D04-S09 — Approval Workflow Engine (Procurement)
- D04-S09-IU-SCH: `src/server/db/schema/approval-foundation.ts` → `onx_approval_workflow`, `onx_approval_record`
- D04-S09-IU-SVC: `src/server/services/approval.service.ts`
- D04-S09-IU-API: `src/server/api/routers/approval.ts` → `approvalRouter`
- D04-S09-IU-UI: `src/app/approval-workflows/layout.tsx` + `src/app/approval-workflows/page.tsx`

### D05-S04 — Stock Movement & Balance (Inventory)
- D05-S04-IU-SCH: `src/server/db/schema/stock-movement-foundation.ts` → `onx_stock_movement`, `onx_stock_balance`
- D05-S04-IU-SVC: `src/server/services/stock-movement.service.ts`
- D05-S04-IU-API: `src/server/api/routers/stock-movement.ts` → `stockMovementRouter`
- D05-S04-IU-UI: `src/app/stock-movements/layout.tsx` + `src/app/stock-movements/page.tsx`

### D06-S02 — Insurance Policy & Coverage Register (Insurance)
- D06-S02-IU-SCH: `src/server/db/schema/insurance-policy-foundation.ts` → `onx_insurance_policy`
- D06-S02-IU-SVC: `src/server/services/insurance-policy.service.ts`
- D06-S02-IU-API: `src/server/api/routers/insurance-policy.ts` → `insurancePolicyRouter`
- D06-S02-IU-UI: `src/app/insurance-policies/layout.tsx` + `src/app/insurance-policies/page.tsx`

### D09-S02 — Appointment Scheduling (Clinical)
- D09-S02-IU-SCH: `src/server/db/schema/appointment-foundation.ts` → `onx_appointment`
- D09-S02-IU-SVC: `src/server/services/appointment.service.ts`
- D09-S02-IU-API: `src/server/api/routers/appointment.ts` → `appointmentRouter`
- D09-S02-IU-UI: `src/app/appointments/layout.tsx` + `src/app/appointments/page.tsx`

### D09-S05 — Vaccination Record & Reminders (Clinical)
- D09-S05-IU-SCH: `src/server/db/schema/vaccination-foundation.ts` → `onx_vaccination_record`
- D09-S05-IU-SVC: `src/server/services/vaccination.service.ts`
- D09-S05-IU-API: `src/server/api/routers/vaccination.ts` → `vaccinationRouter`
- D09-S05-IU-UI: `src/app/vaccinations/layout.tsx` + `src/app/vaccinations/page.tsx`

## Infrastructure Updates

- `drizzle/0005_wave2a_systems.sql` — 14 new tables
- `drizzle/meta/_journal.json` — idx 5 entry
- `src/server/db/schema.ts` — barrel updated with 9 new schema files
- `src/lib/permissions.ts` — 14 new permission strings + role assignments
- `src/server/api/root.ts` — 9 new routers registered

## Test Evidence

72/72 scenarios PASS across 9 test scripts in `EVIDENCE/OCMBR-005/20260701/test/`

## Quality Gates

- `bun run lint` → 0 errors ✅
- `bun run build` → TypeScript clean, all 9 new routes compiled ✅
