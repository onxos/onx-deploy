import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewBudgetLine,
  NewCashFlowForecast,
  NewFinancialPeriodClose,
  NewOffboardingRecord,
  NewTaxRule,
} from "@/server/db/schema/finance-extended-foundation";
import {
  budgetLine,
  cashFlowForecast,
  financialPeriodClose,
  offboardingRecord,
  taxRule,
} from "@/server/db/schema/finance-extended-foundation";

// D02-S10 Offboarding
export const listOffboarding = (status?: string) =>
  status
    ? db
        .select()
        .from(offboardingRecord)
        .where(eq(offboardingRecord.status, status))
    : db.select().from(offboardingRecord);

export async function createOffboarding(
  input: Omit<NewOffboardingRecord, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(offboardingRecord).values(input).returning();
  return row;
}

export async function completeOffboarding(id: number) {
  const [row] = await db
    .update(offboardingRecord)
    .set({
      status: "COMPLETED",
      clearanceStatus: "CLEARED",
      updatedAt: new Date(),
    })
    .where(eq(offboardingRecord.id, id))
    .returning();
  return row;
}

// D03-S07 Budget
export const listBudgetLines = (year?: string, branchId?: string) => {
  if (year && branchId)
    return db
      .select()
      .from(budgetLine)
      .where(
        and(eq(budgetLine.budgetYear, year), eq(budgetLine.branchId, branchId)),
      );
  if (year)
    return db.select().from(budgetLine).where(eq(budgetLine.budgetYear, year));
  return db.select().from(budgetLine);
};

export async function createBudgetLine(
  input: Omit<NewBudgetLine, "id" | "createdAt" | "updatedAt">,
) {
  const [row] = await db.insert(budgetLine).values(input).returning();
  return row;
}

export async function updateBudgetActual(id: number, actualAmount: string) {
  const [row] = await db
    .update(budgetLine)
    .set({
      actualAmount,
      variance: String(parseFloat(actualAmount) - 0),
      updatedAt: new Date(),
    })
    .where(eq(budgetLine.id, id))
    .returning();
  return row;
}

// D03-S08 Cash Flow
export const listCashFlowForecasts = (period?: string) =>
  period
    ? db
        .select()
        .from(cashFlowForecast)
        .where(eq(cashFlowForecast.period, period))
    : db.select().from(cashFlowForecast);

export async function createCashFlowForecast(
  input: Omit<NewCashFlowForecast, "id" | "createdAt">,
) {
  const [row] = await db.insert(cashFlowForecast).values(input).returning();
  return row;
}

// D03-S09 Period Close
export const listPeriodCloses = () => db.select().from(financialPeriodClose);

export async function closePeriod(
  year: string,
  month: string,
  closedBy: string,
  notes?: string,
) {
  const [row] = await db
    .insert(financialPeriodClose)
    .values({
      year,
      month,
      status: "CLOSED",
      closedBy,
      closedAt: new Date(),
      notes,
    })
    .returning();
  return row;
}

export async function reopenPeriod(id: number, reopenedBy: string) {
  const [row] = await db
    .update(financialPeriodClose)
    .set({ status: "OPEN", reopenedBy, reopenedAt: new Date() })
    .where(eq(financialPeriodClose.id, id))
    .returning();
  return row;
}

// D03-S10 Tax
export const listTaxRules = (taxType?: string) =>
  taxType
    ? db.select().from(taxRule).where(eq(taxRule.taxType, taxType))
    : db.select().from(taxRule);

export async function createTaxRule(
  input: Omit<NewTaxRule, "id" | "createdAt">,
) {
  const [row] = await db.insert(taxRule).values(input).returning();
  return row;
}
