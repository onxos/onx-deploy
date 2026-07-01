# OCMBR Status Model

**Document ID:** OCMBR-STATUS-001
**Authority:** Founder / Program Director
**Repository:** onxos/onx-deploy
**Established:** 2026-07-01
**Version:** 1.0.0
**Parent Register:** ONX_CIVILIZATION_MASTER_BUILD_REGISTER.md

---

## 1. Purpose

This document defines the authoritative status model for the ONX Civilization Master Build Register. Every status value used in OCMBR for Implementation Units (IUs), Systems, Modules, Domains, Phases, and Certification Gates is defined here.

No status value exists in OCMBR unless it is defined in this document.

---

## 2. Implementation Unit (IU) Status Values

### 2.1 Status Definitions

| Status Code | Display Label | Definition | Evidence Required |
|---|---|---|---|
| `NOT_STARTED` | Not Started | IU has been registered but no work has begun. This is the default initial state. | None |
| `IN_PROGRESS` | In Progress | An executor has actively started work on this IU. A branch has been created. | Branch exists |
| `REVIEW` | In Review | A PR has been opened. CI is running or has run. Awaiting merge. | Open PR with OCMBR reference |
| `COMPLETE` | Complete | PR merged to main. CI passed. Evidence committed. | Merged PR SHA + evidence artifact in /evidence/ |
| `PARTIAL` | Partial | Some implementation exists (pre-OCMBR) but does not satisfy full IU completion criteria. Must be completed like NOT_STARTED. | None sufficient |
| `BLOCKED` | Blocked | Work cannot proceed due to an unresolved dependency or external blocker. | Blocker documented in OCMBR or PR |
| `DEFERRED` | Deferred | IU has been explicitly deferred to a later wave by Founder decision. | Founder approval documented |
| `VOID` | Void | IU was incorrectly started without meeting prerequisites. All work is considered void. Requires restart. | Founder declaration |

### 2.2 Status Transition Rules

```
NOT_STARTED ──► IN_PROGRESS ──► REVIEW ──► COMPLETE
     │                │              │
     │                └──► BLOCKED   │
     │                │              │
     └──► PARTIAL ──► IN_PROGRESS    │
                                     │
DEFERRED ◄───────────────────────────┘ (only by Founder)
VOID ◄──────────────────────────────── (only by Founder)
```

**Permitted Transitions:**

| From | To | Permitted By | Condition |
|---|---|---|---|
| NOT_STARTED | IN_PROGRESS | Executor | Prerequisites met |
| PARTIAL | IN_PROGRESS | Executor | Prerequisites met |
| IN_PROGRESS | REVIEW | Executor | PR opened, CI green |
| IN_PROGRESS | BLOCKED | Executor | Blocker documented |
| REVIEW | COMPLETE | Executor (merge) | CI green, evidence committed |
| REVIEW | IN_PROGRESS | Executor | PR feedback requires more work |
| BLOCKED | IN_PROGRESS | Executor | Blocker resolved |
| COMPLETE | VOID | Founder only | Evidence found to be insufficient |
| ANY | DEFERRED | Founder only | Explicit Founder decision |

**Forbidden Transitions:**

| From | To | Reason |
|---|---|---|
| NOT_STARTED | COMPLETE | Evidence must exist; no shortcut |
| PARTIAL | COMPLETE | Must complete all IU criteria |
| IN_PROGRESS | COMPLETE | PR and evidence must exist |
| BLOCKED | COMPLETE | Blocker must be resolved first |

### 2.3 COMPLETE Criteria (Strict)

An IU may only be marked COMPLETE when ALL of the following are true:

| Criterion | IU-SCH | IU-API | IU-UI | IU-TST |
|---|---|---|---|---|
| Branch created and work committed | YES | YES | YES | YES |
| PR opened with OCMBR reference in title | YES | YES | YES | YES |
| CI (GitHub Actions) green | YES | YES | YES | YES |
| `bun run lint` passes | YES | YES | YES | YES |
| `bun run build` passes | YES | YES | YES | YES |
| PR merged to main | YES | YES | YES | YES |
| Evidence artifact committed to /evidence/ | YES | YES | YES | YES |
| Drizzle migration runs cleanly (db:push) | YES | NO | NO | NO |
| tRPC router registered in root router | NO | YES | NO | NO |
| Route renders in browser | NO | NO | YES | NO |
| All test scripts pass | NO | NO | NO | YES |

---

