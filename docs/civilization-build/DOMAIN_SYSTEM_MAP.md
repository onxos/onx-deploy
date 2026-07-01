# DOMAIN_SYSTEM_MAP.md

**Document ID:** ONX-CIV-BUILD-01 / Phase 1 Output C
**Authority:** Founder / Program Director
**Date:** 2026-07-01
**Repository:** onxos/onx-deploy
**Status:** DOMAIN MAP LOCKED

---

## Purpose

This document maps every ONX Civilisation domain to:
1. Its systems (modules)
2. Its data dependencies (which schemas it owns and which it consumes)
3. Its integration touch-points with other domains
4. Its planned route paths in the Next.js App Router
5. Its tRPC router assignment

---

## Map Format

Each domain section contains:
- **Systems** — owned modules
- **Owns schema** — DB tables this domain is responsible for
- **Consumes from** — domains whose schemas it reads
- **Integrates with** — runtime coupling at API / event level
- **Route prefix** — App Router path
- **tRPC router(s)** — existing or to-be-created router files

---

## D01 — Executive Governance

**Route prefix:** `/exec` (new)
**tRPC router:** `exec.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | Executive Dashboard, Approval Matrix, Board Resolutions, Policy Vault, OKR/KPI, Escalation Log, Founder Seal |
| Owns schema | `onx_exec_policy`, `onx_exec_approval_rule`, `onx_exec_decision_log`, `onx_exec_objective` |
| Consumes from | D02 (headcount), D03 (financial summary), D09 (clinical KPIs), D12 (compliance score) |
| Integrates with | D12 (escalation feed), D14 (dashboard data aggregation), D13 (event outbox) |
| Frontend pages | `/exec/dashboard`, `/exec/approvals`, `/exec/policies`, `/exec/objectives` |

---

## D02 — Human Resources

**Route prefix:** `/hr`
**tRPC router:** `hr.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | Employee Master, Recruitment, Attendance, Leave, Payroll, Appraisal, Training, Disciplinary, Self-Service, Exit |
| Owns schema | `onx_employee`, `onx_attendance`, `onx_leave_request`, `onx_payroll_run`, `onx_payroll_item`, `onx_appraisal`, `onx_training_record`, `onx_disciplinary_case` |
| Consumes from | D01 (org structure, approval rules), D15 (branch assignment) |
| Integrates with | D03 (payroll → payable), D01 (manager approvals), D12 (compliance checks), D14 (HR dashboard) |
| Frontend pages | `/hr/employees`, `/hr/attendance`, `/hr/leave`, `/hr/payroll`, `/hr/appraisals`, `/hr/training` |

---

## D03 — Finance & Accounting

**Route prefix:** `/finance`
**tRPC router:** `finance.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | CoA, GL, AR, AP, Journal Entries, Bank Recon, Budget, Cash Flow, Period Close, Tax/VAT, Multi-currency, Financial Statements |
| Owns schema | `onx_account`, `onx_journal_entry`, `onx_journal_line`, `onx_ar_invoice`, `onx_ap_invoice`, `onx_bank_statement`, `onx_budget_line`, `onx_tax_rule`, `onx_currency` |
| Consumes from | D04 (PO → AP), D08 (POS → AR), D06 (insurance claims → AR), D02 (payroll → GL) |
| Integrates with | D01 (financial dashboards), D04 (GRN/invoice matching), D14 (CFO dashboard), D13 (event hooks) |
| Frontend pages | `/finance/ledger`, `/finance/ar`, `/finance/ap`, `/finance/bank`, `/finance/budget`, `/finance/reports` |

---

## D04 — Procurement

**Route prefix:** `/procurement`
**tRPC router:** `procurement.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | Vendor Master, PR, RFQ, PO, GRN, Invoice Matching, Contracts, Vendor Scorecard, Approval Workflow, Preferred Suppliers |
| Owns schema | `onx_vendor`, `onx_purchase_request`, `onx_rfq`, `onx_purchase_order`, `onx_po_line`, `onx_grn`, `onx_procurement_contract` |
| Consumes from | D05 (stock levels for reorder), D03 (budget availability check), D01 (approval matrix) |
| Integrates with | D05 (GRN → inventory receipt), D03 (PO → AP payable), D01 (purchase approvals), D13 (event outbox) |
| Frontend pages | `/procurement/vendors`, `/procurement/requisitions`, `/procurement/orders`, `/procurement/contracts` |

