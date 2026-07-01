import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewApprovalMatrix,
  NewBoardResolution,
  NewExecDashboardKpi,
  NewLanguageConfig,
  NewTenantOnboarding,
} from "@/server/db/schema/executive-foundation";
import {
  approvalMatrix,
  boardResolution,
  execDashboardKpi,
  languageConfig,
  tenantOnboarding,
} from "@/server/db/schema/executive-foundation";

// D01-S01 Exec Dashboard
export async function listExecKpis(branchId?: string) {
  if (branchId) {
    return db
      .select()
      .from(execDashboardKpi)
      .where(eq(execDashboardKpi.branchId, branchId));
  }
  return db.select().from(execDashboardKpi);
}

export async function upsertExecKpi(
  input: Omit<NewExecDashboardKpi, "id" | "createdAt">,
) {
  const [row] = await db.insert(execDashboardKpi).values(input).returning();
  return row;
}

// D01-S02 Approval Authority Matrix
export async function listApprovalMatrix(entityType?: string) {
  if (entityType) {
    return db
      .select()
      .from(approvalMatrix)
      .where(eq(approvalMatrix.entityType, entityType));
  }
  return db.select().from(approvalMatrix);
}

export async function createApprovalMatrix(
  input: Omit<NewApprovalMatrix, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(approvalMatrix).values(input).returning();
  return row;
}

export async function updateApprovalMatrix(
  id: number,
  patch: Partial<Omit<NewApprovalMatrix, "id" | "createdAt">>,
) {
  const [row] = await db
    .update(approvalMatrix)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(approvalMatrix.id, id))
    .returning();
  return row;
}

// D01-S03 Board Resolutions
export async function listResolutions(category?: string) {
  if (category) {
    return db
      .select()
      .from(boardResolution)
      .where(eq(boardResolution.category, category));
  }
  return db.select().from(boardResolution);
}

export async function createResolution(
  input: Omit<NewBoardResolution, "id" | "createdAt">,
) {
  const [row] = await db.insert(boardResolution).values(input).returning();
  return row;
}

export async function getResolution(resolutionNo: string) {
  const rows = await db
    .select()
    .from(boardResolution)
    .where(eq(boardResolution.resolutionNo, resolutionNo));
  return rows[0] ?? null;
}

// D15-S09 Language Config
export async function listLanguageConfigs(tenantId?: string) {
  if (tenantId) {
    return db
      .select()
      .from(languageConfig)
      .where(eq(languageConfig.tenantId, tenantId));
  }
  return db.select().from(languageConfig);
}

export async function createLanguageConfig(
  input: Omit<NewLanguageConfig, "id" | "createdAt">,
) {
  const [row] = await db.insert(languageConfig).values(input).returning();
  return row;
}

// D15-S10 Tenant Onboarding
export async function listOnboardingSteps(tenantId: string) {
  return db
    .select()
    .from(tenantOnboarding)
    .where(eq(tenantOnboarding.tenantId, tenantId));
}

export async function createOnboardingStep(
  input: Omit<NewTenantOnboarding, "id" | "createdAt">,
) {
  const [row] = await db.insert(tenantOnboarding).values(input).returning();
  return row;
}

export async function completeOnboardingStep(id: number) {
  const [row] = await db
    .update(tenantOnboarding)
    .set({ status: "COMPLETE", completedAt: new Date() })
    .where(eq(tenantOnboarding.id, id))
    .returning();
  return row;
}
