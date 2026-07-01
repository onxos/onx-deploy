/**
 * OCMBR Foundation Test — FOUND-IU-02
 * Verifies: Tenant schema, service, and router files exist
 * and contain expected exports/symbols.
 *
 * Run: bun run scripts/test-found-02.ts
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
    description: "tenant-foundation schema file exists",
    pass: fileExists("src/server/db/schema/tenant-foundation.ts"),
  },
  {
    id: "02",
    description: "onx_tenant table defined in schema",
    pass: includes("src/server/db/schema/tenant-foundation.ts", "onx_tenant"),
  },
  {
    id: "03",
    description: "onx_tenant_invite table defined",
    pass: includes(
      "src/server/db/schema/tenant-foundation.ts",
      "onx_tenant_invite",
    ),
  },
  {
    id: "04",
    description: "onx_tenant_config table defined",
    pass: includes(
      "src/server/db/schema/tenant-foundation.ts",
      "onx_tenant_config",
    ),
  },
  {
    id: "05",
    description: "Tenant schema exported from barrel",
    pass: includes("src/server/db/schema.ts", "tenant-foundation"),
  },
  {
    id: "06",
    description: "tenant.service.ts exists",
    pass: fileExists("src/server/services/tenant.service.ts"),
  },
  {
    id: "07",
    description: "createTenant function defined",
    pass: includes("src/server/services/tenant.service.ts", "createTenant"),
  },
  {
    id: "08",
    description: "createInvite function defined",
    pass: includes("src/server/services/tenant.service.ts", "createInvite"),
  },
  {
    id: "09",
    description: "validateInviteToken function defined",
    pass: includes(
      "src/server/services/tenant.service.ts",
      "validateInviteToken",
    ),
  },
  {
    id: "10",
    description: "tRPC tenant router exists",
    pass: fileExists("src/server/api/routers/tenant.ts"),
  },
  {
    id: "11",
    description: "tenantRouter exported from router file",
    pass: includes("src/server/api/routers/tenant.ts", "tenantRouter"),
  },
  {
    id: "12",
    description: "tenant router registered in appRouter root",
    pass: includes("src/server/api/root.ts", "tenant: tenantRouter"),
  },
  {
    id: "13",
    description: "tenant:write permission defined",
    pass: includes("src/lib/permissions.ts", "tenant:write"),
  },
  {
    id: "14",
    description: "tenant:read permission defined",
    pass: includes("src/lib/permissions.ts", "tenant:read"),
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
  join(dir, `EV-TEST_FOUND-IU-02_${timestamp}_results.txt`),
  `${lines.join("\n")}\nALL ${scenarios.length} SCENARIOS PASS\n`,
);
console.log(`\nALL ${scenarios.length} scenarios PASS ✓`);