---

## D05 — Inventory & Warehouse

**Route prefix:** `/inventory`
**tRPC router:** `inventory.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | Item Master, Multi-warehouse Stock, Pharmacy Stock, Stock Movements, Reorder, Batch Tracking, Expiry, Valuation, Count, Supplier Returns |
| Owns schema | `onx_item`, `onx_warehouse`, `onx_stock_level`, `onx_stock_movement`, `onx_batch`, `onx_pharmacy_item`, `onx_stock_count` |
| Consumes from | D04 (GRN triggers stock-in), D08 (POS triggers stock-out), D09 (prescription triggers dispensing), D15 (warehouse → branch mapping) |
| Integrates with | D04 (reorder → auto-PR), D03 (stock valuation → GL), D08 (POS catalogue sync), D14 (inventory dashboard) |
| Frontend pages | `/inventory/items`, `/inventory/stock`, `/inventory/pharmacy`, `/inventory/movements`, `/inventory/counts` |

---

## D06 — Insurance & Claims

**Route prefix:** `/insurance`
**tRPC router:** `insurance.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | Insurance Company Master, Policy Register, Pre-auth, Claim Submission, Claim Tracker, Rejection Workflow, Co-pay Calc, Insurance Recon, Authority Compliance |
| Owns schema | `onx_insurance_company`, `onx_insurance_policy`, `onx_preauth_request`, `onx_insurance_claim`, `onx_claim_line` |
| Consumes from | D09 (clinical service → claim generation), D07 (patient membership), D08 (POS invoice for claim) |
| Integrates with | D03 (claim settlement → AR), D07 (pet owner / patient link), D01 (claim approvals), D14 (insurance dashboard) |
| Frontend pages | `/insurance/companies`, `/insurance/policies`, `/insurance/pre-auth`, `/insurance/claims` |

---

## D07 — Loyalty, Membership & CRM

**Route prefix:** `/crm`
**tRPC router:** `crm.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | Pet Owner CRM, Pet Profile, Membership Tiers, Points Engine, Campaigns, Communication Hub, NPS/CSAT, Referral, LTV Dashboard |
| Owns schema | `onx_pet_owner`, `onx_pet`, `onx_membership_tier`, `onx_membership_enrollment`, `onx_loyalty_points`, `onx_campaign`, `onx_nps_response` |
| Consumes from | D09 (visit history for LTV), D08 (purchase history for points), D06 (insurance coverage for owner profile) |
| Integrates with | D08 (points at POS checkout), D09 (appointment reminders), D06 (patient identification), D14 (loyalty dashboard) |
| Frontend pages | `/crm/owners`, `/crm/pets`, `/crm/membership`, `/crm/campaigns`, `/crm/loyalty` |

---

## D08 — POS, Retail & E-Commerce

**Route prefix:** `/pos`
**tRPC router:** `pos.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | POS Terminal, Service/Product Catalogue, Discounts, Receipts, Daily Cash Recon, Online Store, Order Management, Gift Cards, Shift Management |
| Owns schema | `onx_pos_transaction`, `onx_pos_line`, `onx_shift`, `onx_cash_drawer`, `onx_online_order`, `onx_gift_card` |
| Consumes from | D05 (inventory for stock check), D07 (CRM for loyalty points), D09 (services catalogue), D06 (insurance billing split) |
| Integrates with | D05 (stock-out on sale), D03 (revenue → AR), D07 (points accumulation), D06 (insurance claim trigger) |
| Frontend pages | `/pos/terminal`, `/pos/catalogue`, `/pos/shifts`, `/pos/reconciliation`, `/pos/orders` |

---

## D09 — Clinical Operations

