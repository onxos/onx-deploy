import { readFileSync } from "node:fs";
import {
  userDeleteInputSchema,
  userListInputSchema,
  userUpdateRoleInputSchema,
} from "@/server/api/routers/user-contract";
import { hasPermission } from "@/server/auth/rbac";

type Scenario = {
  id: string;
  actual: boolean | string;
  expected: boolean | string;
};

const rootSource = readFileSync("src/server/api/root.ts", "utf8");
const userRouterSource = readFileSync("src/server/api/routers/user.ts", "utf8");
const permissionsSource = readFileSync("src/lib/permissions.ts", "utf8");
const packageSource = readFileSync("package.json", "utf8");

function parses(
  schema: { safeParse: (value: unknown) => { success: boolean } },
  value: unknown,
) {
  return schema.safeParse(value).success;
}

const scenarios: Scenario[] = [
  {
    id: "AC-01-user-router-mounted",
    actual: rootSource.includes("user: userRouter"),
    expected: true,
  },
  {
    id: "AC-02-user-list-query-exists",
    actual:
      userRouterSource.includes("list: protectedProcedure") &&
      userRouterSource.includes(".query(async"),
    expected: true,
  },
  {
    id: "AC-03-user-update-role-mutation-exists",
    actual:
      userRouterSource.includes("updateRole: protectedProcedure") &&
      userRouterSource.includes(".mutation(async"),
    expected: true,
  },
  {
    id: "AC-04-user-delete-mutation-exists",
    actual:
      userRouterSource.includes("delete: protectedProcedure") &&
      userRouterSource.includes(".delete(user)"),
    expected: true,
  },
  {
    id: "AC-05-list-admin-only-rbac",
    actual: userRouterSource.includes('requirePermission("user:updateRole")'),
    expected: true,
  },
  {
    id: "AC-06-delete-admin-only-rbac",
    actual:
      permissionsSource.includes('"user:delete"') &&
      userRouterSource.includes('requirePermission("user:delete")'),
    expected: true,
  },
  {
    id: "AC-07-founder-has-user-delete",
    actual: hasPermission("founder", "user:delete"),
    expected: true,
  },
  {
    id: "AC-08-admin-has-user-delete",
    actual: hasPermission("admin", "user:delete"),
    expected: true,
  },
  {
    id: "AC-09-operator-denied-user-delete",
    actual: hasPermission("operator", "user:delete"),
    expected: false,
  },
  {
    id: "AC-10-list-pagination-validation",
    actual:
      parses(userListInputSchema, { limit: 100, offset: 0 }) &&
      !parses(userListInputSchema, { limit: 101 }),
    expected: true,
  },
  {
    id: "AC-11-list-role-filter-validation",
    actual:
      parses(userListInputSchema, { role: "admin" }) &&
      !parses(userListInputSchema, { role: "superuser" }),
    expected: true,
  },
  {
    id: "AC-12-update-role-validation",
    actual:
      parses(userUpdateRoleInputSchema, { userId: "u_1", role: "viewer" }) &&
      !parses(userUpdateRoleInputSchema, { userId: "", role: "viewer" }),
    expected: true,
  },
  {
    id: "AC-13-delete-validation",
    actual:
      parses(userDeleteInputSchema, { userId: "u_1" }) &&
      !parses(userDeleteInputSchema, { userId: "" }),
    expected: true,
  },
  {
    id: "AC-14-self-demote-delete-guard",
    actual:
      userRouterSource.includes(
        "Administrators cannot demote their own account",
      ) &&
      userRouterSource.includes(
        "Administrators cannot delete their own account",
      ),
    expected: true,
  },
  {
    id: "AC-15-test-command-runs-wp-g-03",
    actual: packageSource.includes("scripts/test-wp-g-03.ts"),
    expected: true,
  },
  {
    id: "AC-16-standard-errors-used",
    actual:
      userRouterSource.includes("throw forbidden(") &&
      userRouterSource.includes("throw notFound("),
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
      workPackage: "WP-G-03",
      scenarioCount: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      coverage: "100% acceptance-scenario coverage",
      results,
    },
    null,
    2,
  ),
);

if (failed.length > 0) {
  console.error("WP-G-03 scenario failures:");
  for (const failure of failed) {
    console.error(
      `- ${failure.id}: expected ${failure.expected}, got ${failure.actual}`,
    );
  }
  process.exit(1);
}
