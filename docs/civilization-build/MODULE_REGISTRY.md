# MODULE_REGISTRY.md

**Document ID:** ONX-CIV-BUILD-01 / Phase 1 Output B
**Authority:** Founder / Program Director
**Date:** 2026-07-01
**Repository:** onxos/onx-deploy
**Status:** REGISTRY LOCKED — All modules enumerated

---

## Registry Legend

| Column | Meaning |
|---|---|
| MOD-ID | Unique module identifier |
| Domain | Parent domain (D01–D15) |
| Module Name | Full module name |
| Build Status | `NOT_BUILT` / `PARTIAL` / `BUILT` |
| Wave | Planned implementation wave (W1–W5) |
| Priority | `P1` (critical path) / `P2` (core) / `P3` (extended) |
| DB Schema Required | `YES` / `NO` |
| API Required | `YES` / `NO` |
| UI Required | `YES` / `NO` |

---

## Domain 1 — Executive Governance (D01)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D01-M01 | Executive Command Dashboard | NOT_BUILT | W3 | P1 | NO | YES | YES |
| D01-M02 | Approval Authority Matrix | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D01-M03 | Board Resolution Register | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D01-M04 | Policy & Procedure Vault | PARTIAL | W2 | P1 | YES | YES | YES |
| D01-M05 | Strategic Objective Tracker (OKR/KPI) | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D01-M06 | Escalation & Decision Log | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D01-M07 | Founder Seal / Ratification Engine | PARTIAL | W1 | P1 | YES | YES | YES |

---

## Domain 2 — Human Resources (D02)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D02-M01 | Employee Master & Org Chart | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D02-M02 | Recruitment & Onboarding | NOT_BUILT | W2 | P2 | YES | YES | YES |
| D02-M03 | Attendance & Timesheet | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D02-M04 | Leave Management | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D02-M05 | Payroll Engine | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D02-M06 | Performance Appraisal | NOT_BUILT | W2 | P2 | YES | YES | YES |
| D02-M07 | Training & Competency Register | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D02-M08 | Disciplinary & Grievance | NOT_BUILT | W3 | P3 | YES | YES | YES |
| D02-M09 | Employee Self-Service Portal | NOT_BUILT | W3 | P2 | NO | YES | YES |
| D02-M10 | Offboarding & Exit Management | NOT_BUILT | W4 | P3 | YES | YES | YES |

---

## Domain 3 — Finance & Accounting (D03)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D03-M01 | Chart of Accounts Manager | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D03-M02 | General Ledger | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D03-M03 | Accounts Receivable | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D03-M04 | Accounts Payable | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D03-M05 | Journal Entries & Adjustments | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D03-M06 | Bank Reconciliation | NOT_BUILT | W2 | P2 | YES | YES | YES |
| D03-M07 | Budget Planning & Variance | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D03-M08 | Cash Flow Forecasting | NOT_BUILT | W3 | P2 | NO | YES | YES |
| D03-M09 | Financial Period Close | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D03-M10 | Tax & VAT Computation | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D03-M11 | Multi-currency Support | NOT_BUILT | W3 | P2 | YES | YES | NO |
| D03-M12 | Financial Statements | NOT_BUILT | W3 | P1 | NO | YES | YES |

---

## Domain 4 — Procurement (D04)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D04-M01 | Vendor Master & Qualification | PARTIAL | W1 | P1 | YES | YES | YES |
| D04-M02 | Purchase Requisition | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D04-M03 | RFQ & Bid Management | NOT_BUILT | W2 | P2 | YES | YES | YES |
| D04-M04 | Purchase Order Management | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D04-M05 | Goods Receipt Note | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D04-M06 | Invoice Matching (3-way) | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D04-M07 | Contract Management | NOT_BUILT | W2 | P2 | YES | YES | YES |
| D04-M08 | Vendor Performance Scorecard | NOT_BUILT | W3 | P2 | NO | YES | YES |
| D04-M09 | Procurement Approval Workflow | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D04-M10 | Preferred Supplier List | NOT_BUILT | W3 | P3 | YES | YES | YES |

---