**Route prefix:** `/clinical`
**tRPC router:** `clinical.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | Patient Registration, Appointment Scheduling, SOAP Consultation, Diagnosis & Treatment, Vaccinations, Prescription, Theatre, Hospitalisation, Referral, Outcomes, Consent, Clinical Audit |
| Owns schema | `onx_patient`, `onx_appointment`, `onx_consultation`, `onx_diagnosis`, `onx_treatment_plan`, `onx_vaccination`, `onx_prescription`, `onx_prescription_line`, `onx_hospitalisation`, `onx_clinical_consent` |
| Consumes from | D07 (pet owner / pet profile), D05 (drug availability), D10 (lab/imaging results), D15 (branch/vet assignment) |
| Integrates with | D05 (prescription → dispensing), D06 (consultation → insurance claim), D08 (service → POS invoice), D10 (lab/imaging order), D14 (clinical dashboard) |
| Frontend pages | `/clinical/patients`, `/clinical/appointments`, `/clinical/consultations`, `/clinical/vaccinations`, `/clinical/prescriptions` |

---

## D10 — Laboratory & Imaging

**Route prefix:** `/diagnostics`
**tRPC router:** `diagnostics.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | Lab Test Request, In-house Analyser Hooks, External Lab Referral, Lab Result History, Imaging Request, DICOM Viewer Hooks, Radiology Report, Critical Value Alerts, Diagnostic Archive, QC Log |
| Owns schema | `onx_lab_request`, `onx_lab_result`, `onx_lab_result_line`, `onx_imaging_request`, `onx_imaging_result`, `onx_qc_log` |
| Consumes from | D09 (clinical order for test), D07 (patient reference) |
| Integrates with | D09 (results feed into consultation record), D06 (diagnostics → insurance claim), D14 (diagnostic reporting) |
| Frontend pages | `/diagnostics/lab`, `/diagnostics/imaging`, `/diagnostics/results`, `/diagnostics/archive` |

---

## D11 — TeleVet, Mobile Clinic & Emergency

**Route prefix:** `/televet` and `/emergency`
**tRPC router:** `televet.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | TeleVet Booking, TeleVet Record Integration, Mobile Clinic Schedule, Field Visit Record, Emergency Triage, Resource Dispatch, On-call Management, 24/7 Dashboard |
| Owns schema | `onx_televet_session`, `onx_mobile_visit`, `onx_emergency_case`, `onx_oncall_schedule` |
| Consumes from | D09 (patient record link), D07 (owner contact), D15 (branch/vehicle assignment) |
| Integrates with | D09 (visit → consultation record), D08 (teleVet service → POS invoice), D06 (emergency → insurance claim) |
| Frontend pages | `/televet/sessions`, `/televet/schedule`, `/emergency/triage`, `/emergency/dispatch` |

---

## D12 — Compliance, Audit & Risk

**Route prefix:** `/compliance`
**tRPC router:** `compliance.ts` (to create — extends existing `audit_review.ts`) |

| Dimension | Detail |
|---|---|
| Systems | Regulatory Register, Licence Tracker, Audit Programme, Audit Findings / CAPA, Incident Reporting, Risk Register, Policy Acknowledgement, Compliance Dashboard, Document Control, Data Privacy, CAPA Tracker |
| Owns schema | `onx_regulatory_requirement`, `onx_licence`, `onx_audit_programme`, `onx_audit_finding`, `onx_capa`, `onx_incident`, `onx_risk_item`, `onx_document_version` |
| Consumes from | All domains (audit scope), D01 (policy vault), D02 (staff licence), D09 (clinical incident) |
| Integrates with | D01 (escalation), D13 (incident event hooks), D14 (compliance dashboard) |
| Frontend pages | `/compliance/register`, `/compliance/licences`, `/compliance/audits`, `/compliance/incidents`, `/compliance/risk` |

---

## D13 — Intelligence & Automation Hooks

**Route prefix:** `/api/intelligence` (API only, no UI pages)
**tRPC router:** `intelligence.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | Event Outbox, Audit Trail Stream, Module Telemetry, AI Decision Stubs, Recommendation Stubs, Integration Contracts, Webhook Dispatch, Job Queue |
| Owns schema | `onx_event_outbox`, `onx_job_queue`, `onx_webhook_delivery`, `onx_telemetry_event` |
| Consumes from | All domains (event subscription) |
| Integrates with | All domains (event publication), external ONX Intelligence (future Atlas V6 consumer) |
| Frontend pages | None (backend infra only); monitoring visible via D14 dashboards |

---

## D14 — Reporting, MIS & Dashboards

