/**
 * OCMBR Wave 2f — D08-S03 IU-API
 * Discount & Coupon Engine tRPC router
 */
import { z } from "zod";
import { requirePermission } from "@/server/api/middleware/rbac";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as svc from "@/server/services/discount.service";

export const discountRouter = createTRPCRouter({
  listDiscountRules: protectedProcedure
    .use(requirePermission("discount:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listDiscountRules(input.branchId)),

  getDiscountRule: protectedProcedure
    .use(requirePermission("discount:read"))
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => svc.getDiscountRuleById(input.id)),

  createDiscountRule: protectedProcedure
    .use(requirePermission("discount:write"))
    .input(
      z.object({
        branchId: z.number().int().positive(),
        name: z.string().min(1),
        description: z.string().optional(),
        discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "BUY_X_GET_Y"]),
        discountValue: z
          .number()
          .positive()
          .transform((v) => String(v)),
        minOrderValue: z
          .number()
          .nonnegative()
          .transform((v) => String(v))
          .optional(),
        maxDiscountCap: z
          .number()
          .nonnegative()
          .transform((v) => String(v))
          .optional(),
        applicableTo: z.enum(["ALL", "CATEGORY", "ITEM"]).optional(),
        applicableEntityId: z.number().int().positive().optional(),
        startDate: z.string().length(10).optional(),
        endDate: z.string().length(10).optional(),
        usageLimit: z.number().int().positive().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createDiscountRule(input)),

  deactivateDiscountRule: protectedProcedure
    .use(requirePermission("discount:write"))
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => svc.deactivateDiscountRule(input.id)),

  listCoupons: protectedProcedure
    .use(requirePermission("discount:read"))
    .input(z.object({ branchId: z.number().int().positive() }))
    .query(({ input }) => svc.listCoupons(input.branchId)),

  createCoupon: protectedProcedure
    .use(requirePermission("discount:write"))
    .input(
      z.object({
        code: z.string().min(1),
        discountRuleId: z.number().int().positive(),
        branchId: z.number().int().positive(),
        singleUse: z.boolean().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(({ input }) => svc.createCoupon(input)),

  getCouponByCode: protectedProcedure
    .use(requirePermission("discount:read"))
    .input(z.object({ code: z.string().min(1) }))
    .query(({ input }) => svc.getCouponByCode(input.code)),
});