## Domain 5 — Inventory & Warehouse (D05)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D05-M01 | Item Master & Catalogue | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D05-M02 | Multi-warehouse Stock | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D05-M03 | Pharmacy Stock Module | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D05-M04 | Stock In / Out / Transfer | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D05-M05 | Reorder Point & Auto-PR Trigger | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D05-M06 | Batch / Lot / Serial Tracking | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D05-M07 | Expiry Date Management | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D05-M08 | Stock Valuation (FIFO/WA) | NOT_BUILT | W2 | P2 | NO | YES | YES |
| D05-M09 | Physical Inventory Count | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D05-M10 | Supplier Return Management | NOT_BUILT | W3 | P3 | YES | YES | YES |

---

## Domain 6 — Insurance & Claims (D06)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D06-M01 | Insurance Company Master | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D06-M02 | Policy & Coverage Register | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D06-M03 | Pre-Authorization Request | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D06-M04 | Claim Submission Engine | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D06-M05 | Claim Status Tracker | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D06-M06 | Rejection & Resubmission Workflow | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D06-M07 | Co-pay & Deductible Calculation | NOT_BUILT | W2 | P1 | NO | YES | YES |
| D06-M08 | Insurance Reconciliation | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D06-M09 | Authority Compliance Tools | NOT_BUILT | W3 | P2 | YES | YES | YES |

---

## Domain 7 — Loyalty, Membership & CRM (D07)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D07-M01 | Pet Owner Master (CRM) | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D07-M02 | Pet Profile & Medical Summary | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D07-M03 | Membership Tiers & Benefits | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D07-M04 | Points Accumulation & Redemption | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D07-M05 | Campaign & Promotion Manager | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D07-M06 | Communication Hub (SMS/Email/WA) | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D07-M07 | Customer Satisfaction & NPS | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D07-M08 | Referral Programme | NOT_BUILT | W4 | P3 | YES | YES | YES |
| D07-M09 | Lifetime Value Dashboard | NOT_BUILT | W4 | P3 | NO | YES | YES |

---

## Domain 8 — POS, Retail & E-Commerce (D08)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D08-M01 | POS Terminal | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D08-M02 | Service & Product Catalogue | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D08-M03 | Discount & Coupon Engine | NOT_BUILT | W2 | P2 | YES | YES | YES |
| D08-M04 | Receipt & Invoice Generation | NOT_BUILT | W1 | P1 | NO | YES | YES |
| D08-M05 | Daily Cash Reconciliation | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D08-M06 | Online Store / E-Commerce | NOT_BUILT | W4 | P2 | YES | YES | YES |
| D08-M07 | Order Management & Fulfilment | NOT_BUILT | W4 | P2 | YES | YES | YES |
| D08-M08 | Gift Cards & Vouchers | NOT_BUILT | W4 | P3 | YES | YES | YES |
| D08-M09 | Shift Management & Till Close | NOT_BUILT | W2 | P1 | YES | YES | YES |

---

## Domain 9 — Clinical Operations (D09)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D09-M01 | Patient (Pet) Registration & Medical Record | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D09-M02 | Appointment Scheduling & Waitlist | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D09-M03 | Consultation Workflow (SOAP Notes) | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D09-M04 | Diagnosis & Treatment Plan | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D09-M05 | Vaccination Record & Reminders | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D09-M06 | Prescription & Dispensing | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D09-M07 | Surgical Theatre Management | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D09-M08 | Hospitalisation / In-patient | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D09-M09 | Referral Management | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D09-M10 | Clinical Outcome Tracking | NOT_BUILT | W4 | P2 | YES | YES | YES |
| D09-M11 | Consent Forms & Legal Documents | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D09-M12 | Clinical Audit Trail | PARTIAL | W1 | P1 | YES | YES | NO |

---