**Route prefix:** `/reports`
**tRPC router:** `reports.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | CEO Dashboard, COO Dashboard, CFO Dashboard, HR Dashboard, Clinical Dashboard, Inventory/Procurement Dashboard, Customer/Loyalty Dashboard, Compliance Dashboard, Custom Report Builder, Scheduled Distribution |
| Owns schema | `onx_report_schedule`, `onx_report_snapshot` |
| Consumes from | All domains (aggregate read-only queries) |
| Integrates with | D13 (telemetry events for real-time metrics), D01 (executive access gating) |
| Frontend pages | `/reports/executive`, `/reports/finance`, `/reports/hr`, `/reports/clinical`, `/reports/inventory`, `/reports/customer`, `/reports/compliance`, `/reports/custom` |

---

## D15 — Multi-Branch, Multi-Brand & Multi-Tenant

**Route prefix:** `/org`
**tRPC router:** `org.ts` (to create)

| Dimension | Detail |
|---|---|
| Systems | Branch Master, Brand Master, Tenant Master, Branch Permission Scoping, Consolidated Reporting, Inter-branch Transfer, Config Override, Multi-currency, Multi-language, Tenant Onboarding |
| Owns schema | `onx_branch`, `onx_brand`, `onx_tenant`, `onx_branch_config`, `onx_inter_branch_transfer` |
| Consumes from | Foundation auth schema (user → branch assignment) |
| Integrates with | Every domain (branch_id FK on all clinical/financial records), D03 (multi-currency), D14 (consolidated vs branch reports) |
| Frontend pages | `/org/branches`, `/org/brands`, `/org/tenants`, `/org/config` |

---

## Cross-Domain Integration Matrix

| Source Domain | Target Domain | Integration Type | Key Event / Trigger |
|---|---|---|---|
| D04 Procurement | D05 Inventory | GRN → Stock Receipt | `grn.confirmed` |
| D05 Inventory | D04 Procurement | Reorder → Auto-PR | `stock.below_reorder` |
| D08 POS | D05 Inventory | Sale → Stock Out | `pos.transaction.completed` |
| D09 Clinical | D05 Inventory | Prescription → Dispensing | `prescription.approved` |
| D09 Clinical | D06 Insurance | Consultation → Claim | `consultation.closed` |
| D09 Clinical | D08 POS | Service → Invoice | `consultation.invoiced` |
| D09 Clinical | D10 Diagnostics | Consultation → Lab Order | `lab_order.created` |
| D10 Diagnostics | D09 Clinical | Result → Record Update | `lab_result.received` |
| D02 HR | D03 Finance | Payroll Run → AP | `payroll.run.completed` |
| D04 Procurement | D03 Finance | PO → AP Payable | `po.approved` |
| D08 POS | D03 Finance | Sale → AR Revenue | `pos.transaction.settled` |
| D06 Insurance | D03 Finance | Claim Settlement → AR | `claim.paid` |
| D07 CRM | D08 POS | Points at Checkout | `pos.checkout.loyalty_applied` |
| All Domains | D13 Intelligence | Domain Events | `*.event_outbox` |
| D13 Intelligence | D14 Reports | Telemetry Aggregation | `telemetry.interval` |

---

## Route Prefix Summary

| Domain | Route Prefix | Status |
|---|---|---|
| D01 Executive Governance | `/exec` | NEW |
| D02 HR | `/hr` | NEW |
| D03 Finance | `/finance` | NEW |
| D04 Procurement | `/procurement` | NEW |
| D05 Inventory | `/inventory` | NEW |
| D06 Insurance | `/insurance` | NEW |
| D07 Loyalty & CRM | `/crm` | NEW |
| D08 POS & E-Commerce | `/pos` | NEW |
| D09 Clinical Ops | `/clinical` | NEW |
| D10 Lab & Imaging | `/diagnostics` | NEW |
| D11 TeleVet & Emergency | `/televet`, `/emergency` | NEW |
| D12 Compliance & Audit | `/compliance` | EXTENDS existing |
| D13 Intelligence Hooks | `/api/intelligence` | NEW (API only) |
| D14 Reporting & MIS | `/reports` | NEW |
| D15 Multi-Branch | `/org` | NEW |

**Domain System Map status: LOCKED.**
