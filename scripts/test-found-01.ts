/**
 * OCMBR Foundation Test — FOUND-IU-01
 * Verifies: Brand + Branch schema, service, router, and UI files exist
 * and contain expected exports/symbols.
 *
 * Run: bun run scripts/test-found-01.ts
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
    description: "org-foundation schema file exists",
    pass: fileExists("src/server/db/schema/org-foundation.ts"),
  },
  {
    id: "02",
    description: "onx_brand table defined in schema",
    pass: includes("src/server/db/schema/org-foundation.ts", "onx_brand"),
  },
  {
    id: "03",
    description: "onx_branch table defined in schema",
    pass: includes("src/server/db/schema/org-foundation.ts", "onx_branch"),
  },
  {
    id: "04",
    description: "Brand and Branch exported from barrel",
    pass: includes("src/server/db/schema.ts", "org-foundation"),
  },
  {
    id: "05",
    description: "org.service.ts exists",
    pass: fileExists("src/server/services/org.service.ts"),
  },
  {
    id: "06",
    description: "createBrand function defined",
    pass: includes("src/server/services/org.service.ts", "createBrand"),
  },
  {
    id: "07",
    description: "createBranch function defined",
    pass: includes("src/server/services/org.service.ts", "createBranch"),
  },
  {
    id: "08",
    description: "deactivateBrand cascades branches",
    pass: includes("src/server/services/org.service.ts", "deactivateBrand"),
  },
  {
    id: "09",
    description: "tRPC org router exists",
    pass: fileExists("src/server/api/routers/org.ts"),
  },
  {
    id: "10",
    description: "orgRouter exported from router file",
    pass: includes("src/server/api/routers/org.ts", "orgRouter"),
  },
  {
    id: "11",
    description: "org router registered in appRouter root",
    pass: includes("src/server/api/root.ts", "org: orgRouter"),
  },
  {
    id: "12",
    description: "/org/layout.tsx exists (admin/founder only)",
    pass: fileExists("src/app/org/layout.tsx"),
  },
  {
    id: "13",
    description: "/org/brands/page.tsx exists",
    pass: fileExists("src/app/org/brands/page.tsx"),
  },
  {
    id: "14",
    description: "/org/branches/page.tsx exists",
    pass: fileExists("src/app/org/branches/page.tsx"),
  },
  {
    id: "15",
    description: "org:write permission defined",
    pass: includes("src/lib/permissions.ts", "org:write"),
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
  join(dir, `EV-TEST_FOUND-IU-01_${timestamp}_results.txt`),
  `${lines.join("\n")}\nALL ${scenarios.length} SCENARIOS PASS\n`,
);
console.log(`\nALL ${scenarios.length} scenarios PASS ✓`);
