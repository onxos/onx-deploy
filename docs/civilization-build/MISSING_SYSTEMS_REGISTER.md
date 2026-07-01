# MISSING_SYSTEMS_REGISTER.md

**Document ID:** ONX-CIV-BUILD-01 / Phase 1 Output D
**Authority:** Founder / Program Director
**Date:** 2026-07-01
**Repository:** onxos/onx-deploy
**Status:** REGISTER LOCKED — All gaps enumerated

---

## Purpose

This register is the definitive list of every system, schema, API, and UI workspace that is absent from `onxos/onx-deploy` as of 2026-07-01 and must be built to achieve ONX Civilization Complete status.

It is the direct input to Phase 2 (Module Architecture Register) and Phase 3 (Foundation Data Model Expansion).

---

## 1. Missing Database Schemas

The following DB schema files do not exist in `src/server/db/schema/` and must be created in Phase 3:

| Schema File | Domain | Tables to Define |
|---|---|---|
| `hr.ts` | D02 | `onx_employee`, `onx_attendance`, `onx_leave_request`, `onx_payroll_run`, `onx_payroll_item`, `onx_appraisal`, `onx_training_record`, `onx_disciplinary_case` |
| `finance.ts` | D03 | `onx_account`, `onx_journal_entry`, `onx_journal_line`, `onx_ar_invoice`, `onx_ap_invoice`, `onx_bank_statement`, `onx_budget_line`, `onx_tax_rule`, `onx_currency` |
| `procurement.ts` | D04 | `onx_vendor`, `onx_purchase_request`, `onx_rfq`, `onx_purchase_order`, `onx_po_line`, `onx_grn`, `onx_procurement_contract` |
| `inventory.ts` | D05 | `onx_item`, `onx_warehouse`, `onx_stock_level`, `onx_stock_movement`, `onx_batch`, `onx_pharmacy_item`, `onx_stock_count` |
| `insurance.ts` | D06 | `onx_insurance_company`, `onx_insurance_policy`, `onx_preauth_request`, `onx_insurance_claim`, `onx_claim_line` |
| `crm.ts` | D07 | `onx_pet_owner`, `onx_pet`, `onx_membership_tier`, `onx_membership_enrollment`, `onx_loyalty_points`, `onx_campaign`, `onx_nps_response` |
| `pos.ts` | D08 | `onx_pos_transaction`, `onx_pos_line`, `onx_shift`, `onx_cash_drawer`, `onx_online_order`, `onx_gift_card` |
| `clinical.ts` | D09 | `onx_patient`, `onx_appointment`, `onx_consultation`, `onx_diagnosis`, `onx_treatment_plan`, `onx_vaccination`, `onx_prescription`, `onx_prescription_line`, `onx_hospitalisation`, `onx_clinical_consent` |
| `diagnostics.ts` | D10 | `onx_lab_request`, `onx_lab_result`, `onx_lab_result_line`, `onx_imaging_request`, `onx_imaging_result`, `onx_qc_log` |
| `televet.ts` | D11 | `onx_televet_session`, `onx_mobile_visit`, `onx_emergency_case`, `onx_oncall_schedule` |
| `compliance.ts` | D12 | `onx_regulatory_requirement`, `onx_licence`, `onx_audit_programme`, `onx_audit_finding`, `onx_capa`, `onx_incident`, `onx_risk_item`, `onx_document_version` |
| `intelligence.ts` | D13 | `onx_event_outbox`, `onx_job_queue`, `onx_webhook_delivery`, `onx_telemetry_event` |
| `reports.ts` | D14 | `onx_report_schedule`, `onx_report_snapshot` |
| `org.ts` | D15 | `onx_branch`, `onx_brand`, `onx_tenant`, `onx_branch_config`, `onx_inter_branch_transfer` |
| `exec.ts` | D01 | `onx_exec_policy`, `onx_exec_approval_rule`, `onx_exec_decision_log`, `onx_exec_objective` |

**Total missing schema files: 15**
**Total missing tables: ~90**

---

## 2. Missing tRPC Router Files

The following router files do not exist in `src/server/api/routers/` and must be created in Phase 4:

