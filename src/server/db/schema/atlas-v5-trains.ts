import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

const createTable = pgTableCreator((name) => `onx_${name}`);

// ═══════════════════════════════════════════════════════════
// TRAIN N — Evolution, Review & Continuous Improvement
// ═══════════════════════════════════════════════════════════

export const retrospective = createTable(
  "retrospective",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    goalReference: varchar("goal_reference", { length: 50 }),
    ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
    finding: text("finding").notNull(),
    action: text("action").notNull(),
    status: varchar("status", { length: 20 }).default("open").notNull(),
    priority: varchar("priority", { length: 20 }).default("medium"),
    category: varchar("category", { length: 50 }).default("general"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (table) => [index("onx_retrospective_status_idx").on(table.status)],
);

export const improvementBacklog = createTable(
  "improvement_backlog",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    evidence: text("evidence"),
    assigneeId: text("assignee_id").references(() => user.id, { onDelete: "set null" }),
    status: varchar("status", { length: 20 }).default("backlog").notNull(),
    priority: varchar("priority", { length: 20 }).default("medium"),
    effort: varchar("effort", { length: 20 }),
    targetGate: varchar("target_gate", { length: 20 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (table) => [index("onx_improvement_backlog_status_idx").on(table.status)],
);

export const patternDetection = createTable(
  "pattern_detection",
  {
    id: serial("id").primaryKey(),
    pattern: varchar("pattern", { length: 256 }).notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    occurrences: integer("occurrences").default(1),
    source: varchar("source", { length: 100 }),
    recommendation: text("recommendation"),
    confidence: varchar("confidence", { length: 20 }).default("medium"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_pattern_detection_type_idx").on(table.type)],
);

export const recommendation = createTable(
  "recommendation",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description").notNull(),
    status: varchar("status", { length: 20 }).default("proposed").notNull(),
    cycle: varchar("cycle", { length: 50 }),
    proposerId: text("proposer_id").references(() => user.id, { onDelete: "set null" }),
    reviewNotes: text("review_notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (table) => [index("onx_recommendation_status_idx").on(table.status)],
);

// ═══════════════════════════════════════════════════════════
// TRAIN O — Editorial Governance
// ═══════════════════════════════════════════════════════════

export const editorialPolicy = createTable(
  "editorial_policy",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    scope: varchar("scope", { length: 100 }).notNull(),
    content: text("content").notNull(),
    version: varchar("version", { length: 20 }).default("1.0"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    approvedById: text("approved_by_id").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (table) => [index("onx_editorial_policy_status_idx").on(table.status)],
);

export const contentReview = createTable(
  "content_review",
  {
    id: serial("id").primaryKey(),
    contentId: varchar("content_id", { length: 50 }).notNull(),
    contentType: varchar("content_type", { length: 50 }).notNull(),
    reviewerId: text("reviewer_id").references(() => user.id, { onDelete: "set null" }),
    verdict: varchar("verdict", { length: 20 }).notNull(),
    feedback: text("feedback"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_content_review_verdict_idx").on(table.verdict)],
);

export const publicationSchedule = createTable(
  "publication_schedule",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    scheduledDate: timestamp("scheduled_date", { withTimezone: true }).notNull(),
    contentType: varchar("content_type", { length: 50 }),
    status: varchar("status", { length: 20 }).default("scheduled").notNull(),
    ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_publication_schedule_date_idx").on(table.scheduledDate)],
);

// ═══════════════════════════════════════════════════════════
// TRAIN P — Titan Operations
// ═══════════════════════════════════════════════════════════

export const titanMonitoringLog = createTable(
  "titan_monitoring_log",
  {
    id: serial("id").primaryKey(),
    titanId: integer("titan_id").notNull(),
    event: varchar("event", { length: 100 }).notNull(),
    severity: varchar("severity", { length: 20 }).default("info").notNull(),
    message: text("message"),
    metadata: text("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_titan_monitoring_titan_idx").on(table.titanId)],
);

export const titanMaintenance = createTable(
  "titan_maintenance",
  {
    id: serial("id").primaryKey(),
    titanId: integer("titan_id").notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    description: text("description"),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_titan_maintenance_status_idx").on(table.status)],
);

// ═══════════════════════════════════════════════════════════
// TRAIN Q — Institution Management
// ═══════════════════════════════════════════════════════════

export const institutionSetting = createTable(
  "institution_setting",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: text("value"),
    category: varchar("category", { length: 50 }).default("general"),
    description: text("description"),
    updatedById: text("updated_by_id").references(() => user.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
);

export const memberManagement = createTable(
  "member_management",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    role: varchar("role", { length: 20 }).notNull(),
    department: varchar("department", { length: 100 }),
    status: varchar("status", { length: 20 }).default("active").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
);

// ═══════════════════════════════════════════════════════════
// TRAIN R — Security Review
// ═══════════════════════════════════════════════════════════

export const securityAudit = createTable(
  "security_audit",
  {
    id: serial("id").primaryKey(),
    auditType: varchar("audit_type", { length: 50 }).notNull(),
    target: varchar("target", { length: 256 }).notNull(),
    findings: text("findings"),
    severity: varchar("severity", { length: 20 }).default("low"),
    status: varchar("status", { length: 20 }).default("open").notNull(),
    auditorId: text("auditor_id").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (table) => [index("onx_security_audit_status_idx").on(table.status)],
);

export const vulnerabilityTracking = createTable(
  "vulnerability_tracking",
  {
    id: serial("id").primaryKey(),
    cveId: varchar("cve_id", { length: 50 }),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    severity: varchar("severity", { length: 20 }).default("medium").notNull(),
    status: varchar("status", { length: 20 }).default("open").notNull(),
    remediation: text("remediation"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_vulnerability_severity_idx").on(table.severity)],
);

// ═══════════════════════════════════════════════════════════
// TRAIN S — Operations
// ═══════════════════════════════════════════════════════════

export const operationalMetric = createTable(
  "operational_metric",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    value: varchar("value", { length: 100 }).notNull(),
    unit: varchar("unit", { length: 50 }),
    source: varchar("source", { length: 100 }),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_operational_metric_name_idx").on(table.name)],
);

export const systemHealth = createTable(
  "system_health",
  {
    id: serial("id").primaryKey(),
    component: varchar("component", { length: 100 }).notNull(),
    status: varchar("status", { length: 20 }).notNull(),
    latency: integer("latency"),
    errorRate: integer("error_rate"),
    checkedAt: timestamp("checked_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_system_health_component_idx").on(table.component)],
);

// ═══════════════════════════════════════════════════════════
// TRAIN T — Release Management
// ═══════════════════════════════════════════════════════════

export const releaseRecord = createTable(
  "release_record",
  {
    id: serial("id").primaryKey(),
    version: varchar("version", { length: 50 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    status: varchar("status", { length: 20 }).default("planning").notNull(),
    deployedAt: timestamp("deployed_at", { withTimezone: true }),
    deployedById: text("deployed_by_id").references(() => user.id, { onDelete: "set null" }),
    rollbackVersion: varchar("rollback_version", { length: 50 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_release_record_status_idx").on(table.status)],
);

export const deploymentTracking = createTable(
  "deployment_tracking",
  {
    id: serial("id").primaryKey(),
    releaseId: integer("release_id").notNull(),
    environment: varchar("environment", { length: 50 }).notNull(),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    logs: text("logs"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_deployment_tracking_status_idx").on(table.status)],
);

// ═══════════════════════════════════════════════════════════
// TRAIN U — Data Governance
// ═══════════════════════════════════════════════════════════

export const dataGovernanceRule = createTable(
  "data_governance_rule",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    scope: varchar("scope", { length: 100 }).notNull(),
    rule: text("rule").notNull(),
    status: varchar("status", { length: 20 }).default("active").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
);

export const dataQualityCheck = createTable(
  "data_quality_check",
  {
    id: serial("id").primaryKey(),
    tableName: varchar("table_name", { length: 100 }).notNull(),
    checkType: varchar("check_type", { length: 50 }).notNull(),
    passed: boolean("passed").notNull(),
    details: text("details"),
    checkedAt: timestamp("checked_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_data_quality_table_idx").on(table.tableName)],
);

// ═══════════════════════════════════════════════════════════
// TRAIN V — Performance
// ═══════════════════════════════════════════════════════════

export const performanceMetric = createTable(
  "performance_metric",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    value: integer("value").notNull(),
    unit: varchar("unit", { length: 50 }),
    threshold: integer("threshold"),
    isAlert: boolean("is_alert").default(false),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_performance_metric_name_idx").on(table.name)],
);

export const loadTestResult = createTable(
  "load_test_result",
  {
    id: serial("id").primaryKey(),
    scenario: varchar("scenario", { length: 256 }).notNull(),
    concurrentUsers: integer("concurrent_users"),
    avgResponseTime: integer("avg_response_time"),
    p95ResponseTime: integer("p95_response_time"),
    errorRate: integer("error_rate"),
    status: varchar("status", { length: 20 }).default("completed").notNull(),
    testedAt: timestamp("tested_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
);

// ═══════════════════════════════════════════════════════════
// TRAIN W — Enablement
// ═══════════════════════════════════════════════════════════

export const trainingMaterial = createTable(
  "training_material",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    content: text("content").notNull(),
    category: varchar("category", { length: 100 }).default("general"),
    difficulty: varchar("difficulty", { length: 20 }).default("beginner"),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  },
);

export const onboardingFlow = createTable(
  "onboarding_flow",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    currentStep: integer("current_step").default(0),
    totalSteps: integer("total_steps").default(5),
    status: varchar("status", { length: 20 }).default("in_progress").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
);

// ═══════════════════════════════════════════════════════════
// TRAIN X — Audit & Review
// ═══════════════════════════════════════════════════════════

export const auditLog = createTable(
  "audit_log",
  {
    id: serial("id").primaryKey(),
    actorId: text("actor_id"),
    action: varchar("action", { length: 100 }).notNull(),
    resource: varchar("resource", { length: 100 }).notNull(),
    resourceId: varchar("resource_id", { length: 100 }),
    details: text("details"),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_audit_log_action_idx").on(table.action)],
);

export const complianceCheck = createTable(
  "compliance_check",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    standard: varchar("standard", { length: 100 }).notNull(),
    result: varchar("result", { length: 20 }).notNull(),
    findings: text("findings"),
    checkedAt: timestamp("checked_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
);

// ═══════════════════════════════════════════════════════════
// TRAIN Y — Launch Readiness
// ═══════════════════════════════════════════════════════════

export const launchChecklist = createTable(
  "launch_checklist",
  {
    id: serial("id").primaryKey(),
    item: varchar("item", { length: 256 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    completed: boolean("completed").default(false).notNull(),
    completedById: text("completed_by_id").references(() => user.id, { onDelete: "set null" }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [index("onx_launch_checklist_category_idx").on(table.category)],
);

export const postLaunchMonitoring = createTable(
  "post_launch_monitoring",
  {
    id: serial("id").primaryKey(),
    metric: varchar("metric", { length: 100 }).notNull(),
    value: varchar("value", { length: 100 }).notNull(),
    threshold: varchar("threshold", { length: 100 }),
    isHealthy: boolean("is_healthy").default(true),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
);

// ═══════════════════════════════════════════════════════════
// TRAIN Z — Stewardship & Continuity
// ═══════════════════════════════════════════════════════════

export const stewardshipRecord = createTable(
  "stewardship_record",
  {
    id: serial("id").primaryKey(),
    stewardId: text("steward_id").references(() => user.id, { onDelete: "set null" }),
    responsibility: varchar("responsibility", { length: 256 }).notNull(),
    scope: varchar("scope", { length: 100 }),
    status: varchar("status", { length: 20 }).default("active").notNull(),
    handoffNotes: text("handoff_notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
);

export const continuityPlan = createTable(
  "continuity_plan",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    scenario: varchar("scenario", { length: 256 }).notNull(),
    plan: text("plan").notNull(),
    status: varchar("status", { length: 20 }).default("draft").notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
);

// ═══════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════

export type Retrospective = typeof retrospective.$inferSelect;
export type ImprovementBacklog = typeof improvementBacklog.$inferSelect;
export type PatternDetection = typeof patternDetection.$inferSelect;
export type Recommendation = typeof recommendation.$inferSelect;
export type EditorialPolicy = typeof editorialPolicy.$inferSelect;
export type ContentReview = typeof contentReview.$inferSelect;
export type PublicationSchedule = typeof publicationSchedule.$inferSelect;
export type TitanMonitoringLog = typeof titanMonitoringLog.$inferSelect;
export type TitanMaintenance = typeof titanMaintenance.$inferSelect;
export type InstitutionSetting = typeof institutionSetting.$inferSelect;
export type MemberManagement = typeof memberManagement.$inferSelect;
export type SecurityAudit = typeof securityAudit.$inferSelect;
export type VulnerabilityTracking = typeof vulnerabilityTracking.$inferSelect;
export type OperationalMetric = typeof operationalMetric.$inferSelect;
export type SystemHealth = typeof systemHealth.$inferSelect;
export type ReleaseRecord = typeof releaseRecord.$inferSelect;
export type DeploymentTracking = typeof deploymentTracking.$inferSelect;
export type DataGovernanceRule = typeof dataGovernanceRule.$inferSelect;
export type DataQualityCheck = typeof dataQualityCheck.$inferSelect;
export type PerformanceMetric = typeof performanceMetric.$inferSelect;
export type LoadTestResult = typeof loadTestResult.$inferSelect;
export type TrainingMaterial = typeof trainingMaterial.$inferSelect;
export type OnboardingFlow = typeof onboardingFlow.$inferSelect;
export type AuditLog = typeof auditLog.$inferSelect;
export type ComplianceCheck = typeof complianceCheck.$inferSelect;
export type LaunchChecklist = typeof launchChecklist.$inferSelect;
export type PostLaunchMonitoring = typeof postLaunchMonitoring.$inferSelect;
export type StewardshipRecord = typeof stewardshipRecord.$inferSelect;
export type ContinuityPlan = typeof continuityPlan.$inferSelect;
