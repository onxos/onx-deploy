# OCMBR Governance

**Document ID:** OCMBR-GOV-001
**Authority:** Founder / Program Director
**Repository:** onxos/onx-deploy
**Established:** 2026-07-01
**Version:** 1.0.0
**Parent Register:** ONX_CIVILIZATION_MASTER_BUILD_REGISTER.md

---

## 1. Purpose

This document defines the governance model for the ONX Civilization Master Build Register (OCMBR). It establishes authority, accountability, process, and enforcement for all civilisation build activity.

---

## 2. Authority Hierarchy

| Level | Role | Authority |
|---|---|---|
| L1 | Founder / Program Director | Supreme authority. Approves scope, signs Certification Gates, issues Final Certificate. |
| L2 | Executor (GitHub Agent / Developer) | Implements IUs per OCMBR, opens PRs, submits evidence. |
| L3 | OCMBR Register | Immutable record of scope and status. Cannot be overridden by L2. |

**Authority Rule:** No L2 action may contradict an L1 decision recorded in OCMBR. No executor may modify OCMBR scope without L1 approval.

---

## 3. OCMBR Change Control

### 3.1 What Requires L1 Approval (Founder)

| Change Type | Approval Required |
|---|---|
| Adding a new domain | YES |
| Adding a new system to an existing domain | YES |
| Removing a system | YES |
| Changing a Certification Gate condition | YES |
| Changing the Completion Formula | YES |
| Marking a Certification Gate as PASSED | YES |
| Issuing the Final Certificate | YES |
| Changing Immutable Execution Rules | YES |

### 3.2 What Executor May Do Without L1 Pre-Approval

| Action | Notes |
|---|---|
| Updating IU status from NOT_STARTED → IN_PROGRESS | Self-declared, no approval needed |
| Updating IU status from IN_PROGRESS → COMPLETE | Requires evidence committed to `/evidence/` |
| Opening a PR | Must reference OCMBR IU-ID; CI must pass |
| Adding evidence files | Must follow ONX Unified Evidence Standard v1.0 |
| Requesting scope clarification | Must halt work until Founder responds |

### 3.3 Prohibited Executor Actions

| Prohibited Action | Consequence |
|---|---|
| Marking IU COMPLETE without evidence | IU status is reverted by L1 |
| Opening PR without OCMBR IU reference | PR must be closed |
| Committing to onxos/onx-intelligence-clean | Immediate revert + report to Founder |
| Creating scope outside OCMBR | Work is considered void |
| Skipping a wave dependency | Work is considered void |

---

## 4. Implementation Unit (IU) Lifecycle

```
NOT_STARTED
    │
    ▼ (Executor picks up IU)
IN_PROGRESS
    │
    ▼ (Code complete, tests passing, evidence committed)
REVIEW
    │
    ▼ (PR opened, CI passes)
COMPLETE
```

### IU Blocked State

If an IU cannot proceed due to an unresolved dependency or blocker:

```
IN_PROGRESS → BLOCKED (reason documented in PR or OCMBR note)
```

A BLOCKED IU must be unblocked before the domain can proceed. Blocking reason must be reported to Founder.

### IU Evidence Requirement

Before an IU may transition to COMPLETE, the following must be committed to `/evidence/`:

| IU Type | Required Evidence |
|---|---|
| IU-SCH | `EV-CODE_<SYS-ID>_<YYYYMMDD>_schema-merged.txt` — migration ran, `bun run db:push` succeeded |
| IU-API | `EV-CODE_<SYS-ID>_<YYYYMMDD>_api-merged.txt` — `bun run lint` PASS + `bun run build` PASS |
| IU-UI | `EV-CODE_<SYS-ID>_<YYYYMMDD>_ui-merged.txt` — `bun run build` PASS + route accessible |
| IU-TST | `EV-TEST_<SYS-ID>_<YYYYMMDD>_tests-pass.json` — all test scripts pass |

---

