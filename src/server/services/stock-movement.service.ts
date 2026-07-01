/**
 * OCMBR Wave 2 — D05-S04 IU-API (Service)
 * Stock Movement (In / Out / Transfer / Adjustment) service
 */

import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import type {
  NewStockMovement,
  StockBalance,
} from "@/server/db/schema/stock-movement-foundation";
import {
  stockBalance,
  stockMovement,
} from "@/server/db/schema/stock-movement-foundation";

// ── Stock Movements ───────────────────────────────────────────────────────────

export async function listStockMovements(
  branchId: number,
  opts?: { itemId?: number; movementType?: string; limit?: number },
) {
  const conditions = [eq(stockMovement.branchId, branchId)];
  if (opts?.itemId) conditions.push(eq(stockMovement.itemId, opts.itemId));
  if (opts?.movementType)
    conditions.push(eq(stockMovement.movementType, opts.movementType));
  return db
    .select()
    .from(stockMovement)
    .where(and(...conditions))
    .orderBy(desc(stockMovement.createdAt))
    .limit(opts?.limit ?? 100);
}

export async function getStockMovementById(id: number) {
  const rows = await db
    .select()
    .from(stockMovement)
    .where(eq(stockMovement.id, id));
  return rows[0] ?? null;
}

export async function recordStockMovement(
  input: Omit<NewStockMovement, "id" | "createdAt">,
) {
  const existing = await db
    .select({ id: stockMovement.id })
    .from(stockMovement)
    .where(eq(stockMovement.movementNumber, input.movementNumber));
  if (existing.length > 0)
    throw new TRPCError({
      code: "CONFLICT",
      message: "Movement number already exists",
    });

  const [mvt] = await db.insert(stockMovement).values(input).returning();

  // Update or upsert stock balance
  const qty = Number(input.quantity);
  const isIn = ["IN", "OPENING"].includes(input.movementType);
  const delta = isIn ? qty : -qty;

  const existing_bal = await db
    .select()
    .from(stockBalance)
    .where(
      and(
        eq(stockBalance.itemId, input.itemId),
        eq(stockBalance.branchId, input.branchId),
      ),
    );

  if (existing_bal.length === 0) {
    await db.insert(stockBalance).values({
      itemId: input.itemId,
      branchId: input.branchId,
      quantityOnHand: String(Math.max(0, delta)),
      quantityReserved: "0",
      lastMovementAt: new Date(),
    });
  } else {
    const currentQty = Number(existing_bal[0]?.quantityOnHand ?? 0);
    const newQty = Math.max(0, currentQty + delta);
    await db
      .update(stockBalance)
      .set({
        quantityOnHand: String(newQty),
        lastMovementAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(stockBalance.itemId, input.itemId),
          eq(stockBalance.branchId, input.branchId),
        ),
      );
  }

  return mvt;
}

// ── Stock Balance ─────────────────────────────────────────────────────────────

export async function getStockBalance(
  itemId: number,
  branchId: number,
): Promise<StockBalance | null> {
  const rows = await db
    .select()
    .from(stockBalance)
    .where(
      and(eq(stockBalance.itemId, itemId), eq(stockBalance.branchId, branchId)),
    );
  return rows[0] ?? null;
}

export async function listStockBalances(branchId: number) {
  return db
    .select()
    .from(stockBalance)
    .where(eq(stockBalance.branchId, branchId));
}