| Router File | Domain | Key Procedures |
|---|---|---|
| `hr.ts` | D02 | `listEmployees`, `createEmployee`, `recordAttendance`, `submitLeave`, `approveLeave`, `runPayroll`, `createAppraisal` |
| `finance.ts` | D03 | `listAccounts`, `createJournalEntry`, `createArInvoice`, `createApInvoice`, `reconcileBank`, `createBudget`, `getFinancialStatements` |
| `procurement.ts` | D04 | `listVendors`, `createPR`, `createRFQ`, `createPO`, `confirmGRN`, `matchInvoice`, `approveContract` |
| `inventory.ts` | D05 | `listItems`, `adjustStock`, `transferStock`, `recordGRN`, `checkReorderPoints`, `recordStockCount`, `getPharmacyStock` |
| `insurance.ts` | D06 | `listInsuranceCompanies`, `createPolicy`, `requestPreAuth`, `submitClaim`, `updateClaimStatus`, `reconcileInsurance` |
| `crm.ts` | D07 | `listOwners`, `createOwner`, `createPet`, `enrollMembership`, `addPoints`, `redeemPoints`, `createCampaign` |
| `pos.ts` | D08 | `openShift`, `processTransaction`, `applyDiscount`, `generateReceipt`, `closeShift`, `reconcileCash`, `createOnlineOrder` |
| `clinical.ts` | D09 | `registerPatient`, `scheduleAppointment`, `startConsultation`, `saveSoapNotes`, `createPrescription`, `recordVaccination`, `admitPatient` |
| `diagnostics.ts` | D10 | `createLabRequest`, `enterLabResult`, `createImagingRequest`, `saveImagingResult`, `flagCriticalValue`, `searchDiagnosticArchive` |
| `televet.ts` | D11 | `bookTeleVetSession`, `startVideoSession`, `scheduleFieldVisit`, `recordFieldVisit`, `triageEmergency`, `dispatchResource` |
| `compliance.ts` | D12 | `listRegulations`, `trackLicence`, `createAudit`, `recordFinding`, `createCAPA`, `reportIncident`, `updateRiskItem` |
| `intelligence.ts` | D13 | `publishEvent`, `enqueueJob`, `registerWebhook`, `getModuleTelemetry`, `getAiDecisionPlaceholder` |
| `reports.ts` | D14 | `getExecutiveDashboard`, `getFinanceDashboard`, `getHrDashboard`, `getClinicalDashboard`, `scheduleReport`, `exportReport` |
| `org.ts` | D15 | `listBranches`, `createBranch`, `listBrands`, `createTenant`, `setUserBranch`, `getBranchConfig`, `transferInterBranch` |
| `exec.ts` | D01 | `getExecDashboard`, `createApprovalRule`, `logDecision`, `createObjective`, `trackObjectiveProgress` |

**Total missing routers: 15**
**Total missing procedures: ~110**

---

## 3. Missing Frontend Route Directories

The following Next.js App Router directories do not exist in `src/app/` and must be created in Phase 5:

| Route Directory | Domain | Pages Required |
|---|---|---|
| `src/app/exec/` | D01 | dashboard, approvals, policies, objectives |
| `src/app/hr/` | D02 | employees, attendance, leave, payroll, appraisals, training |
| `src/app/finance/` | D03 | ledger, ar, ap, bank, budget, reports |
| `src/app/procurement/` | D04 | vendors, requisitions, orders, contracts |
| `src/app/inventory/` | D05 | items, stock, pharmacy, movements, counts |
| `src/app/insurance/` | D06 | companies, policies, pre-auth, claims |
| `src/app/crm/` | D07 | owners, pets, membership, campaigns, loyalty |
| `src/app/pos/` | D08 | terminal, catalogue, shifts, reconciliation, orders |
| `src/app/clinical/` | D09 | patients, appointments, consultations, vaccinations, prescriptions |
| `src/app/diagnostics/` | D10 | lab, imaging, results, archive |
| `src/app/televet/` | D11 | sessions, schedule |
| `src/app/emergency/` | D11 | triage, dispatch |
| `src/app/compliance/` | D12 | register, licences, audits, incidents, risk |
| `src/app/reports/` | D14 | executive, finance, hr, clinical, inventory, customer, compliance, custom |
| `src/app/org/` | D15 | branches, brands, tenants, config |

**Total missing route directories: 15**
**Total missing pages: ~80**

---

## 4. Missing Navigation Items

The following items must be added to the application navigation (sidebar/header) but are not currently present:

| Nav Item | Route | Domain |
|---|---|---|
| Executive Command | `/exec/dashboard` | D01 |
| Human Resources | `/hr/employees` | D02 |
| Finance | `/finance/ledger` | D03 |
| Procurement | `/procurement/vendors` | D04 |
| Inventory | `/inventory/items` | D05 |
| Insurance | `/insurance/claims` | D06 |
| CRM & Loyalty | `/crm/owners` | D07 |
| Point of Sale | `/pos/terminal` | D08 |
| Clinical | `/clinical/patients` | D09 |
| Diagnostics | `/diagnostics/lab` | D10 |
| TeleVet | `/televet/sessions` | D11 |
| Emergency | `/emergency/triage` | D11 |
| Compliance | `/compliance/register` | D12 |
| Reports & MIS | `/reports/executive` | D14 |
| Organisation | `/org/branches` | D15 |

---

## 5. Missing Workflow Definitions (Phase 6 Scope)

