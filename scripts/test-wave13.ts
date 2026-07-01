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

console.log("\n[D01-S01] Executive Command Dashboard");
check(
  "executive-foundation schema exists",
  exists("src/server/db/schema/executive-foundation.ts"),
);
check(
  "schema has execDashboardKpi",
  has("src/server/db/schema/executive-foundation.ts", "execDashboardKpi"),
);
check(
  "executive service exists",
  exists("src/server/services/executive.service.ts"),
);
check("executive router exists", exists("src/server/api/routers/executive.ts"));
check(
  "exec-dashboard layout exists",
  exists("src/app/exec-dashboard/layout.tsx"),
);
check("exec-dashboard page exists", exists("src/app/exec-dashboard/page.tsx"));
check(
  "schema barrel exports executive",
  has("src/server/db/schema.ts", "executive-foundation"),
);
check(
  "root.ts imports executiveRouter",
  has("src/server/api/root.ts", "executiveRouter"),
);
check(
  "migration SQL references onx_exec_dashboard_kpi",
  has("drizzle/0021_wave13_systems.sql", "onx_exec_dashboard_kpi"),
);

console.log("\n[D01-S02] Approval Authority Matrix");
check(
  "schema has approvalMatrix",
  has("src/server/db/schema/executive-foundation.ts", "approvalMatrix"),
);
check(
  "service has listApprovalMatrix",
  has("src/server/services/executive.service.ts", "listApprovalMatrix"),
);
check(
  "router has listApprovalMatrix",
  has("src/server/api/routers/executive.ts", "listApprovalMatrix"),
);
check(
  "approval-matrix layout exists",
  exists("src/app/approval-matrix/layout.tsx"),
);
check(
  "approval-matrix page exists",
  exists("src/app/approval-matrix/page.tsx"),
);
check(
  "migration SQL references onx_approval_matrix",
  has("drizzle/0021_wave13_systems.sql", "onx_approval_matrix"),
);
check(
  "service has createApprovalMatrix",
  has("src/server/services/executive.service.ts", "createApprovalMatrix"),
);
check(
  "router has createApprovalMatrix",
  has("src/server/api/routers/executive.ts", "createApprovalMatrix"),
);
check(
  "journal idx 21 set",
  has("drizzle/meta/_journal.json", "0021_wave13_systems"),
);

console.log("\n[D01-S03] Board Resolution Register");
check(
  "schema has boardResolution",
  has("src/server/db/schema/executive-foundation.ts", "boardResolution"),
);
check(
  "service has listResolutions",
  has("src/server/services/executive.service.ts", "listResolutions"),
);
check(
  "router has listResolutions",
  has("src/server/api/routers/executive.ts", "listResolutions"),
);
check(
  "board-resolutions layout exists",
  exists("src/app/board-resolutions/layout.tsx"),
);
check(
  "board-resolutions page exists",
  exists("src/app/board-resolutions/page.tsx"),
);
check(
  "migration SQL references onx_board_resolution",
  has("drizzle/0021_wave13_systems.sql", "onx_board_resolution"),
);
check(
  "service has createResolution",
  has("src/server/services/executive.service.ts", "createResolution"),
);
check(
  "router has createResolution",
  has("src/server/api/routers/executive.ts", "createResolution"),
);
check(
  "page references Board Resolution Register",
  has("src/app/board-resolutions/page.tsx", "Board Resolution Register"),
);

console.log("\n[D15-S09] Multi-language Config");
check(
  "schema has languageConfig",
  has("src/server/db/schema/executive-foundation.ts", "languageConfig"),
);
check(
  "service has listLanguageConfigs",
  has("src/server/services/executive.service.ts", "listLanguageConfigs"),
);
check(
  "router has listLanguageConfigs",
  has("src/server/api/routers/executive.ts", "listLanguageConfigs"),
);
check(
  "language-config layout exists",
  exists("src/app/language-config/layout.tsx"),
);
check(
  "language-config page exists",
  exists("src/app/language-config/page.tsx"),
);
check(
  "migration SQL references onx_language_config",
  has("drizzle/0021_wave13_systems.sql", "onx_language_config"),
);
check(
  "service has createLanguageConfig",
  has("src/server/services/executive.service.ts", "createLanguageConfig"),
);
check(
  "router has createLanguageConfig",
  has("src/server/api/routers/executive.ts", "createLanguageConfig"),
);
check(
  "page references Language Configuration",
  has("src/app/language-config/page.tsx", "Language Configuration"),
);

console.log("\n[D15-S10] Tenant Onboarding");
check(
  "schema has tenantOnboarding",
  has("src/server/db/schema/executive-foundation.ts", "tenantOnboarding"),
);
check(
  "service has listOnboardingSteps",
  has("src/server/services/executive.service.ts", "listOnboardingSteps"),
);
check(
  "router has listOnboardingSteps",
  has("src/server/api/routers/executive.ts", "listOnboardingSteps"),
);
check(
  "tenant-onboarding layout exists",
  exists("src/app/tenant-onboarding/layout.tsx"),
);
check(
  "tenant-onboarding page exists",
  exists("src/app/tenant-onboarding/page.tsx"),
);
check(
  "migration SQL references onx_tenant_onboarding",
  has("drizzle/0021_wave13_systems.sql", "onx_tenant_onboarding"),
);
check(
  "service has completeOnboardingStep",
  has("src/server/services/executive.service.ts", "completeOnboardingStep"),
);
check(
  "router has completeOnboardingStep",
  has("src/server/api/routers/executive.ts", "completeOnboardingStep"),
);
check(
  "page references Tenant Onboarding",
  has("src/app/tenant-onboarding/page.tsx", "Tenant Onboarding"),
);

console.log(
  `\n${"─".repeat(50)}\nWave 13 verification: ${passed}/${passed + failed} checks passed`,
);
if (failed === 0) {
  console.log("All Wave 13 checks passed ✅");
} else {
  console.log(`${failed} check(s) failed ❌`);
  process.exit(1);
}
