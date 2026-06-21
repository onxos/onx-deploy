import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  canonicalSlugSchema,
  nonEmptyTrimmedString,
  optionalTrimmedString,
} from "@/server/api/validation";
import { hasMinimumRole, hasPermission } from "@/server/auth/rbac";

export const articleCategorySchema = z.enum([
  "approval-archive",
  "ccmr-graph",
  "civilization",
  "constitution",
  "correction-archive",
  "founder",
  "gap",
  "hadeer",
  "pulse",
  "registry",
  "sech",
  "system",
  "va-capabilities",
]);

const articleImportanceSchema = z.enum(["critical", "standard", "reference"]);

export const createArticleInputSchema = z.object({
  title: nonEmptyTrimmedString(200).pipe(z.string().min(3)),
  slug: canonicalSlugSchema,
  category: articleCategorySchema,
  content: nonEmptyTrimmedString(20_000).pipe(z.string().min(10)),
  documentRef: optionalTrimmedString(100),
  importance: articleImportanceSchema.default("standard"),
});

export const updateArticleInputSchema = z
  .object({
    id: z.number().int().positive(),
    title: nonEmptyTrimmedString(200).pipe(z.string().min(3)).optional(),
    slug: canonicalSlugSchema.optional(),
    category: articleCategorySchema.optional(),
    content: nonEmptyTrimmedString(20_000).pipe(z.string().min(10)).optional(),
    documentRef: optionalTrimmedString(100),
    importance: articleImportanceSchema.optional(),
  })
  .refine(
    ({ id: _id, ...updates }) =>
      Object.values(updates).some((value) => value !== undefined),
    { message: "At least one article field must be provided" },
  );

export function assertArticleMutationAllowed(options: {
  action: "update" | "delete";
  actorId: string;
  actorRole: string;
  ownerId: string | null;
}) {
  const isOwner = options.ownerId === options.actorId;
  const hasRole =
    options.action === "update"
      ? hasMinimumRole(options.actorRole, "editor") &&
        hasPermission(options.actorRole, "article:update")
      : hasMinimumRole(options.actorRole, "admin") &&
        hasPermission(options.actorRole, "article:delete");

  if (!isOwner && !hasRole) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        options.action === "update"
          ? "Article owner or editor role required"
          : "Article owner or admin role required",
    });
  }
}
