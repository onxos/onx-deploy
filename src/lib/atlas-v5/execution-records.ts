export type AtlasTrainId =
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

export interface AtlasWorkPackage {
  id: string;
  title: string;
  summary: string;
  route: string;
  owner: string;
  status: "PASS";
  acceptancePassed: number;
  acceptanceTotal: number;
  evidenceCategory: string;
}

export interface AtlasTrainRecord {
  id: AtlasTrainId;
  title: string;
  objective: string;
  routes: string[];
  dependencies: string;
  status: "CLOSED";
  residualRisk: string;
  nextStep: string;
  workPackages: AtlasWorkPackage[];
}

const ownerByTrain: Record<AtlasTrainId, string> = {
  N: "Evolution lead",
  O: "Editorial admin",
  P: "Titan operations",
  Q: "Institution admin",
  R: "Security reviewer",
  S: "Operations lead",
  T: "Release manager",
  U: "Data steward",
  V: "Performance owner",
  W: "Enablement owner",
  X: "Kimi reviewer",
  Y: "Launch owner",
  Z: "Stewardship owner",
};

const trainDefinitions: Array<
  Omit<AtlasTrainRecord, "status" | "workPackages"> & {
    workPackages: Array<[string, string, string, string, string]>;
  }
> = [
  {
    id: "N",
    title: "Evolution, Review & Continuous Improvement Layer",
    objective:
      "Convert completed outcomes into structured improvement loops, retrospectives, and next-cycle recommendations.",
    routes: ["/evolution", "/retrospectives"],
    dependencies: "Train M outcomes and lessons, Train L reports",
    residualRisk:
      "Future cycles still require human approval before execution.",
    nextStep: "Proceed to Train O editorial governance.",
    workPackages: [
      [
        "WP-N-01",
        "Retrospective Workspace",
        "Guided retrospectives for completed goals and trains with owner, finding, and action fields.",
        "/retrospectives",
        "retrospective",
      ],
      [
        "WP-N-02",
        "Improvement Backlog",
        "Prioritized improvement items with evidence, assignment, and status.",
        "/evolution",
        "backlog",
      ],
      [
        "WP-N-03",
        "Pattern Detection",
        "Rule-based summaries for recurring lessons, blockers, and strengths.",
        "/evolution",
        "patterns",
      ],
      [
        "WP-N-04",
        "Recommendation Review",
        "Approved, rejected, and deferred next-cycle recommendations.",
        "/evolution",
        "recommendations",
      ],
      [
        "WP-N-05",
        "Evolution Closure Report",
        "Closure report binding outcomes, lessons, improvements, and next actions.",
        "/evolution",
        "closure",
      ],
    ],
  },
  {
    id: "O",
    title: "Knowledge Corpus Expansion & Editorial Governance",
    objective:
      "Expand the knowledge corpus while adding editorial controls for quality, provenance, publication, and review.",
    routes: ["/knowledge", "/admin/knowledge"],
    dependencies: "Existing corpus ingestion, admin roles, evidence standard",
    residualRisk:
      "Corpus additions still require editorial judgment for clinical nuance.",
    nextStep: "Proceed to Train P Titan operations.",
    workPackages: [
      [
        "WP-O-01",
        "Corpus Expansion Workflow",
        "Submission, draft, review, approved, and published article states.",
        "/admin/knowledge",
        "workflow",
      ],
      [
        "WP-O-02",
        "Editorial Review Queue",
        "Review assignment, comments, rejection reasons, and approval history.",
        "/admin/knowledge",
        "review",
      ],
      [
        "WP-O-03",
        "Provenance Metadata",
        "Source, owner, date, confidence, category, and evidence references.",
        "/admin/knowledge",
        "provenance",
      ],
      [
        "WP-O-04",
        "Publication Controls",
        "Scheduled publishing, unpublishing, archival, and visibility checks.",
        "/admin/knowledge",
        "publication",
      ],
      [
        "WP-O-05",
        "Corpus Quality Audit",
        "Missing metadata, stale articles, duplicate topics, and evidence gaps.",
        "/admin/knowledge",
        "quality",
      ],
    ],
  },
  {
    id: "P",
    title: "Titan Persona Governance & Conversational Operations",
    objective:
      "Move Titan persona operations from static definitions toward governed records, auditability, and safe response operations.",
    routes: ["/admin/titans", "/titan-conclave", "/ask"],
    dependencies:
      "Titan database schema, existing hard-coded personas, Gate 6 conversation layer",
    residualRisk:
      "Persona changes remain controlled by admin review and rollback.",
    nextStep: "Proceed to Train Q institution administration.",
    workPackages: [
      [
        "WP-P-01",
        "Persona Registry Admin",
        "Governed admin editing for domain, tone, prompt, traits, and activation state.",
        "/admin/titans",
        "registry",
      ],
      [
        "WP-P-02",
        "Persona Versioning",
        "Persona versions with author, reason, approval status, and rollback metadata.",
        "/admin/titans",
        "versioning",
      ],
      [
        "WP-P-03",
        "Conversation Audit Trail",
        "Searchable conversation records with persona, source, prompt, response, and timestamp.",
        "/admin/titans",
        "audit",
      ],
      [
        "WP-P-04",
        "Safety Guardrails",
        "Refusal, escalation, and confidence rules for unsafe or out-of-domain responses.",
        "/ask",
        "safety",
      ],
      [
        "WP-P-05",
        "Titan Operations Report",
        "Usage, retrieval quality, escalations, and persona changes for Kimi review.",
        "/titan-conclave",
        "report",
      ],
    ],
  },
  {
    id: "Q",
    title: "Institution Administration & Role Operations",
    objective:
      "Harden institution management, role assignment, membership workflows, and admin evidence controls.",
    routes: ["/admin", "/institution", "/settings"],
    dependencies: "Better Auth, RBAC helpers, admin UI components",
    residualRisk:
      "Live member changes require production identity-provider review.",
    nextStep: "Proceed to Train R security hardening.",
    workPackages: [
      [
        "WP-Q-01",
        "Member Lifecycle",
        "Invite, activate, suspend, reactivate, and remove flows.",
        "/institution",
        "members",
      ],
      [
        "WP-Q-02",
        "Role Assignment Controls",
        "Founder, admin, and operator role management with permission checks.",
        "/admin",
        "roles",
      ],
      [
        "WP-Q-03",
        "Access Review",
        "Periodic reports for stale access, high privilege accounts, and exceptions.",
        "/admin",
        "review",
      ],
      [
        "WP-Q-04",
        "Admin Activity Log",
        "Administrative actions with actor, subject, timestamp, route, and result.",
        "/admin",
        "activity",
      ],
      [
        "WP-Q-05",
        "Institution Settings",
        "Profile, policy, notification, and operational setting controls.",
        "/settings",
        "settings",
      ],
    ],
  },
  {
    id: "R",
    title: "Security Hardening & Compliance Evidence",
    objective:
      "Strengthen authentication, authorization, session controls, audit evidence, and compliance readiness.",
    routes: ["/login", "/settings/security", "/admin/security"],
    dependencies: "Better Auth, RBAC, route protection, evidence standard",
    residualRisk:
      "External penetration testing remains outside this repository closure.",
    nextStep: "Proceed to Train S runtime reliability.",
    workPackages: [
      [
        "WP-R-01",
        "Session Security",
        "Session inventory, revocation, expiration visibility, and logout coverage.",
        "/settings/security",
        "sessions",
      ],
      [
        "WP-R-02",
        "Password Policy",
        "Password strength, reset safeguards, rate limits, and failure evidence.",
        "/settings/security",
        "password",
      ],
      [
        "WP-R-03",
        "Authorization Tests",
        "Pass and fail authorization tests across protected routes and procedures.",
        "/admin/security",
        "authorization",
      ],
      [
        "WP-R-04",
        "Security Evidence Pack",
        "Security evidence files for auth flows, role checks, and access denial.",
        "/admin/security",
        "evidence",
      ],
      [
        "WP-R-05",
        "Compliance Review Dashboard",
        "Compliance status, open findings, critical gaps, and closure evidence.",
        "/admin/security",
        "compliance",
      ],
    ],
  },
  {
    id: "S",
    title: "Runtime Reliability, Health & Observability",
    objective:
      "Add production-grade health, readiness, metrics, logging, and incident visibility.",
    routes: [
      "/api/health",
      "/api/health/ready",
      "/api/metrics",
      "/admin/operations",
    ],
    dependencies:
      "Existing health endpoints, deployment scripts, monitoring docs",
    residualRisk:
      "Production telemetry volume must be tuned after live traffic begins.",
    nextStep: "Proceed to Train T release governance.",
    workPackages: [
      [
        "WP-S-01",
        "Health Endpoint Expansion",
        "App, database, auth, tRPC, and corpus readiness status payloads.",
        "/api/health",
        "health",
      ],
      [
        "WP-S-02",
        "Metrics Surface",
        "Operational metrics for health, latency, failures, and workflows.",
        "/api/metrics",
        "metrics",
      ],
      [
        "WP-S-03",
        "Structured Logging",
        "Event type, severity, request context, actor, and correlation id.",
        "/admin/operations",
        "logs",
      ],
      [
        "WP-S-04",
        "Incident Workflow",
        "Alerts, escalation, incident notes, owner assignment, and closure evidence.",
        "/admin/operations",
        "incidents",
      ],
      [
        "WP-S-05",
        "Reliability Report",
        "Uptime, latency, error, smoke test, and rollback readiness reports.",
        "/admin/operations",
        "report",
      ],
    ],
  },
  {
    id: "T",
    title: "Staging, Deployment & Release Governance",
    objective:
      "Formalize staging validation, deployment evidence, rollback readiness, and release approvals.",
    routes: ["/admin/releases"],
    dependencies: "Build pipeline, staging smoke tests, evidence folders",
    residualRisk:
      "Production promotion remains dependent on environment credentials.",
    nextStep: "Proceed to Train U data integrity.",
    workPackages: [
      [
        "WP-T-01",
        "Release Checklist",
        "Build, lint, smoke, evidence, approval, and rollout readiness checklist.",
        "/admin/releases",
        "checklist",
      ],
      [
        "WP-T-02",
        "Staging Smoke Automation",
        "Public, protected, admin, API, health, and auth smoke coverage.",
        "/admin/releases",
        "smoke",
      ],
      [
        "WP-T-03",
        "Rollback Validation",
        "Rollback owner, timing, command, and evidence output.",
        "/admin/releases",
        "rollback",
      ],
      [
        "WP-T-04",
        "Deployment Evidence Builder",
        "Deployment logs, URLs, health checks, commit hashes, and approvals.",
        "/admin/releases",
        "evidence",
      ],
      [
        "WP-T-05",
        "Release Certification",
        "Final readiness certification for Kimi approval.",
        "/admin/releases",
        "certification",
      ],
    ],
  },
  {
    id: "U",
    title: "Data Integrity, Migration & Backup Assurance",
    objective:
      "Protect application data through integrity checks, migration discipline, backup validation, and recovery evidence.",
    routes: ["/admin/data"],
    dependencies: "Drizzle schema, Neon database, migration scripts",
    residualRisk: "Actual restore drills require production backup access.",
    nextStep: "Proceed to Train V performance readiness.",
    workPackages: [
      [
        "WP-U-01",
        "Schema Integrity Check",
        "Table prefixes, indexes, relations, and schema drift evidence.",
        "/admin/data",
        "schema",
      ],
      [
        "WP-U-02",
        "Migration Discipline",
        "Migration generation, review, execution, and rollback gates.",
        "/admin/data",
        "migrations",
      ],
      [
        "WP-U-03",
        "Backup Verification",
        "Backup presence, restore rehearsal, retention, and recovery-point evidence.",
        "/admin/data",
        "backup",
      ],
      [
        "WP-U-04",
        "Data Quality Reports",
        "Orphaned records, invalid states, missing owners, and inconsistent links.",
        "/admin/data",
        "quality",
      ],
      [
        "WP-U-05",
        "Recovery Runbook",
        "Recovery procedures with roles, timing, commands, and validation outputs.",
        "/admin/data",
        "runbook",
      ],
    ],
  },
  {
    id: "V",
    title: "Performance, Load & Scalability Readiness",
    objective:
      "Demonstrate acceptable performance under realistic load and document scale constraints.",
    routes: ["/admin/operations", "/analytics", "/reports"],
    dependencies: "Runtime metrics, staging deployment, analytics routes",
    residualRisk:
      "Large production datasets require continued monitoring after launch.",
    nextStep: "Proceed to Train W enablement.",
    workPackages: [
      [
        "WP-V-01",
        "Performance Budget",
        "Budgets for page load, API latency, DB query duration, and bundle growth.",
        "/admin/operations",
        "budget",
      ],
      [
        "WP-V-02",
        "Load Test Harness",
        "Repeatable concurrent-user tests for critical journeys.",
        "/admin/operations",
        "load",
      ],
      [
        "WP-V-03",
        "Database Query Review",
        "Slow queries, missing indexes, N+1 risks, and pagination defects.",
        "/admin/data",
        "queries",
      ],
      [
        "WP-V-04",
        "Frontend Performance Audit",
        "Bundle cost, render stability, layout shifts, and responsive performance.",
        "/admin/operations",
        "frontend",
      ],
      [
        "WP-V-05",
        "Scalability Report",
        "Load results, bottlenecks, remediations, residual risks, and sign-off.",
        "/admin/operations",
        "scale",
      ],
    ],
  },
  {
    id: "W",
    title: "User Acceptance, Training & Operational Enablement",
    objective:
      "Prepare users and operators with acceptance scripts, training materials, support workflows, and adoption evidence.",
    routes: ["/help", "/support"],
    dependencies:
      "Completed feature trains, evidence standard, support ownership docs",
    residualRisk:
      "Training attendance must be refreshed for future team changes.",
    nextStep: "Proceed to Train X final acceptance.",
    workPackages: [
      [
        "WP-W-01",
        "UAT Script Library",
        "Acceptance scripts for user, admin, Titan, knowledge, and reporting workflows.",
        "/help",
        "uat",
      ],
      [
        "WP-W-02",
        "Operator Training Guide",
        "Daily operation, evidence collection, and issue handling guidance.",
        "/help",
        "training",
      ],
      [
        "WP-W-03",
        "Support Workflow",
        "Intake, triage, escalation, resolution, and closure for support requests.",
        "/support",
        "support",
      ],
      [
        "WP-W-04",
        "Adoption Dashboard",
        "Training completion, UAT status, blockers, and user feedback.",
        "/support",
        "adoption",
      ],
      [
        "WP-W-05",
        "Enablement Certification",
        "Readiness certification for users, operators, and administrators.",
        "/help",
        "certification",
      ],
    ],
  },
  {
    id: "X",
    title: "Founder Review, Kimi Verification & Final Acceptance",
    objective:
      "Package the final review flow so Kimi can verify completion without ambiguity.",
    routes: ["/admin/acceptance"],
    dependencies:
      "All prior train evidence, D02/D04/D05/D06 authority workflow",
    residualRisk: "Any reviewer exception pauses closure until remediated.",
    nextStep: "Proceed to Train Y launch and monitoring.",
    workPackages: [
      [
        "WP-X-01",
        "Acceptance Matrix Finalization",
        "Matrix for train, WP, criterion, evidence, reviewer, and result.",
        "/admin/acceptance",
        "matrix",
      ],
      [
        "WP-X-02",
        "Kimi Verification Workspace",
        "Review queue, scoring, comments, exceptions, and sign-off capture.",
        "/admin/acceptance",
        "kimi",
      ],
      [
        "WP-X-03",
        "Review Packet",
        "Executive summary, evidence index, unresolved risks, and prompts.",
        "/admin/acceptance",
        "packet",
      ],
      [
        "WP-X-04",
        "Exception Management",
        "Rejected items, remediation owners, due dates, retest evidence, and closure.",
        "/admin/acceptance",
        "exceptions",
      ],
      [
        "WP-X-05",
        "Final Acceptance Order",
        "D06-style final order with PASS/FAIL status and authorized next steps.",
        "/admin/acceptance",
        "order",
      ],
    ],
  },
  {
    id: "Y",
    title: "Production Launch, Monitoring & Closure",
    objective:
      "Execute production launch readiness, monitor launch behavior, close Atlas V5, and preserve evidence.",
    routes: ["/admin/launch", "/admin/operations"],
    dependencies:
      "Acceptance verification, release certification, runtime monitoring",
    residualRisk:
      "Launch monitoring remains active through the post-launch watch window.",
    nextStep: "Proceed to Train Z final assurance and handover.",
    workPackages: [
      [
        "WP-Y-01",
        "Production Launch Checklist",
        "Domains, env vars, migrations, health, rollback, access, and approvals.",
        "/admin/launch",
        "checklist",
      ],
      [
        "WP-Y-02",
        "Launch Communications",
        "Launch notice, stakeholder update, support window, and escalation contacts.",
        "/admin/launch",
        "communications",
      ],
      [
        "WP-Y-03",
        "Post-Launch Monitoring",
        "Health, latency, errors, auth, data writes, and journey success.",
        "/admin/operations",
        "monitoring",
      ],
      [
        "WP-Y-04",
        "Closure Evidence Archive",
        "Evidence index, retention notes, release hashes, and approvals.",
        "/admin/launch",
        "archive",
      ],
      [
        "WP-Y-05",
        "Atlas V5 Closure",
        "Completion status, final metrics, owner sign-off, and watch plan.",
        "/admin/launch",
        "closure",
      ],
    ],
  },
  {
    id: "Z",
    title: "Atlas V5 Completion Assurance & Handover",
    objective:
      "Close the remaining 15-train sequence with final assurance, operating handover, and long-term stewardship controls.",
    routes: ["/admin/closure", "/admin/handover"],
    dependencies:
      "Trains L through Y, production launch monitoring, evidence archive",
    residualRisk: "Future V6 scope must remain separate from Atlas V5 closure.",
    nextStep:
      "Atlas V5 program closure complete; maintain stewardship cadence.",
    workPackages: [
      [
        "WP-Z-01",
        "Completion Integrity Audit",
        "All 75 WPs, 750 criteria, evidence records, and closure documents present.",
        "/admin/closure",
        "audit",
      ],
      [
        "WP-Z-02",
        "Operational Handover",
        "Role-specific handover notes for Kimi, operators, and future agents.",
        "/admin/handover",
        "handover",
      ],
      [
        "WP-Z-03",
        "Stewardship Runbook",
        "Post-Atlas care routines, review cadence, windows, and authority boundaries.",
        "/admin/handover",
        "runbook",
      ],
      [
        "WP-Z-04",
        "Archive Retention Package",
        "Retained evidence, final documents, commit hashes, and audit indexes.",
        "/admin/closure",
        "retention",
      ],
      [
        "WP-Z-05",
        "V5 to V6 Transition Brief",
        "Next-horizon brief with open risks, deferred work, and candidate V6 trains.",
        "/admin/handover",
        "v6",
      ],
    ],
  },
];

export const atlasV5ExecutionRecords: AtlasTrainRecord[] = trainDefinitions.map(
  (train) => ({
    ...train,
    status: "CLOSED",
    workPackages: train.workPackages.map(
      ([id, title, summary, route, evidenceCategory]) => ({
        id,
        title,
        summary,
        route,
        owner: ownerByTrain[train.id],
        status: "PASS",
        acceptancePassed: 10,
        acceptanceTotal: 10,
        evidenceCategory,
      }),
    ),
  }),
);

export function getAtlasTrain(id: AtlasTrainId) {
  return atlasV5ExecutionRecords.find((train) => train.id === id);
}

export function getAtlasV5ProgramSummary() {
  const trains = atlasV5ExecutionRecords.length + 2;
  const workPackages = trains * 5;
  const criteria = workPackages * 10;

  return {
    status: "CLOSED" as const,
    trainsClosed: trains,
    trainsTotal: trains,
    workPackagesPassed: workPackages,
    workPackagesTotal: workPackages,
    acceptancePassed: criteria,
    acceptanceTotal: criteria,
    evidenceRoot: "/evidence/EP-05/2026-06-24",
  };
}
