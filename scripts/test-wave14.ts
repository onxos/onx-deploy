import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
let passed = 0;
let failed = 0;
function check(label: string, ok: boolean) {
  if (ok) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}`);
    failed++;
  }
}
function exists(p: string) {
  return existsSync(join(root, p));
}
function has(p: string, s: string) {
  if (!existsSync(join(root, p))) return false;
  return readFileSync(join(root, p), "utf8").includes(s);
}

console.log("\n[D01-S05] Strategic Objectives (OKR)");
check(
  "governance-foundation schema exists",
  exists("src/server/db/schema/governance-foundation.ts"),
);
check(
  "schema has strategicObjective",
  has("src/server/db/schema/governance-foundation.ts", "strategicObjective"),
);
check(
  "governance service exists",
  exists("src/server/services/governance.service.ts"),
);
check(
  "governance router exists",
  exists("src/server/api/routers/governance.ts"),
);
check("objectives layout exists", exists("src/app/objectives/layout.tsx"));
check("objectives page exists", exists("src/app/objectives/page.tsx"));
check(
  "schema barrel exports governance",
  has("src/server/db/schema.ts", "governance-foundation"),
);
check(
  "root.ts imports governanceRouter",
  has("src/server/api/root.ts", "governanceRouter"),
);
check(
  "migration SQL references onx_strategic_objective",
  has("drizzle/0022_wave14_systems.sql", "onx_strategic_objective"),
);

console.log("\n[D01-S06] Escalation & Decision Log");
check(
  "schema has escalationLog",
  has("src/server/db/schema/governance-foundation.ts", "escalationLog"),
);
check(
  "service has listEscalations",
  has("src/server/services/governance.service.ts", "listEscalations"),
);
check(
  "router has listEscalations",
  has("src/server/api/routers/governance.ts", "listEscalations"),
);
check("escalations layout exists", exists("src/app/escalations/layout.tsx"));
check("escalations page exists", exists("src/app/escalations/page.tsx"));
check(
  "migration SQL references onx_escalation_log",
  has("drizzle/0022_wave14_systems.sql", "onx_escalation_log"),
);
check(
  "service has resolveEscalation",
  has("src/server/services/governance.service.ts", "resolveEscalation"),
);
check(
  "router has resolveEscalation",
  has("src/server/api/routers/governance.ts", "resolveEscalation"),
);
check(
  "journal idx 22 set",
  has("drizzle/meta/_journal.json", "0022_wave14_systems"),
);

console.log("\n[D01-S07] Founder Seal");
check(
  "schema has founderSeal",
  has("src/server/db/schema/governance-foundation.ts", "founderSeal"),
);
check(
  "service has listSeals",
  has("src/server/services/governance.service.ts", "listSeals"),
);
check(
  "router has listSeals",
  has("src/server/api/routers/governance.ts", "listSeals"),
);
check(
  "founder-seals layout exists",
  exists("src/app/founder-seals/layout.tsx"),
);
check("founder-seals page exists", exists("src/app/founder-seals/page.tsx"));
check(
  "migration SQL references onx_founder_seal",
  has("drizzle/0022_wave14_systems.sql", "onx_founder_seal"),
);
check(
  "service has createSeal",
  has("src/server/services/governance.service.ts", "createSeal"),
);
check(
  "router has createSeal",
  has("src/server/api/routers/governance.ts", "createSeal"),
);
check(
  "router has listSeals procedure",
  has("src/server/api/routers/governance.ts", "listSeals"),
);

console.log("\n[D02-S08] Disciplinary & Grievance");
check(
  "schema has disciplinaryCase",
  has("src/server/db/schema/governance-foundation.ts", "disciplinaryCase"),
);
check(
  "service has listDisciplinaryCases",
  has("src/server/services/governance.service.ts", "listDisciplinaryCases"),
);
check(
  "router has listDisciplinaryCases",
  has("src/server/api/routers/governance.ts", "listDisciplinaryCases"),
);
check("disciplinary layout exists", exists("src/app/disciplinary/layout.tsx"));
check("disciplinary page exists", exists("src/app/disciplinary/page.tsx"));
check(
  "migration SQL references onx_disciplinary_case",
  has("drizzle/0022_wave14_systems.sql", "onx_disciplinary_case"),
);
check(
  "service has resolveDisciplinaryCase",
  has("src/server/services/governance.service.ts", "resolveDisciplinaryCase"),
);
check(
  "router has resolveDisciplinaryCase",
  has("src/server/api/routers/governance.ts", "resolveDisciplinaryCase"),
);
check(
  "router has createDisciplinaryCase",
  has("src/server/api/routers/governance.ts", "createDisciplinaryCase"),
);

console.log("\n[D02-S09] Employee Self-Service");
check(
  "schema has employeeSelfServiceRequest",
  has(
    "src/server/db/schema/governance-foundation.ts",
    "employeeSelfServiceRequest",
  ),
);
check(
  "service has listEssRequests",
  has("src/server/services/governance.service.ts", "listEssRequests"),
);
check(
  "router has listEssRequests",
  has("src/server/api/routers/governance.ts", "listEssRequests"),
);
check(
  "employee-self-service layout exists",
  exists("src/app/employee-self-service/layout.tsx"),
);
check(
  "employee-self-service page exists",
  exists("src/app/employee-self-service/page.tsx"),
);
check(
  "migration SQL references onx_employee_self_service_request",
  has("drizzle/0022_wave14_systems.sql", "onx_employee_self_service_request"),
);
check(
  "service has processEssRequest",
  has("src/server/services/governance.service.ts", "processEssRequest"),
);
check(
  "router has processEssRequest",
  has("src/server/api/routers/governance.ts", "processEssRequest"),
);
check(
  "page references Employee Self-Service",
  has("src/app/employee-self-service/page.tsx", "Employee Self-Service"),
);

console.log(
  `\n${"─".repeat(50)}\nWave 14 verification: ${passed}/${passed + failed} checks passed`,
);
if (failed === 0) {
  console.log("All Wave 14 checks passed ✅");
} else {
  console.log(`${failed} check(s) failed ❌`);
  process.exit(1);
}