## Domain 10 — Laboratory & Imaging (D10)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D10-M01 | Lab Test Request & Result Entry | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D10-M02 | In-house Analyser Integration Hooks | NOT_BUILT | W4 | P2 | NO | YES | NO |
| D10-M03 | External Lab Referral & Import | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D10-M04 | Lab Result History & Trends | NOT_BUILT | W3 | P2 | NO | YES | YES |
| D10-M05 | Imaging Request Module | NOT_BUILT | W2 | P2 | YES | YES | YES |
| D10-M06 | DICOM Viewer Hooks (PACS) | NOT_BUILT | W5 | P3 | NO | YES | NO |
| D10-M07 | Radiology Report Module | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D10-M08 | Critical Value Alert Engine | NOT_BUILT | W3 | P1 | NO | YES | YES |
| D10-M09 | Diagnostic Archive & Search | NOT_BUILT | W4 | P2 | NO | YES | YES |
| D10-M10 | QC / Calibration Log | NOT_BUILT | W4 | P3 | YES | YES | YES |

---

## Domain 11 — TeleVet, Mobile Clinic & Emergency (D11)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D11-M01 | TeleVet Booking & Video Session | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D11-M02 | TeleVet Medical Record Integration | NOT_BUILT | W3 | P2 | NO | YES | YES |
| D11-M03 | Mobile Clinic Schedule & Route | NOT_BUILT | W4 | P2 | YES | YES | YES |
| D11-M04 | Field Visit Record | NOT_BUILT | W4 | P2 | YES | YES | YES |
| D11-M05 | Emergency Case Intake & Triage | NOT_BUILT | W3 | P1 | YES | YES | YES |
| D11-M06 | Emergency Resource Dispatch | NOT_BUILT | W4 | P2 | YES | YES | YES |
| D11-M07 | On-call Staff Management | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D11-M08 | 24/7 Availability Dashboard | NOT_BUILT | W3 | P2 | NO | YES | YES |

---

## Domain 12 — Compliance, Audit & Risk (D12)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D12-M01 | Regulatory Register | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D12-M02 | Licence & Certificate Tracker | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D12-M03 | Internal Audit Programme | PARTIAL | W2 | P1 | YES | YES | YES |
| D12-M04 | Audit Finding & CAPA | PARTIAL | W2 | P1 | YES | YES | YES |
| D12-M05 | Incident Reporting & RCA | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D12-M06 | Risk Register & Risk Matrix | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D12-M07 | Policy Acknowledgement Tracker | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D12-M08 | Compliance Dashboard | PARTIAL | W2 | P1 | NO | YES | YES |
| D12-M09 | Document Control & Versioning | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D12-M10 | Data Privacy / GDPR Tools | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D12-M11 | Corrective Action Plan Tracker | NOT_BUILT | W3 | P2 | YES | YES | YES |

---

## Domain 13 — Intelligence & Automation Hooks (D13)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D13-M01 | Event Outbox | NOT_BUILT | W2 | P1 | YES | YES | NO |
| D13-M02 | Audit Trail Event Stream | PARTIAL | W2 | P1 | YES | YES | NO |
| D13-M03 | Module Telemetry Collector | NOT_BUILT | W3 | P2 | YES | YES | NO |
| D13-M04 | AI Decision Placeholder Endpoints | NOT_BUILT | W3 | P2 | NO | YES | NO |
| D13-M05 | Recommendation Engine Stub | NOT_BUILT | W3 | P2 | NO | YES | YES |
| D13-M06 | Integration Contract Stubs | NOT_BUILT | W2 | P2 | NO | YES | NO |
| D13-M07 | Webhook Dispatch Layer | NOT_BUILT | W3 | P2 | YES | YES | NO |
| D13-M08 | Background Job Queue | NOT_BUILT | W2 | P1 | YES | YES | NO |

---

