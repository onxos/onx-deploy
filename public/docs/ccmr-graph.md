# CCMR Knowledge Graph
## Civilizational Change Management Record

---

### What is CCMR?

The Civilizational Change Management Record (CCMR) is the tracking system for all changes to ONX. It maintains a knowledge graph showing dependencies between systems, SBPs, decisions, and corrections — ensuring that no change is made without understanding its full impact.

### Knowledge Graph Structure

The CCMR Graph connects:
- **Systems** (SYS-01 to SYS-24) → Dependencies
- **SBPs** (SBP-21 to SBP-60+) → Implementation status
- **Decisions** (D-001 to D-043) → Authorizations
- **Corrections** (COR-001 to COR-016) → Accuracy fixes
- **Approvals** (APR-001 to APR-010) → Formal authorizations

### Dependency Chains

Example dependency chain:
```
SBP-45 (Payment) → SBP-46 (Billing) → SBP-47 (Subscriptions)
     ↓                    ↓                      ↓
SYS-05 (Storage)     SYS-04 (Database)     SYS-02 (Users)
```

### Change Impact Analysis

Before any change is approved, CCMR analyzes:
1. Direct dependencies (what this change affects)
2. Indirect dependencies (what affects this change)
3. Decision references (which decisions authorize this)
4. SECH alignment (which layers are engaged)
5. Risk assessment (what could go wrong)

### Current Status

- Total tracked items: 100+
- Dependency chains: 30+
- Last updated: 2026-06-18
- SECH alignment: All layers active

---

**"No change without understanding." — Principle 5 (Knowledge Immutability)**
