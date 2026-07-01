# OCMBR Completion Formula

**Document ID:** OCMBR-FORMULA-001
**Authority:** Founder / Program Director
**Repository:** onxos/onx-deploy
**Established:** 2026-07-01
**Version:** 1.0.0
**Parent Register:** ONX_CIVILIZATION_MASTER_BUILD_REGISTER.md

---

## 1. Purpose

This document defines the authoritative, immutable formula for calculating ONX Civilization completion percentage and the exact conditions required to declare ONX Civilization COMPLETE.

This formula cannot be modified without a Major version change approved by the Founder.

---

## 2. Foundational Principle

**Completion is calculated from registered Implementation Units (IUs) only.**

- Repository file existence is NOT evidence of completion.
- Lines of code written are NOT evidence of completion.
- Verbal or written declarations are NOT evidence of completion.
- Only IUs in status `COMPLETE` (per OCMBR_STATUS_MODEL.md) count.

---

## 3. IU Inventory

### 3.1 Total Registered IUs

| Category | Count | Notes |
|---|---|---|
| Civilisation Domain IUs (D01–D15) | 580 | 145 systems × 4 IU types |
| Foundation IUs (Priority 0) | 5 | Included in the 580 total |
| **Total IUs Subject to Formula** | **580** | |

### 3.2 IU Breakdown by Type

| IU Type | Count | Notes |
|---|---|---|
| IU-SCH (Schema) | 116 | ~80% of systems require schema; some API/UI-only |
| IU-API (API) | 145 | All systems require an API layer |
| IU-UI (UI) | 131 | ~90% of systems require UI; some backend-only |
| IU-TST (Test) | 145 | All systems require test evidence |
| **Approximate Total** | **580** | Exact count locked in OCMBR Section 5 |

> Note: Some IUs are API-only or UI-only (e.g., D13 intelligence hooks have no UI). The exact per-system breakdown is recorded in MODULE_REGISTRY.md. The formula uses the total registered count of 580.

---

## 4. The Completion Formula

### 4.1 Civilisation Completion Percentage

$$
\text{CivilisationCompletion\%} = \frac{|\{IU : status = \text{COMPLETE}\}|}{580} \times 100
$$

In plain terms:

```
Civilisation Completion % = 
  (Count of IUs with status COMPLETE) ÷ 580 × 100
```

### 4.2 Domain Completion Percentage

$$
\text{DomainCompletion\%}_{Dn} = \frac{|\{IU \in D_n : status = \text{COMPLETE}\}|}{|IU_{Dn}|} \times 100
$$

Where $|IU_{Dn}|$ is the total number of IUs registered under domain $D_n$.

### 4.3 Wave Completion Percentage

$$
\text{WaveCompletion\%}_{Wk} = \frac{|\{IU \in W_k : status = \text{COMPLETE}\}|}{|IU_{Wk}|} \times 100
$$

---

## 5. Current Completion Baseline (2026-07-01)

| Metric | Value |
|---|---|
| Total IUs registered | 580 |
| IUs COMPLETE | 0 |
| IUs PARTIAL | 17 |
| IUs NOT_STARTED | 558 |
| IUs BLOCKED | 0 |
| **Civilisation Completion %** | **0.00%** |

> Note: The Platform Foundation Runtime (authentication, SECH, Titan Registry, etc.) was completed under EP-01 through EP-05. Those are NOT counted in the 580 IUs because they predate OCMBR and belong to the Foundation Runtime, not the Civilisation build.

---

## 6. Wave Completion Targets

| Wave | IU Count | Cumulative IUs | Cumulative % When Wave Complete |
|---|---|---|---|
| Foundation (P0) | 5 | 5 | 0.86% |
| W1 — Core Foundation | ~152 | ~157 | ~27.1% |
| W2 — Operational Core | ~168 | ~325 | ~56.0% |
| W3 — Operational Extension | ~140 | ~465 | ~80.2% |
| W4 — Advanced Features | ~80 | ~545 | ~93.9% |
| W5 — Final Polish | ~35 | ~580 | ~100% |

> Note: These are estimates. Exact IU counts per wave are defined in MODULE_REGISTRY.md. The formula always uses the registered count of 580 as the denominator.

---

## 7. Domain Weight Table

Each domain contributes to overall completion in proportion to its registered IU count.

| Domain | IU Count | Weight (%) |
|---|---|---|
| D01 — Executive Governance | 28 | 4.83% |
| D02 — Human Resources | 40 | 6.90% |
| D03 — Finance & Accounting | 48 | 8.28% |
| D04 — Procurement | 40 | 6.90% |
| D05 — Inventory & Warehouse | 40 | 6.90% |
| D06 — Insurance & Claims | 36 | 6.21% |
| D07 — Loyalty, Membership & CRM | 36 | 6.21% |
| D08 — POS, Retail & E-Commerce | 36 | 6.21% |
| D09 — Clinical Operations | 48 | 8.28% |
| D10 — Laboratory & Imaging | 40 | 6.90% |
| D11 — TeleVet, Mobile & Emergency | 32 | 5.52% |
| D12 — Compliance, Audit & Risk | 44 | 7.59% |
| D13 — Intelligence & Automation | 32 | 5.52% |
| D14 — Reporting, MIS & Dashboards | 40 | 6.90% |
| D15 — Multi-Branch, Multi-Tenant | 40 | 6.90% |
| **TOTAL** | **580** | **100%** |