| Workflow ID | Name | Domain | Trigger |
|---|---|---|---|
| WF-01 | Leave Approval | D02 | Leave request submitted |
| WF-02 | Payroll Authorisation | D02 | Payroll run initiated |
| WF-03 | Purchase Request Approval | D04 | PR raised |
| WF-04 | Purchase Order Approval | D04 | PO created above threshold |
| WF-05 | Finance Period Close | D03 | Month-end triggered |
| WF-06 | Insurance Pre-Auth | D06 | Pre-auth request submitted |
| WF-07 | Insurance Claim Review | D06 | Claim submitted |
| WF-08 | Inventory Adjustment Auth | D05 | Manual stock adjustment |
| WF-09 | CAPA Resolution | D12 | Audit finding raised |
| WF-10 | Incident Escalation | D12 | Critical incident reported |
| WF-11 | Executive Decision Escalation | D01 | Escalation threshold met |
| WF-12 | New Employee Onboarding | D02 | Employee record created |

---

## 6. Missing Intelligence Contracts (Phase 7 Scope)

| Contract ID | Name | Source Domain | Consumer (Future) |
|---|---|---|---|
| IC-01 | Clinical Risk Score | D09 | ONX Intelligence |
| IC-02 | Inventory Demand Forecast | D05 | ONX Intelligence |
| IC-03 | Customer Churn Risk | D07 | ONX Intelligence |
| IC-04 | Insurance Denial Prediction | D06 | ONX Intelligence |
| IC-05 | Staff Attendance Anomaly | D02 | ONX Intelligence |
| IC-06 | Financial Anomaly Detection | D03 | ONX Intelligence |
| IC-07 | Clinical Outcome Pattern | D09 | ONX Intelligence |
| IC-08 | Diagnostic Alert Correlation | D10 | ONX Intelligence |

---

## 7. Missing Executive Dashboards (Phase 8 Scope)

| Dashboard ID | Title | Data Sources |
|---|---|---|
| DB-01 | CEO Dashboard | All domains — KPI summary |
| DB-02 | COO Operations Dashboard | D09, D11, D05, D04, D15 |
| DB-03 | CFO Finance Dashboard | D03, D08, D06, D04 |
| DB-04 | HR Manager Dashboard | D02 |
| DB-05 | Clinical Director Dashboard | D09, D10, D11 |
| DB-06 | Inventory & Procurement Dashboard | D05, D04 |
| DB-07 | Customer / Loyalty Dashboard | D07, D08 |
| DB-08 | Compliance & Audit Dashboard | D12 |

---

## 8. Gap Severity Classification

| Severity | Definition | Count |
|---|---|---|
| CRITICAL | Required for basic operational functionality (clinical, POS, auth extensions) | 38 modules |
| HIGH | Required for financial and compliance integrity | 45 modules |
| MEDIUM | Required for full operational coverage | 42 modules |
| LOW | Extended features and optimisations | 20 modules |
| **TOTAL** | | **145 modules** |

---

## 9. Foundation-Blocking Gaps

The following gaps must be resolved before ANY civilisation module can be built, as they provide shared infrastructure:

| Gap ID | Gap Description | Blocks |
|---|---|---|
| FOUND-01 | `onx_branch` table missing | All branch-scoped records across D02–D11 |
| FOUND-02 | `onx_tenant` table missing | Multi-tenancy FK on all tables |
| FOUND-03 | Branch-level RBAC missing | Role scoping for HR, Clinical, Finance staff |
| FOUND-04 | `onx_event_outbox` table missing | D13 intelligence hooks across all domains |
| FOUND-05 | Shared audit trail extension missing | D12 compliance needs domain-level audit events |

These 5 foundation gaps are Priority 0 and must be resolved in Phase 3 Wave 1 before any domain schema is created.

---

## 10. Register Summary

| Category | Count | Build Phase |
|---|---|---|
| Missing DB schema files | 15 | Phase 3 |
| Missing DB tables (approximate) | 90 | Phase 3 |
| Missing tRPC routers | 15 | Phase 4 |
| Missing tRPC procedures (approximate) | 110 | Phase 4 |
| Missing App Router directories | 15 | Phase 5 |
| Missing pages (approximate) | 80 | Phase 5 |
| Missing navigation items | 15 | Phase 5 |
| Missing workflows | 12 | Phase 6 |
| Missing intelligence contracts | 8 | Phase 7 |
| Missing executive dashboards | 8 | Phase 8 |
| Foundation-blocking gaps | 5 | Phase 3 / W1 (Priority 0) |

---

## Verdict

**Current ONX Civilization completion: ~7% (Platform Foundation only)**
**Required to reach 100%: Phases 2–10 of ONX-CIV-BUILD-01**

**Phase 1 is COMPLETE. FULL CIVILIZATION SCOPE LOCKED.**
**Phase 2 execution is authorised to begin.**