## 3. System Status Values

A System's status is derived from its IU statuses. It is NOT manually set.

| System Status | Derivation Rule |
|---|---|
| `NOT_STARTED` | All IUs are NOT_STARTED or PARTIAL |
| `IN_PROGRESS` | At least one IU is IN_PROGRESS or REVIEW |
| `COMPLETE` | All 4 IUs are COMPLETE |
| `BLOCKED` | At least one IU is BLOCKED and none are COMPLETE |
| `PARTIAL` | Some IUs COMPLETE, not all |

---

## 4. Domain Status Values

A Domain's status is derived from its System statuses.

| Domain Status | Derivation Rule |
|---|---|
| `NOT_STARTED` | All systems are NOT_STARTED |
| `IN_PROGRESS` | At least one system is IN_PROGRESS |
| `COMPLETE` | All systems are COMPLETE |
| `BLOCKED` | At least one system is BLOCKED |
| `PARTIAL` | Some systems COMPLETE, not all |

---

## 5. Certification Gate Status Values

| Gate Status | Definition | Set By |
|---|---|---|
| `NOT_OPEN` | Gate conditions not yet met | Automatic |
| `OPEN` | All IUs in gate scope are COMPLETE | Automatic |
| `UNDER_REVIEW` | Founder is reviewing evidence | Founder |
| `PASSED` | Founder has approved and signed | Founder (seal) |
| `REJECTED_WITH_GAPS` | Gaps found; executor must resolve | Founder |

---

## 6. Phase Status Values

| Phase Status | Definition |
|---|---|
| `NOT_STARTED` | Phase has not been activated |
| `IN_PROGRESS` | At least one IU in phase is IN_PROGRESS |
| `COMPLETE` | All IUs in phase scope are COMPLETE |
| `BLOCKED` | Phase cannot proceed due to prior phase incomplete |

---

## 7. Civilisation Completion Status

| Civilisation Status | Condition |
|---|---|
| `FOUNDATION_COMPLETE` | Platform Foundation Runtime complete (pre-OCMBR) |
| `BUILDING` | OCMBR established, IUs being completed |
| `WAVE_N_COMPLETE` | All IUs for Wave N are COMPLETE, CG passed |
| `ALL_WAVES_COMPLETE` | All W1–W5 IUs COMPLETE |
| `PRODUCTION_HARDENED` | Phase 9 (production hardening) complete |
| `CERTIFIED` | CG-09 passed, Final Certificate signed by Founder |
| **`ONX_CIVILIZATION_COMPLETE`** | **Supreme final state — Founder Approved** |

---

## 8. Status Display Conventions

### In OCMBR Tables

| Status Code | Markdown Display |
|---|---|
| NOT_STARTED | `NOT_STARTED` |
| IN_PROGRESS | `IN_PROGRESS` |
| REVIEW | `REVIEW` |
| COMPLETE | `COMPLETE` |
| PARTIAL | `PARTIAL` |
| BLOCKED | `BLOCKED ⚠` |
| DEFERRED | `DEFERRED` |
| VOID | `VOID ✗` |

### In PR Titles

Format: `[{IU-ID}][{STATUS}] {description}`

Examples:
- `[D02-S01-IU-SCH][COMPLETE] Add employee schema + migration`
- `[FOUND-IU-01][IN_PROGRESS] Branch/brand foundation schema`

---

## 9. Status Anti-Patterns (Forbidden)

The following are strictly forbidden:

| Anti-Pattern | Why Forbidden |
|---|---|
| Marking COMPLETE based on file existence only | File existence ≠ complete IU; evidence and CI required |
| Self-certifying COMPLETE without evidence | Violates OCMBR Rule 3 |
| Marking a Wave N IU COMPLETE before Wave N-1 | Violates OCMBR Rule 4 |
| Using status "DONE", "FINISHED", "YES" | Non-standard; not recognized by OCMBR |
| Leaving IU in IN_PROGRESS indefinitely without BLOCKED declaration | Work stall must be declared BLOCKED |

---

## 10. Status Audit Trail

Every status change must be traceable. Acceptable audit trail methods:

1. **Git commit** — The merge commit SHA proves IU-COMPLETE transition for code IUs
2. **Evidence file** — Committed artifact in `/evidence/` with date + content
3. **Founder note** — Written Founder approval for gate transitions, scope changes, DEFERRED declarations

---

## Status Model Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-01 | Initial status model established with OCMBR |
