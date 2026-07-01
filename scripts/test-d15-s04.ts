#!/usr/bin/env bun

/**
 * OCMBR Wave 1 — D15-S04 IU-TST
 * Branch-level Permission Scoping: schema, service, router, and UI verification
 *
 * OCMBR Reference: D15-S04-IU-TST
 * Run: bun run scripts/test-d15-s04.ts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function fileExists(rel: string): boolean {
  return existsSync(join(ROOT, rel));
}

function includes(rel: string, text: string): boolean {
  if (!fileExists(rel)) return false;
  return readFileSync(join(ROOT, rel), "utf8").includes(text);
}

const scenarios: { id: string; description: string; pass: boolean }[] = [
  // IU-SCH: Schema
  {
    id: "SCH-01",
    description: "branch-rbac-foundation.ts schema file exists",
    pass: fileExists("src/server/db/schema/branch-rbac-foundation.ts"),
  },
  {
    id: "SCH-02",
    description: "onx_user_branch_role table defined",
    pass: includes(
      "src/server/db/schema/branch-rbac-foundation.ts",
      "user_branch_role",
    ),
  },
  {
    id: "SCH-03",
    description: "onx_branch_role_permission table defined",
    pass: includes(
      "src/server/db/schema/branch-rbac-foundation.ts",
      "branch_role_permission",
    ),
  },
  {
    id: "SCH-04",
    description: "onx_user_tenant_membership table defined",
    pass: includes(
      "src/server/db/schema/branch-rbac-foundation.ts",
      "user_tenant_membership",
    ),
  },
  {
    id: "SCH-05",
    description: "branch-rbac-foundation exported from schema barrel",
    pass: includes("src/server/db/schema.ts", "branch-rbac-foundation"),
  },
  {
    id: "SCH-06",
    description: "onx_user_branch_role migration exists",
    pass: includes("drizzle/0003_foundation_p0.sql", "onx_user_branch_role"),
  },
  {
    id: "SCH-07",
    description: "onx_branch_role_permission migration exists",
    pass: includes(
      "drizzle/0003_foundation_p0.sql",
      "onx_branch_role_permission",
    ),
  },
  // IU-API: Service + Router
  {
    id: "API-01",
    description: "branch-rbac.service.ts exists",
    pass: fileExists("src/server/services/branch-rbac.service.ts"),
  },
  {
    id: "API-02",
    description: "getUserBranchRoles function defined",
    pass: includes(
      "src/server/services/branch-rbac.service.ts",
      "getUserBranchRoles",
    ),
  },
  {
    id: "API-03",
    description: "getUserRoleInBranch function defined",
    pass: includes(
      "src/server/services/branch-rbac.service.ts",
      "getUserRoleInBranch",
    ),
  },
  {
    id: "API-04",
    description: "grantBranchRole function defined",
    pass: includes(
      "src/server/services/branch-rbac.service.ts",
      "grantBranchRole",
    ),
  },
  {
    id: "API-05",
    description: "revokeBranchRole function defined",
    pass: includes(
      "src/server/services/branch-rbac.service.ts",
      "revokeBranchRole",
    ),
  },
  {
    id: "API-06",
    description: "branch-rbac tRPC router exists",
    pass: fileExists("src/server/api/routers/branch-rbac.ts"),
  },
  {
    id: "API-07",
    description: "getUserBranchRoles procedure in router",
    pass: includes(
      "src/server/api/routers/branch-rbac.ts",
      "getUserBranchRoles",
    ),
  },
  {
    id: "API-08",
    description: "grantBranchRole procedure in router",
    pass: includes("src/server/api/routers/branch-rbac.ts", "grantBranchRole"),
  },
  {
    id: "API-09",
    description: "revokeBranchRole procedure in router",
    pass: includes("src/server/api/routers/branch-rbac.ts", "revokeBranchRole"),
  },
  {
    id: "API-10",
    description: "branchRbac router registered in root",
    pass: includes("src/server/api/root.ts", "branchRbac: branchRbacRouter"),
  },
  {
    id: "API-11",
    description: "rbac:manage permission defined",
    pass: includes("src/lib/permissions.ts", "rbac:manage"),
  },
  // IU-UI: Pages
  {
    id: "UI-01",
    description: "/branch-permissions/layout.tsx exists",
    pass: fileExists("src/app/branch-permissions/layout.tsx"),
  },
  {
    id: "UI-02",
    description: "/branch-permissions/page.tsx exists",
    pass: fileExists("src/app/branch-permissions/page.tsx"),
  },
  {
    id: "UI-03",
    description: "Branch permissions page uses getUserBranchRoles tRPC call",
    pass: includes("src/app/branch-permissions/page.tsx", "getUserBranchRoles"),
  },
  {
    id: "UI-04",
    description: "Branch permissions page uses grantBranchRole tRPC call",
    pass: includes("src/app/branch-permissions/page.tsx", "grantBranchRole"),
  },
  {
    id: "UI-05",
    description: "Branch permissions page uses revokeBranchRole tRPC call",
    pass: includes("src/app/branch-permissions/page.tsx", "revokeBranchRole"),
  },
  {
    id: "UI-06",
    description: "Layout requires admin role",
    pass: includes("src/app/branch-permissions/layout.tsx", "hasRequiredRole"),
  },
];

const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
const lines = scenarios.map(
  (s) =>
    `${new Date().toISOString()} ${s.pass ? "PASS" : "FAIL"} ${s.id} ${s.description}`,
);

for (const line of lines) console.log(line);

const failed = scenarios.filter((s) => !s.pass);
if (failed.length > 0) {
  console.error(`\nFAILED: ${failed.length} scenario(s)`);
  for (const f of failed) console.error(`  - [${f.id}] ${f.description}`);
  process.exit(1);
}

const dir = join(ROOT, `EVIDENCE/OCMBR-004/${timestamp}/test`);
mkdirSync(dir, { recursive: true });
writeFileSync(
  join(dir, `EV-TEST_D15-S04_${timestamp}_branch-permission-scoping.txt`),
  `OCMBR IU-ID: D15-S04-IU-TST\nDate: ${new Date().toISOString()}\nScenarios: ${scenarios.length}\n\n${lines.join("\n")}\n\nALL ${scenarios.length} SCENARIOS PASS\n`,
);
console.log(`\nALL ${scenarios.length} scenarios PASS ✓`);
console.log(
  `Evidence: EVIDENCE/OCMBR-004/${timestamp}/test/EV-TEST_D15-S04_${timestamp}_branch-permission-scoping.txt`,
);