## 5. Branch & PR Governance

### Branch Naming

| Branch Type | Pattern | Example |
|---|---|---|
| Domain IU implementation | `civ/{domain-id}-w{n}-{brief}` | `civ/d02-w1-hr-schema` |
| Foundation IU | `civ/foundation-{brief}` | `civ/foundation-branch-schema` |
| OCMBR register update | `ocmbr/{brief}` | `ocmbr/update-d09-status` |
| Hotfix | `hotfix/{brief}` | `hotfix/clin-null-ref` |

### PR Requirements

Every PR must contain:

```markdown
## OCMBR References
- IU-ID: D02-S01-IU-SCH
- System: Employee Master & Org Chart
- Domain: D02 — Human Resources
- Wave: W1

## Evidence
- EV-CODE_D02-S01_20260702_schema-merged.txt committed to /evidence/
- bun run lint: PASS
- bun run build: PASS

## Checklist
- [ ] OCMBR IU-ID in title
- [ ] Evidence committed
- [ ] CI green
- [ ] No prohibited scope introduced
```

### Merge Rules

1. CI must pass (all jobs green)
2. `bun run lint` must pass
3. `bun run build` must pass
4. At least one valid OCMBR IU-ID referenced
5. Merge target is always `main`
6. Squash merge is preferred to keep history clean

---

## 6. Certification Gate Process

### Gate Opening Condition

A Certification Gate opens when all IUs in its scope reach COMPLETE status.

### Gate Review Process

1. Executor notifies Founder that gate is ready for review
2. Founder reviews evidence artifacts in `/evidence/`
3. Founder issues gate verdict: PASSED or REJECTED_WITH_GAPS
4. If REJECTED_WITH_GAPS: gaps are listed, executor resolves, gate is re-presented
5. If PASSED: Founder records approval in OCMBR and signs gate artifact

### Gate Artifact

Each passed gate produces a signed artifact:
```
/evidence/civ-gates/CG-{nn}-PASS_<YYYYMMDD>_<brief>.md
```

Signed by Founder with date and seal statement.

---

## 7. Escalation Protocol

| Situation | Action |
|---|---|
| Executor encounters ambiguous scope | HALT work on affected IU. Open GitHub Discussion with `[OCMBR-SCOPE]` tag. Wait for Founder resolution. |
| Dependency blocked externally (e.g., DB, infra) | Mark IU as BLOCKED. Document in PR. Notify Founder. |
| CI/quality gate failing | Do not open PR. Fix failure first. |
| Discovered scope not in OCMBR | Do not implement. Request Founder to add to OCMBR first. |
| Constitutional conflict detected | IMMEDIATE halt. Escalate to Founder with full evidence. |

---

## 8. Evidence Retention

All evidence artifacts must be:
- Committed to `/evidence/` in `onxos/onx-deploy`
- Named per ONX Unified Evidence Standard v1.0
- Retained for minimum 90 days post-deployment
- Referenced by git commit SHA

---

## 9. OCMBR Versioning

| Version Change | Trigger | L1 Required |
|---|---|---|
| Patch (1.0.x) | Minor corrections, typos, status updates | NO |
| Minor (1.x.0) | New IUs added, dependencies updated | YES |
| Major (x.0.0) | Scope restructure, completion formula change | YES (Founder Seal) |

Current Version: **1.0.0**

---

## 10. Immutability Statement

Once established and Founder-approved, OCMBR Version 1.0.0 scope (15 domains, 145 systems, 580 IUs) is **immutable** until a Major version change is approved.

No executor, no automated process, and no future AI agent may alter the registered scope, delete systems, or modify Certification Gate conditions without Founder-issued written approval documented in the OCMBR change log.

---

## Change Log

| Version | Date | Change | Authority |
|---|---|---|---|
| 1.0.0 | 2026-07-01 | OCMBR established — 15 domains, 145 systems, 580 IUs | Founder Direction ONX-CIV-BUILD-01 |
