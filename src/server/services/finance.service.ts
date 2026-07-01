/**
 * OCMBR Wave 1 — D03-S01 Service Layer
 * Finance Service: Chart of Accounts Manager
 * IU-ID: D03-S01-IU-API (service component)
 */

import { TRPCError } from "@trpc/server";
import { and, eq, ilike } from "drizzle-orm";
import { db } from "@/server/db";
import type { NewAccount } from "@/server/db/schema/finance-foundation";
import { coaAccount } from "@/server/db/schema/finance-foundation";

export const ACCOUNT_TYPES = [
  "ASSET",
  "LIABILITY",
  "EQUITY",
  "REVENUE",
  "EXPENSE",
] as const;

export async function listAccounts(opts?: {
  accountType?: string;
  branchId?: number;
  activeOnly?: boolean;
  search?: string;
}) {
  const conditions = [];
  if (opts?.activeOnly !== false)
    conditions.push(eq(coaAccount.isActive, true));
  if (opts?.accountType)
    conditions.push(eq(coaAccount.accountType, opts.accountType));
  if (opts?.branchId !== undefined)
    conditions.push(eq(coaAccount.branchId, opts.branchId));
  if (opts?.search) {
    conditions.push(ilike(coaAccount.name, `%${opts.search}%`));
  }
  const q = db.select().from(coaAccount).orderBy(coaAccount.code);
  return conditions.length > 0 ? q.where(and(...conditions)) : q;
}

export async function getAccountById(id: number) {
  const [row] = await db.select().from(coaAccount).where(eq(coaAccount.id, id));
  return row ?? null;
}

export async function getAccountByCode(code: string) {
  const [row] = await db
    .select()
    .from(coaAccount)
    .where(eq(coaAccount.code, code));
  return row ?? null;
}

export async function createAccount(
  input: Omit<NewAccount, "id" | "createdAt" | "updatedAt">,
) {
  const [dup] = await db
    .select({ id: coaAccount.id })
    .from(coaAccount)
    .where(eq(coaAccount.code, input.code));
  if (dup)
    throw new TRPCError({
      code: "CONFLICT",
      message: "Account code already exists",
    });
  if (
    !ACCOUNT_TYPES.includes(input.accountType as (typeof ACCOUNT_TYPES)[number])
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid account type: ${input.accountType}`,
    });
  }
  const [result] = await db.insert(coaAccount).values(input).returning();
  return result;
}

export async function updateAccount(
  id: number,
  input: Partial<Omit<NewAccount, "id" | "createdAt">>,
) {
  const existing = await getAccountById(id);
  if (!existing)
    throw new TRPCError({ code: "NOT_FOUND", message: "Account not found" });
  if (existing.isSystemAccount) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "System accounts cannot be modified",
    });
  }
  const rows = await db
    .update(coaAccount)
    .set(input)
    .where(eq(coaAccount.id, id))
    .returning();
  return rows[0];
}

export async function deactivateAccount(id: number) {
  const existing = await getAccountById(id);
  if (!existing)
    throw new TRPCError({ code: "NOT_FOUND", message: "Account not found" });
  if (existing.isSystemAccount) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "System accounts cannot be deactivated",
    });
  }
  const rows = await db
    .update(coaAccount)
    .set({ isActive: false })
    .where(eq(coaAccount.id, id))
    .returning();
  return rows[0];
}

/** Seed default Chart of Accounts for a branch */
export async function seedDefaultCoA(branchId: number) {
  const defaults: Omit<NewAccount, "id" | "createdAt" | "updatedAt">[] = [
    {
      code: "1000",
      name: "Cash and Bank",
      accountType: "ASSET",
      level: 1,
      isSystemAccount: true,
      branchId,
    },
    {
      code: "1100",
      name: "Accounts Receivable",
      accountType: "ASSET",
      level: 1,
      isSystemAccount: true,
      branchId,
    },
    {
      code: "1200",
      name: "Inventory",
      accountType: "ASSET",
      level: 1,
      isSystemAccount: true,
      branchId,
    },
    {
      code: "2000",
      name: "Accounts Payable",
      accountType: "LIABILITY",
      level: 1,
      isSystemAccount: true,
      branchId,
    },
    {
      code: "3000",
      name: "Owner Equity",
      accountType: "EQUITY",
      level: 1,
      isSystemAccount: true,
      branchId,
    },
    {
      code: "4000",
      name: "Revenue",
      accountType: "REVENUE",
      level: 1,
      isSystemAccount: true,
      branchId,
    },
    {
      code: "5000",
      name: "Cost of Goods Sold",
      accountType: "EXPENSE",
      level: 1,
      isSystemAccount: true,
      branchId,
    },
    {
      code: "6000",
      name: "Operating Expenses",
      accountType: "EXPENSE",
      level: 1,
      isSystemAccount: true,
      branchId,
    },
  ];
  const results = [];
  for (const acc of defaults) {
    const existing = await getAccountByCode(acc.code);
    if (!existing) {
      const [created] = await db.insert(coaAccount).values(acc).returning();
      results.push(created);
    }
  }
  return results;
}
