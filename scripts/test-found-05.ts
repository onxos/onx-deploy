/**
 * OCMBR Foundation Test — FOUND-IU-05
 * Verifies: Audit Foundation schema and service.
 *
 * Run: bun run scripts/test-found-05.ts
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
    description: "audit-foundation schema file exists",
    pass: fileExists("src/server/db/schema/audit-foundation.ts"),
  },
  {
    id: "02",
    description: "onx_domain_audit_event table defined",
    pass: includes(
      "src/server/db/schema/audit-foundation.ts",
      "onx_domain_audit_event",
    ),
  },
  {
    id: "03",
    description: "onx_audit_retention_policy table defined",
    pass: includes(
      "src/server/db/schema/audit-foundation.ts",
      "onx_audit_retention_policy",
    ),
  },
  {
    id: "04",
    description: "audit-foundation exported from barrel",
    pass: includes("src/server/db/schema.ts", "audit-foundation"),
  },
  {
    id: "05",
    description: "audit.service.ts exists",
    pass: fileExists("src/server/services/audit.service.ts"),
  },
  {
    id: "06",
    description: "recordAudit function defined",
    pass: includes("src/server/services/audit.service.ts", "recordAudit"),
  },
  {
    id: "07",
    description: "getAuditTrail function defined",
    pass: includes("src/server/services/audit.service.ts", "getAuditTrail"),
  },
  {
    id: "08",
    description: "getAuditForEntity function defined",
    pass: includes("src/server/services/audit.service.ts", "getAuditForEntity"),
  },
  {
    id: "09",
    description: "getRetentionPolicy function defined",
    pass: includes(
      "src/server/services/audit.service.ts",
      "getRetentionPolicy",
    ),
  },
  {
    id: "10",
    description: "append-only design enforced (no update/delete calls)",
    pass:
      !includes(
        "src/server/services/audit.service.ts",
        ".update(domainAuditEvent)",
      ) &&
      !includes(
        "src/server/services/audit.service.ts",
        ".delete(domainAuditEvent)",
      ),
  },
  {
    id: "11",
    description: "audit:read permission defined",
    pass: includes("src/lib/permissions.ts", "audit:read"),
  },
  {
    id: "12",
    description: "audit recorded on brand create (org router)",
    pass: includes("src/server/api/routers/org.ts", "recordAudit"),
  },
  {
    id: "13",
    description: "audit recorded on tenant create (tenant router)",
    pass: includes("src/server/api/routers/tenant.ts", "recordAudit"),
  },
  {
    id: "14",
    description: "audit recorded on branch-rbac mutations",
    pass: includes("src/server/api/routers/branch-rbac.ts", "recordAudit"),
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
  join(dir, `EV-TEST_FOUND-IU-05_${timestamp}_results.txt`),
  `${lines.join("\n")}\nALL ${scenarios.length} SCENARIOS PASS\n`,
);
console.log(`\nALL ${scenarios.length} scenarios PASS ✓`);
