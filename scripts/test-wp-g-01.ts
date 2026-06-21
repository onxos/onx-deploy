import { readFileSync } from "node:fs";
import { TRPCError } from "@trpc/server";
import {
  assertArticleMutationAllowed,
  createArticleInputSchema,
  updateArticleInputSchema,
} from "@/server/api/routers/civilization-article-contract";
import { hasPermission } from "@/server/auth/rbac";

type Scenario = {
  id: string;
  actual: boolean | string;
  expected: boolean | string;
};

const validArticle = {
  title: "Civilization Article",
  slug: "civilization-article",
  category: "civilization",
  content: "Civilization knowledge article body.",
};
const routerSource = readFileSync(
  "src/server/api/routers/civilization.ts",
  "utf8",
);

function isValidCreate(input: unknown) {
  return createArticleInputSchema.safeParse(input).success;
}

function isValidUpdate(input: unknown) {
  return updateArticleInputSchema.safeParse(input).success;
}

function authorizationResult(
  options: Parameters<typeof assertArticleMutationAllowed>[0],
) {
  try {
    assertArticleMutationAllowed(options);
    return "ALLOW";
  } catch (error) {
    if (error instanceof TRPCError) {
      return error.code;
    }
    throw error;
  }
}

const scenarios: Scenario[] = [
  {
    id: "AC-01-create-valid-article",
    actual: isValidCreate(validArticle),
    expected: true,
  },
  {
    id: "AC-02-reject-invalid-title",
    actual: isValidCreate({ ...validArticle, title: "No" }),
    expected: false,
  },
  {
    id: "AC-03-reject-invalid-slug",
    actual: isValidCreate({ ...validArticle, slug: "" }),
    expected: false,
  },
  {
    id: "AC-04-reject-noncanonical-slug",
    actual: isValidCreate({ ...validArticle, slug: "Civilization Article" }),
    expected: false,
  },
  {
    id: "AC-05-reject-short-content",
    actual: isValidCreate({ ...validArticle, content: "short" }),
    expected: false,
  },
  {
    id: "AC-06-operator-create-allowed",
    actual: hasPermission("operator", "article:create"),
    expected: true,
  },
  {
    id: "AC-07-owner-update-allowed",
    actual: authorizationResult({
      action: "update",
      actorId: "owner-1",
      actorRole: "operator",
      ownerId: "owner-1",
    }),
    expected: "ALLOW",
  },
  {
    id: "AC-08-non-owner-update-denied",
    actual: authorizationResult({
      action: "update",
      actorId: "operator-1",
      actorRole: "operator",
      ownerId: "owner-1",
    }),
    expected: "FORBIDDEN",
  },
  {
    id: "AC-09-editor-update-allowed",
    actual: authorizationResult({
      action: "update",
      actorId: "editor-1",
      actorRole: "editor",
      ownerId: "owner-1",
    }),
    expected: "ALLOW",
  },
  {
    id: "AC-10-owner-delete-allowed",
    actual: authorizationResult({
      action: "delete",
      actorId: "owner-1",
      actorRole: "operator",
      ownerId: "owner-1",
    }),
    expected: "ALLOW",
  },
  {
    id: "AC-11-admin-delete-allowed",
    actual: authorizationResult({
      action: "delete",
      actorId: "admin-1",
      actorRole: "admin",
      ownerId: "owner-1",
    }),
    expected: "ALLOW",
  },
  {
    id: "AC-12-editor-delete-denied",
    actual: authorizationResult({
      action: "delete",
      actorId: "editor-1",
      actorRole: "editor",
      ownerId: "owner-1",
    }),
    expected: "FORBIDDEN",
  },
  {
    id: "AC-13-unauthorized-delete-denied",
    actual: authorizationResult({
      action: "delete",
      actorId: "operator-1",
      actorRole: "operator",
      ownerId: "owner-1",
    }),
    expected: "FORBIDDEN",
  },
  {
    id: "AC-14-partial-update-supported",
    actual: isValidUpdate({ id: 1, title: "Updated Article" }),
    expected: true,
  },
  {
    id: "AC-15-empty-update-rejected",
    actual: isValidUpdate({ id: 1 }),
    expected: false,
  },
  {
    id: "AC-16-soft-delete-contract-verified",
    actual:
      routerSource.includes(".set({ deletedAt: new Date() })") &&
      !routerSource.includes(".delete(knowledgeArticles)"),
    expected: true,
  },
];

const results = scenarios.map((scenario) => ({
  ...scenario,
  ok: scenario.actual === scenario.expected,
}));
const failed = results.filter((result) => !result.ok);

console.log(
  JSON.stringify(
    {
      workPackage: "WP-G-01",
      scenarioCount: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      results,
    },
    null,
    2,
  ),
);

if (failed.length > 0) {
  console.error("WP-G-01 scenario failures:");
  for (const failure of failed) {
    console.error(
      `- ${failure.id}: expected ${failure.expected}, got ${failure.actual}`,
    );
  }
  process.exit(1);
}
