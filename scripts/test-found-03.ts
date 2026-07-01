/**
 * OCMBR Foundation Test — FOUND-IU-03
 * Verifies: Branch-RBAC schema, service, and router files exist.
 *
 * Run: bun run scripts/test-found-03.ts
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
  {
    id: "01",
    description: "branch-rbac-foundation schema file exists",
    pass: fileExists("src/server/db/schema/branch-rbac-foundation.ts"),
  },
  {
    id: "02",
    description: "onx_user_branch_role table defined",
    pass: includes(
      "src/server/db/schema/branch-rbac-foundation.ts",
      "onx_user_branch_role",
    ),
  },
  {
    id: "03",
    description: "onx_user_tenant_membership table defined",
    pass: includes(
      "src/server/db/schema/branch-rbac-foundation.ts",
      "onx_user_tenant_membership",
    ),
  },
  {
    id: "04",
    description: "onx_branch_role_permission table defined",
    pass: includes(
      "src/server/db/schema/branch-rbac-foundation.ts",
      "onx_branch_role_permission",
    ),
  },
  {
    id: "05",
    description: "branch-rbac schema exported from barrel",
    pass: includes("src/server/db/schema.ts", "branch-rbac-foundation"),
  },
  {
    id: "06",
    description: "branch-rbac.service.ts exists",
    pass: fileExists("src/server/services/branch-rbac.service.ts"),
  },
  {
    id: "07",
    description: "grantBranchRole function defined",
    pass: includes(
      "src/server/services/branch-rbac.service.ts",
      "grantBranchRole",
    ),
  },
  {
    id: "08",
    description: "revokeBranchRole function defined",
    pass: includes(
      "src/server/services/branch-rbac.service.ts",
      "revokeBranchRole",
    ),
  },
  {
    id: "09",
    description: "checkBranchPermission function defined",
    pass: includes(
      "src/server/services/branch-rbac.service.ts",
      "checkBranchPermission",
    ),
  },
  {
    id: "10",
    description: "seedDefaultBranchPermissions function defined",
    pass: includes(
      "src/server/services/branch-rbac.service.ts",
      "seedDefaultBranchPermissions",
    ),
  },
  {
    id: "11",
    description: "tRPC branch-rbac router exists",
    pass: fileExists("src/server/api/routers/branch-rbac.ts"),
  },
  {
    id: "12",
    description: "branchRbacRouter exported from router file",
    pass: includes("src/server/api/routers/branch-rbac.ts", "branchRbacRouter"),
  },
  {
    id: "13",
    description: "branchRbac router registered in appRouter root",
    pass: includes("src/server/api/root.ts", "branchRbac: branchRbacRouter"),
  },
  {
    id: "14",
    description: "rbac:manage permission defined",
    pass: includes("src/lib/permissions.ts", "rbac:manage"),
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

const dir = join(ROOT, `EVIDENCE/OCMBR-003/${timestamp}/test`);
mkdirSync(dir, { recursive: true });
writeFileSync(
  join(dir, `EV-TEST_FOUND-IU-03_${timestamp}_results.txt`),
  `${lines.join("\n")}\nALL ${scenarios.length} SCENARIOS PASS\n`,
);
console.log(`\nALL ${scenarios.length} scenarios PASS ✓`);
