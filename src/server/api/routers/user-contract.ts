import { z } from "zod";
import { ROLES } from "@/server/auth/rbac";

export const userListInputSchema = z
  .object({
    role: z.enum(ROLES).optional(),
    query: z.string().trim().min(1).max(120).optional(),
    limit: z.number().int().min(1).max(100).default(50),
    offset: z.number().int().min(0).default(0),
  })
  .optional();

export const userUpdateRoleInputSchema = z.object({
  userId: z.string().trim().min(1).max(256),
  role: z.enum(ROLES),
});

export const userDeleteInputSchema = z.object({
  userId: z.string().trim().min(1).max(256),
});

export const userOutputSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.enum(ROLES),
  banned: z.boolean().nullable(),
  createdAt: z.date(),
});

export const userListOutputSchema = z.object({
  users: z.array(userOutputSchema),
  pagination: z.object({
    limit: z.number().int(),
    offset: z.number().int(),
  }),
});