---

## 8. Completion Milestones

| Milestone | % Threshold | Condition | Significance |
|---|---|---|---|
| OCMBR Established | 0% | OCMBR v1.0 committed and PR merged | Register is live |
| Foundation Complete | 0.86% | All 5 Foundation IUs COMPLETE | Wave 1 may proceed |
| Wave 1 Complete | ~27% | All W1 IUs COMPLETE + CG-02 PASSED | Operational cores unblocked |
| Wave 2 Complete | ~56% | All W2 IUs COMPLETE + CG-03 PASSED | Core operational platform viable |
| Wave 3 Complete | ~80% | All W3 IUs COMPLETE + CG-04 PASSED | Executive layer operational |
| Wave 4 Complete | ~94% | All W4 IUs COMPLETE + CG-05 PASSED | Advanced features available |
| Wave 5 Complete | 100% | All W5 IUs COMPLETE + CG-06 PASSED | Full feature coverage |
| Production Hardened | 100% | Phase 9 complete + CG-07 + CG-08 PASSED | Ready for certification |
| **ONX CIVILIZATION COMPLETE** | **100% + CG-09** | **All above + Final Certificate** | **Supreme milestone** |

---

## 9. Final Completion Conditions

ONX Civilization is declared COMPLETE if and only if ALL of the following are simultaneously true:

| Condition ID | Condition | Verifiable By |
|---|---|---|
| FC-01 | All 580 IUs have status = COMPLETE | OCMBR IU count |
| FC-02 | CG-01 (Foundation) PASSED | Evidence in /evidence/civ-gates/ |
| FC-03 | CG-02 (Wave 1) PASSED | Evidence in /evidence/civ-gates/ |
| FC-04 | CG-03 (Wave 2) PASSED | Evidence in /evidence/civ-gates/ |
| FC-05 | CG-04 (Wave 3) PASSED | Evidence in /evidence/civ-gates/ |
| FC-06 | CG-05 (Wave 4) PASSED | Evidence in /evidence/civ-gates/ |
| FC-07 | CG-06 (Wave 5) PASSED | Evidence in /evidence/civ-gates/ |
| FC-08 | CG-07 (Production Hardening) PASSED | Evidence in /evidence/civ-gates/ |
| FC-09 | CG-08 (Security & Compliance) PASSED | Evidence in /evidence/civ-gates/ |
| FC-10 | CG-09 (Final Certificate) SIGNED BY FOUNDER | Signed document in /evidence/civ-gates/ |
| FC-11 | Zero critical vulnerabilities in final security scan | Security scan artifact |
| FC-12 | `bun run build` exits 0 on production build | Build log evidence |
| FC-13 | All smoke tests pass against production target | Smoke test evidence |
| FC-14 | `ONX_PLATFORM_FULL_COMPLETION_CERTIFICATE.md` issued | Certificate file exists and signed |

**If any single condition is NOT met, ONX Civilization is NOT complete.**

---

## 10. What Does NOT Count Toward Completion

The following are explicitly excluded from the completion formula:

| Excluded Item | Reason |
|---|---|
| Platform Foundation Runtime (auth, SECH, Titan, etc.) | Pre-OCMBR; counted separately as Foundation Runtime |
| Files existing in the repository without IU evidence | File existence ≠ IU completion |
| PARTIAL status IUs | Partial work does not contribute to numerator |
| IN_PROGRESS or REVIEW status IUs | Not yet complete |
| Planning, design, or specification documents | Documentation is not implementation |
| Verbal or written completion claims without evidence | Not traceable |

---

## 11. Anti-Gaming Rules

The following rules prevent artificial inflation of completion percentage:

### Rule AG-01 — No Self-Certification
An executor may not mark their own IU as COMPLETE without merged PR + evidence. The OCMBR status is updated from the merge commit, not from declarations.

### Rule AG-02 — Evidence Timestamp Must Match Work
Evidence files must be committed on or after the date the work was done. Backdated evidence is void.

### Rule AG-03 — No Batch Closures
IUs must be closed one at a time with individual evidence. Batch COMPLETE declarations for multiple IUs without individual evidence are not accepted.

### Rule AG-04 — Test Evidence Must Execute
IU-TST evidence must be the actual output of running test scripts (e.g., `bun run scripts/test-xxx.ts`). Static "expected output" files are not accepted.

### Rule AG-05 — Build Must Be Clean
IU-API and IU-UI completion requires `bun run build` to produce zero TypeScript errors. Build warnings that were pre-existing (documented) are acceptable; new warnings introduced by the IU are not.

---

## 12. Formula Freeze

This formula is frozen at version 1.0.0. The denominator (580 IUs) may only change if:

1. The Founder approves a Major OCMBR version change
2. The change is documented in OCMBR v{next}.0.0
3. The new denominator is announced before any affected IUs are completed

Retroactive denominator changes are forbidden.

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-01 | Completion formula established. Denominator locked at 580 IUs. |
