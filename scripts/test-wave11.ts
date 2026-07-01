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

console.log("\n[D14-S08] Compliance Dashboard");
check(
  "reporting-foundation has complianceDashboardKpi",
  has("src/server/db/schema/reporting-foundation.ts", "complianceDashboardKpi"),
);
check(
  "reporting service has listComplianceKpis",
  has("src/server/services/reporting.service.ts", "listComplianceKpis"),
);
check(
  "reporting router has listComplianceKpis",
  has("src/server/api/routers/reporting.ts", "listComplianceKpis"),
);
check(
  "compliance-dashboard layout exists",
  exists("src/app/compliance-dashboard/layout.tsx"),
);
check(
  "compliance-dashboard page exists",
  exists("src/app/compliance-dashboard/page.tsx"),
);
check(
  "page references Compliance & Audit Dashboard",
  has("src/app/compliance-dashboard/page.tsx", "Compliance"),
);
check(
  "migration SQL references onx_compliance_dashboard_kpi",
  has("drizzle/0019_wave11_systems.sql", "onx_compliance_dashboard_kpi"),
);
check(
  "journal idx 19 set",
  has("drizzle/meta/_journal.json", "0019_wave11_systems"),
);
check(
  "reporting router has upsertComplianceKpi",
  has("src/server/api/routers/reporting.ts", "upsertComplianceKpi"),
);

console.log("\n[D14-S09] Custom Report Builder");
check(
  "reporting-foundation has customReport",
  has("src/server/db/schema/reporting-foundation.ts", "customReport"),
);
check(
  "reporting service has listCustomReports",
  has("src/server/services/reporting.service.ts", "listCustomReports"),
);
check(
  "reporting router has listCustomReports",
  has("src/server/api/routers/reporting.ts", "listCustomReports"),
);
check(
  "custom-reports layout exists",
  exists("src/app/custom-reports/layout.tsx"),
);
check("custom-reports page exists", exists("src/app/custom-reports/page.tsx"));
check(
  "page references Custom Report Builder",
  has("src/app/custom-reports/page.tsx", "Custom Report Builder"),
);
check(
  "migration SQL references onx_custom_report",
  has("drizzle/0019_wave11_systems.sql", "onx_custom_report"),
);
check(
  "reporting service has createCustomReport",
  has("src/server/services/reporting.service.ts", "createCustomReport"),
);
check(
  "reporting router has createCustomReport",
  has("src/server/api/routers/reporting.ts", "createCustomReport"),
);

console.log("\n[D14-S10] Scheduled Report Distribution");
check(
  "report_schedule table existed from Wave 9",
  has("drizzle/0017_wave9_systems.sql", "onx_report_schedule"),
);
check(
  "reporting service has listReportSchedules",
  has("src/server/services/reporting.service.ts", "listReportSchedules"),
);
check(
  "reporting router has listSchedules",
  has("src/server/api/routers/reporting.ts", "listSchedules"),
);
check(
  "report-distribution layout exists",
  exists("src/app/report-distribution/layout.tsx"),
);
check(
  "report-distribution page exists",
  exists("src/app/report-distribution/page.tsx"),
);
check(
  "page references Scheduled Report Distribution",
  has("src/app/report-distribution/page.tsx", "Scheduled Report Distribution"),
);
check(
  "reporting service has createReportSchedule",
  has("src/server/services/reporting.service.ts", "createReportSchedule"),
);
check(
  "reporting router has createSchedule",
  has("src/server/api/routers/reporting.ts", "createSchedule"),
);
check(
  "page uses api.reporting.listSchedules",
  has("src/app/report-distribution/page.tsx", "listSchedules"),
);

console.log("\n[D15-S05] Consolidated Reporting Toggle");
check(
  "reporting-foundation has consolidatedReportConfig",
  has(
    "src/server/db/schema/reporting-foundation.ts",
    "consolidatedReportConfig",
  ),
);
check(
  "reporting service has listConsolidatedConfigs",
  has("src/server/services/reporting.service.ts", "listConsolidatedConfigs"),
);
check(
  "reporting router has listConsolidatedConfigs",
  has("src/server/api/routers/reporting.ts", "listConsolidatedConfigs"),
);
check(
  "consolidated-reports layout exists",
  exists("src/app/consolidated-reports/layout.tsx"),
);
check(
  "consolidated-reports page exists",
  exists("src/app/consolidated-reports/page.tsx"),
);
check(
  "page references Consolidated Reporting",
  has("src/app/consolidated-reports/page.tsx", "Consolidated Reporting"),
);
check(
  "migration SQL references onx_consolidated_report_config",
  has("drizzle/0019_wave11_systems.sql", "onx_consolidated_report_config"),
);
check(
  "reporting service has createConsolidatedConfig",
  has("src/server/services/reporting.service.ts", "createConsolidatedConfig"),
);
check(
  "reporting router has createConsolidatedConfig",
  has("src/server/api/routers/reporting.ts", "createConsolidatedConfig"),
);

console.log("\n[D13-S05] Recommendation Engine Stub");
check(
  "recommendation-foundation schema exists",
  exists("src/server/db/schema/recommendation-foundation.ts"),
);
check(
  "recommendation service exists",
  exists("src/server/services/recommendation.service.ts"),
);
check(
  "recommendation router exists",
  exists("src/server/api/routers/recommendation.ts"),
);
check(
  "recommendations layout exists",
  exists("src/app/recommendations/layout.tsx"),
);
check(
  "recommendations page exists",
  exists("src/app/recommendations/page.tsx"),
);
check(
  "schema barrel exports recommendation",
  has("src/server/db/schema.ts", "recommendation-foundation"),
);
check(
  "root.ts imports recommendationRouter",
  has("src/server/api/root.ts", "recommendationRouter"),
);
check(
  "migration SQL references onx_recommendation_rule",
  has("drizzle/0019_wave11_systems.sql", "onx_recommendation_rule"),
);
check(
  "service has generateRecommendation",
  has(
    "src/server/services/recommendation.service.ts",
    "generateRecommendation",
  ),
);

console.log(
  `\n${"─".repeat(50)}\nWave 11 verification: ${passed}/${passed + failed} checks passed`,
);
if (failed === 0) {
  console.log("All Wave 11 checks passed ✅");
} else {
  console.log(`${failed} check(s) failed ❌`);
  process.exit(1);
}