## Domain 14 — Reporting, MIS & Dashboards (D14)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D14-M01 | CEO Executive Dashboard | NOT_BUILT | W3 | P1 | NO | YES | YES |
| D14-M02 | COO Operations Dashboard | NOT_BUILT | W3 | P1 | NO | YES | YES |
| D14-M03 | CFO Finance Dashboard | NOT_BUILT | W3 | P1 | NO | YES | YES |
| D14-M04 | HR Manager Dashboard | NOT_BUILT | W3 | P2 | NO | YES | YES |
| D14-M05 | Clinical Director Dashboard | NOT_BUILT | W3 | P1 | NO | YES | YES |
| D14-M06 | Inventory & Procurement Dashboard | NOT_BUILT | W3 | P2 | NO | YES | YES |
| D14-M07 | Customer / Loyalty Dashboard | NOT_BUILT | W3 | P2 | NO | YES | YES |
| D14-M08 | Compliance & Audit Dashboard | PARTIAL | W2 | P1 | NO | YES | YES |
| D14-M09 | Custom Report Builder | NOT_BUILT | W4 | P2 | NO | YES | YES |
| D14-M10 | Scheduled Report Distribution | NOT_BUILT | W5 | P3 | YES | YES | YES |

---

## Domain 15 — Multi-Branch, Multi-Brand & Multi-Tenant (D15)

| MOD-ID | Module Name | Build Status | Wave | Priority | DB Schema | API | UI |
|---|---|---|---|---|---|---|---|
| D15-M01 | Branch / Location Master | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D15-M02 | Brand Master | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D15-M03 | Tenant Master | NOT_BUILT | W2 | P2 | YES | YES | YES |
| D15-M04 | Branch-level Permission Scoping | NOT_BUILT | W1 | P1 | YES | YES | YES |
| D15-M05 | Consolidated vs Branch Reporting | NOT_BUILT | W3 | P2 | NO | YES | YES |
| D15-M06 | Inter-branch Transfer Management | NOT_BUILT | W2 | P1 | YES | YES | YES |
| D15-M07 | Central vs Local Config Override | NOT_BUILT | W2 | P2 | YES | YES | YES |
| D15-M08 | Multi-currency Readiness | NOT_BUILT | W3 | P2 | YES | YES | YES |
| D15-M09 | Multi-language Readiness Flags | NOT_BUILT | W4 | P3 | YES | YES | NO |
| D15-M10 | Tenant Onboarding Workflow | NOT_BUILT | W4 | P3 | YES | YES | YES |

---

## Registry Summary

| Domain | Total Modules | NOT_BUILT | PARTIAL | BUILT |
|---|---|---|---|---|
| D01 — Executive Governance | 7 | 5 | 2 | 0 |
| D02 — HR | 10 | 10 | 0 | 0 |
| D03 — Finance | 12 | 12 | 0 | 0 |
| D04 — Procurement | 10 | 9 | 1 | 0 |
| D05 — Inventory | 10 | 10 | 0 | 0 |
| D06 — Insurance | 9 | 9 | 0 | 0 |
| D07 — Loyalty & CRM | 9 | 9 | 0 | 0 |
| D08 — POS & E-Commerce | 9 | 9 | 0 | 0 |
| D09 — Clinical Ops | 12 | 11 | 1 | 0 |
| D10 — Lab & Imaging | 10 | 10 | 0 | 0 |
| D11 — TeleVet & Emergency | 8 | 8 | 0 | 0 |
| D12 — Compliance & Audit | 11 | 7 | 4 | 0 |
| D13 — Intelligence Hooks | 8 | 7 | 1 | 0 |
| D14 — MIS & Dashboards | 10 | 9 | 1 | 0 |
| D15 — Multi-Branch | 10 | 10 | 0 | 0 |
| **TOTAL** | **145** | **135** | **10** | **0** |

**135 modules require full build. 10 modules require completion. 0 modules are fully built in the civilisation scope.**

---

## Wave Assignment Summary

| Wave | Description | Module Count | Priority Focus |
|---|---|---|---|
| W1 | Core Foundation (Masters, Auth extensions, Clinical core) | 38 | All P1 critical path |
| W2 | Operational Core (Finance, Procurement, Compliance, Workflows) | 42 | P1 + P2 |
| W3 | Operational Extension (Dashboards, Advanced Clinical, Intelligence) | 35 | P1 + P2 |
| W4 | Advanced Features (E-Commerce, Mobile, Referrals, Archive) | 20 | P2 + P3 |
| W5 | Final Polish (DICOM, Scheduled Reports, Multi-language) | 10 | P3 |

**Registry status: LOCKED for Phase 2 execution.**
