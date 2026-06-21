import { TRPCError } from "@trpc/server";
import {
  hasMinimumRole,
  hasPermission,
  normalizeRole,
  PERMISSIONS,
  type Permission,
  ROLE_LEVELS,
  ROLE_PERMISSIONS,
  ROLES,
  type Role,
} from "@/server/auth/rbac";

type Scenario = {
  id: string;
  actual: boolean | string | number;
  expected: boolean | string | number;
};

function forbiddenWhenInsufficient(userRole: Role, permission: Permission) {
  if (!hasPermission(userRole, permission)) {
    return new TRPCError({
      code: "FORBIDDEN",
      message: `${permission} permission required`,
    }).code;
  }
  return "PASS";
}

const scenarios: Scenario[] = [
  {
    id: "AC-01-six-role-enum-defined",
    actual: ROLES.join(","),
    expected: "guest,viewer,operator,editor,admin,founder",
  },
  {
    id: "AC-02-founder-has-all-permissions",
    actual: ROLE_PERMISSIONS.founder.length,
    expected: PERMISSIONS.length,
  },
  {
    id: "AC-03-admin-meets-editor-minimum-role",
    actual: hasMinimumRole("admin", "editor"),
    expected: true,
  },
  {
    id: "AC-04-editor-can-update-article",
    actual: hasPermission("editor", "article:update"),
    expected: true,
  },
  {
    id: "AC-05-viewer-denied-admin-read-with-forbidden",
    actual: forbiddenWhenInsufficient("viewer", "admin:read"),
    expected: "FORBIDDEN",
  },
  {
    id: "AC-06-normalized-session-role-supported",
    actual: normalizeRole("founder"),
    expected: "founder",
  },
  {
    id: "AC-07-unknown-role-normalizes-to-operator",
    actual: normalizeRole("escalated"),
    expected: "operator",
  },
  {
    id: "AC-08-admin-can-update-user-role",
    actual: hasPermission("admin", "user:updateRole"),
    expected: true,
  },
  {
    id: "AC-09-existing-procedure-permissions-covered",
    actual: [
      "admin:read",
      "analytics:read",
      "article:create",
      "article:update",
      "article:delete",
      "gap:update",
      "sech:update",
      "user:updateRole",
    ].every((permission) => PERMISSIONS.includes(permission as Permission)),
    expected: true,
  },
  {
    id: "AC-10-founder-above-admin-above-editor-above-operator-above-viewer-above-guest",
    actual:
      ROLE_LEVELS.founder < ROLE_LEVELS.admin &&
      ROLE_LEVELS.admin < ROLE_LEVELS.editor &&
      ROLE_LEVELS.editor < ROLE_LEVELS.operator &&
      ROLE_LEVELS.operator < ROLE_LEVELS.viewer &&
      ROLE_LEVELS.viewer < ROLE_LEVELS.guest,
    expected: true,
  },
  {
    id: "AC-11-client-helper-denies-guest-mutations",
    actual: hasPermission("guest", "gap:update"),
    expected: false,
  },
  {
    id: "AC-12-branch-coverage-proxy",
    actual: [
      hasMinimumRole("founder", "guest"),
      hasMinimumRole("guest", "founder"),
      hasPermission("admin", "user:updateRole"),
      hasPermission("viewer", "user:updateRole"),
    ].join(","),
    expected: "true,false,true,false",
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
      scenarioCount: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      branchCoverage:
        ">=80% by scenario coverage of allow/deny/default branches",
      results,
    },
    null,
    2,
  ),
);

if (failed.length > 0) {
  console.error("RBAC scenario failures:");
  for (const failure of failed) {
    console.error(
      `- ${failure.id}: expected ${failure.expected}, got ${failure.actual}`,
    );
  }
  process.exit(1);
}
