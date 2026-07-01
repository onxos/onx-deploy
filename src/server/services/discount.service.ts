/**
 * OCMBR Wave 2f — D08-S03 IU-SVC
 * Discount & Coupon Engine service
 */
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  coupon,
  discountRule,
  type NewCoupon,
  type NewDiscountRule,
} from "@/server/db/schema";

export function listDiscountRules(branchId: number) {
  return db
    .select()
    .from(discountRule)
    .where(eq(discountRule.branchId, branchId))
    .orderBy(discountRule.name);
}

export function getDiscountRuleById(id: number) {
  return db.select().from(discountRule).where(eq(discountRule.id, id));
}

export async function createDiscountRule(input: NewDiscountRule) {
  const [result] = await db.insert(discountRule).values(input).returning();
  return result;
}

export async function deactivateDiscountRule(id: number) {
  const [result] = await db
    .update(discountRule)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(discountRule.id, id))
    .returning();
  return result;
}

export function listCoupons(branchId: number) {
  return db.select().from(coupon).where(eq(coupon.branchId, branchId));
}

export async function createCoupon(input: NewCoupon) {
  const [result] = await db.insert(coupon).values(input).returning();
  return result;
}

export function getCouponByCode(code: string) {
  return db.select().from(coupon).where(eq(coupon.code, code));
}
