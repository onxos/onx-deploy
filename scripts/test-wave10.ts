/**
 * Wave 10 verification script
 * D14-S04 HR Dashboard, D14-S05 Clinical Director Dashboard,
 * D14-S06 Inventory Dashboard, D14-S07 Loyalty Dashboard,
 * D13-S04 AI Decision Placeholder
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}`);
    failed++;
  }
}

function fileExists(rel: string) {
  return existsSync(join(root, rel));
}

function fileContains(rel: string, needle: string) {
  if (!existsSync(join(root, rel))) return false;
  return readFileSync(join(root, rel), "utf8").includes(needle);
}

// ── D14-S04 HR Manager Dashboard ─────────────────────────────────────────────
console.log("\n[D14-S04] HR Manager Dashboard");
check(
  "reporting-foundation has hrDashboardKpi",
  fileContains(
    "src/server/db/schema/reporting-foundation.ts",
    "hrDashboardKpi",
  ),
);
check(
  "reporting service has listHrKpis",
  fileContains("src/server/services/reporting.service.ts", "listHrKpis"),
);
check(
  "reporting router has listHrKpis",
  fileContains("src/server/api/routers/reporting.ts", "listHrKpis"),
);
check(
  "hr-dashboard layout exists",
  fileExists("src/app/hr-dashboard/layout.tsx"),
);
check("hr-dashboard page exists", fileExists("src/app/hr-dashboard/page.tsx"));
check(
  "hr-dashboard page references HR Manager Dashboard",
  fileContains("src/app/hr-dashboard/page.tsx", "HR Manager Dashboard"),
);
check(
  "migration SQL references onx_hr_dashboard_kpi",
  fileContains("drizzle/0018_wave10_systems.sql", "onx_hr_dashboard_kpi"),
);
check(
  "journal idx 18 set",
  fileContains("drizzle/meta/_journal.json", "0018_wave10_systems"),
);
check(
  "reporting service has upsertHrKpi",
  fileContains("src/server/services/reporting.service.ts", "upsertHrKpi"),
);

// ── D14-S05 Clinical Director Dashboard ──────────────────────────────────────
console.log("\n[D14-S05] Clinical Director Dashboard");
check(
  "reporting-foundation has clinicalDirectorKpi",
  fileContains(
    "src/server/db/schema/reporting-foundation.ts",
    "clinicalDirectorKpi",
  ),
);
check(
  "reporting service has listClinicalDirectorKpis",
  fileContains(
    "src/server/services/reporting.service.ts",
    "listClinicalDirectorKpis",
  ),
);
check(
  "reporting router has listClinicalDirectorKpis",
  fileContains(
    "src/server/api/routers/reporting.ts",
    "listClinicalDirectorKpis",
  ),
);
check(
  "clinical-director-dashboard layout exists",
  fileExists("src/app/clinical-director-dashboard/layout.tsx"),
);
check(
  "clinical-director-dashboard page exists",
  fileExists("src/app/clinical-director-dashboard/page.tsx"),
);
check(
  "page references Clinical Director Dashboard",
  fileContains(
    "src/app/clinical-director-dashboard/page.tsx",
    "Clinical Director Dashboard",
  ),
);
check(
  "migration SQL references onx_clinical_director_kpi",
  fileContains("drizzle/0018_wave10_systems.sql", "onx_clinical_director_kpi"),
);
check(
  "reporting service has upsertClinicalDirectorKpi",
  fileContains(
    "src/server/services/reporting.service.ts",
    "upsertClinicalDirectorKpi",
  ),
);
check(
  "reporting router has upsertClinicalDirectorKpi",
  fileContains(
    "src/server/api/routers/reporting.ts",
    "upsertClinicalDirectorKpi",
  ),
);

// ── D14-S06 Inventory/Procurement Dashboard ───────────────────────────────────
console.log("\n[D14-S06] Inventory/Procurement Dashboard");
check(
  "reporting-foundation has inventoryProcurementKpi",
  fileContains(
    "src/server/db/schema/reporting-foundation.ts",
    "inventoryProcurementKpi",
  ),
);
check(
  "reporting service has listInventoryKpis",
  fileContains("src/server/services/reporting.service.ts", "listInventoryKpis"),
);
check(
  "reporting router has listInventoryKpis",
  fileContains("src/server/api/routers/reporting.ts", "listInventoryKpis"),
);
check(
  "inventory-dashboard layout exists",
  fileExists("src/app/inventory-dashboard/layout.tsx"),
);
check(
  "inventory-dashboard page exists",
  fileExists("src/app/inventory-dashboard/page.tsx"),
);
check(
  "migration SQL references onx_inventory_procurement_kpi",
  fileContains(
    "drizzle/0018_wave10_systems.sql",
    "onx_inventory_procurement_kpi",
  ),
);
check(
  "reporting router has upsertInventoryKpi",
  fileContains("src/server/api/routers/reporting.ts", "upsertInventoryKpi"),
);
check(
  "reporting service has upsertInventoryKpi",
  fileContains(
    "src/server/services/reporting.service.ts",
    "upsertInventoryKpi",
  ),
);
check(
  "inventory page references Inventory & Procurement",
  fileContains("src/app/inventory-dashboard/page.tsx", "Inventory"),
);

// ── D14-S07 Loyalty/Customer Dashboard ───────────────────────────────────────
console.log("\n[D14-S07] Customer/Loyalty Dashboard");
check(
  "reporting-foundation has loyaltyDashboardKpi",
  fileContains(
    "src/server/db/schema/reporting-foundation.ts",
    "loyaltyDashboardKpi",
  ),
);
check(
  "reporting service has listLoyaltyKpis",
  fileContains("src/server/services/reporting.service.ts", "listLoyaltyKpis"),
);
check(
  "reporting router has listLoyaltyKpis",
  fileContains("src/server/api/routers/reporting.ts", "listLoyaltyKpis"),
);
check(
  "loyalty-dashboard layout exists",
  fileExists("src/app/loyalty-dashboard/layout.tsx"),
);
check(
  "loyalty-dashboard page exists",
  fileExists("src/app/loyalty-dashboard/page.tsx"),
);
check(
  "loyalty page references Customer & Loyalty",
  fileContains("src/app/loyalty-dashboard/page.tsx", "Loyalty"),
);
check(
  "migration SQL references onx_loyalty_dashboard_kpi",
  fileContains("drizzle/0018_wave10_systems.sql", "onx_loyalty_dashboard_kpi"),
);
check(
  "reporting service has upsertLoyaltyKpi",
  fileContains("src/server/services/reporting.service.ts", "upsertLoyaltyKpi"),
);
check(
  "reporting router has upsertLoyaltyKpi",
  fileContains("src/server/api/routers/reporting.ts", "upsertLoyaltyKpi"),
);

// ── D13-S04 AI Decision Placeholder ──────────────────────────────────────────
console.log("\n[D13-S04] AI Decision Placeholder Endpoints");
check(
  "ai-decision-foundation schema exists",
  fileExists("src/server/db/schema/ai-decision-foundation.ts"),
);
check(
  "ai-decision service exists",
  fileExists("src/server/services/ai-decision.service.ts"),
);
check(
  "ai-decision router exists",
  fileExists("src/server/api/routers/ai-decision.ts"),
);
check(
  "ai-decisions layout exists",
  fileExists("src/app/ai-decisions/layout.tsx"),
);
check("ai-decisions page exists", fileExists("src/app/ai-decisions/page.tsx"));
check(
  "schema barrel exports ai-decision",
  fileContains("src/server/db/schema.ts", "ai-decision-foundation"),
);
check(
  "root.ts imports aiDecisionRouter",
  fileContains("src/server/api/root.ts", "aiDecisionRouter"),
);
check(
  "migration SQL references onx_ai_decision_request",
  fileContains("drizzle/0018_wave10_systems.sql", "onx_ai_decision_request"),
);
check(
  "ai-decision service has resolveDecisionRequest",
  fileContains(
    "src/server/services/ai-decision.service.ts",
    "resolveDecisionRequest",
  ),
);

console.log(
  `\n${"─".repeat(50)}\nWave 10 verification: ${passed}/${passed + failed} checks passed`,
);
if (failed === 0) {
  console.log("All Wave 10 checks passed ✅");
} else {
  console.log(`${failed} check(s) failed ❌`);
  process.exit(1);
}
