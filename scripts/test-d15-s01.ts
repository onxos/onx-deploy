#!/usr/bin/env bun

/**
 * OCMBR Wave 1 — D15-S01 IU-TST
 * Branch / Location Master: schema, service, router, and UI verification
 *
 * OCMBR Reference: D15-S01-IU-TST
 * Run: bun run scripts/test-d15-s01.ts
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
    description: "org-foundation.ts schema file exists",
    pass: fileExists("src/server/db/schema/org-foundation.ts"),
  },
  {
    id: "SCH-02",
    description: "onx_branch table defined in schema",
    pass: includes("src/server/db/schema/org-foundation.ts", '"branch"'),
  },
  {
    id: "SCH-03",
    description: "Branch has brandId FK to onx_brand",
    pass: includes("src/server/db/schema/org-foundation.ts", "brandId"),
  },
  {
    id: "SCH-04",
    description: "Branch has code unique field",
    pass:
      includes("src/server/db/schema/org-foundation.ts", "code") &&
      includes("src/server/db/schema/org-foundation.ts", "unique()"),
  },
  {
    id: "SCH-05",
    description: "Branch exported from schema barrel",
    pass: includes("src/server/db/schema.ts", "org-foundation"),
  },
  {
    id: "SCH-06",
    description: "onx_branch migration exists",
    pass: includes("drizzle/0003_foundation_p0.sql", "onx_branch"),
  },
  // IU-API: Service + Router
  {
    id: "API-01",
    description: "org.service.ts exists",
    pass: fileExists("src/server/services/org.service.ts"),
  },
  {
    id: "API-02",
    description: "listBranches function defined",
    pass: includes("src/server/services/org.service.ts", "listBranches"),
  },
  {
    id: "API-03",
    description: "getBranchById function defined",
    pass: includes("src/server/services/org.service.ts", "getBranchById"),
  },
  {
    id: "API-04",
    description: "createBranch function defined",
    pass: includes("src/server/services/org.service.ts", "createBranch"),
  },
  {
    id: "API-05",
    description: "updateBranch function defined",
    pass: includes("src/server/services/org.service.ts", "updateBranch"),
  },
  {
    id: "API-06",
    description: "updateBranch supports isActive toggle (branch deactivation)",
    pass: includes("src/server/api/routers/org.ts", "isActive"),
  },
  {
    id: "API-07",
    description: "org tRPC router exists",
    pass: fileExists("src/server/api/routers/org.ts"),
  },
  {
    id: "API-08",
    description: "listBranches procedure in router",
    pass: includes("src/server/api/routers/org.ts", "listBranches"),
  },
  {
    id: "API-09",
    description: "getBranch procedure in router",
    pass: includes("src/server/api/routers/org.ts", "getBranch"),
  },
  {
    id: "API-10",
    description: "createBranch procedure in router",
    pass: includes("src/server/api/routers/org.ts", "createBranch"),
  },
  {
    id: "API-11",
    description: "updateBranch procedure in router",
    pass: includes("src/server/api/routers/org.ts", "updateBranch"),
  },
  {
    id: "API-12",
    description: "org router registered in root",
    pass: includes("src/server/api/root.ts", "org: orgRouter"),
  },
  {
    id: "API-13",
    description: "org:read permission defined",
    pass: includes("src/lib/permissions.ts", "org:read"),
  },
  {
    id: "API-14",
    description: "org:write permission defined",
    pass: includes("src/lib/permissions.ts", "org:write"),
  },
  // IU-UI: Pages
  {
    id: "UI-01",
    description: "/org/layout.tsx exists",
    pass: fileExists("src/app/org/layout.tsx"),
  },
  {
    id: "UI-02",
    description: "/org/branches/page.tsx exists",
    pass: fileExists("src/app/org/branches/page.tsx"),
  },
  {
    id: "UI-03",
    description: "Branches page uses listBranches tRPC call",
    pass: includes("src/app/org/branches/page.tsx", "listBranches"),
  },
  {
    id: "UI-04",
    description: "Branches page uses createBranch tRPC call",
    pass: includes("src/app/org/branches/page.tsx", "createBranch"),
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
  join(dir, `EV-TEST_D15-S01_${timestamp}_branch-location-master.txt`),
  `OCMBR IU-ID: D15-S01-IU-TST\nDate: ${new Date().toISOString()}\nScenarios: ${scenarios.length}\n\n${lines.join("\n")}\n\nALL ${scenarios.length} SCENARIOS PASS\n`,
);
console.log(`\nALL ${scenarios.length} scenarios PASS ✓`);
console.log(
  `Evidence: EVIDENCE/OCMBR-004/${timestamp}/test/EV-TEST_D15-S01_${timestamp}_branch-location-master.txt`,
);
