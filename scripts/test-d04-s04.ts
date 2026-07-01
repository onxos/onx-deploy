/**
 * OCMBR Wave 2b — D04-S04 Test Script
 * Purchase Order IU verification (SCH, SVC, API, UI)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const EVIDENCE_DIR = join(ROOT, "EVIDENCE", "OCMBR-005", "20260701", "test");

interface Scenario {
  id: string;
  description: string;
  pass: boolean;
}

function fileExists(rel: string): boolean {
  return existsSync(join(ROOT, rel));
}

function fileContains(rel: string, text: string): boolean {
  if (!fileExists(rel)) return false;
  const content = readFileSync(join(ROOT, rel), "utf-8");
  return content.includes(text);
}

const scenarios: Scenario[] = [
  {
    id: "D04-S04-SCH-01",
    description: "purchase order schema file exists",
    pass: fileExists("src/server/db/schema/purchase-order-foundation.ts"),
  },
  {
    id: "D04-S04-SCH-02",
    description: "purchaseOrder and poLine tables exported",
    pass:
      fileContains(
        "src/server/db/schema/purchase-order-foundation.ts",
        "purchaseOrder",
      ) &&
      fileContains(
        "src/server/db/schema/purchase-order-foundation.ts",
        "poLine",
      ),
  },
  {
    id: "D04-S04-SVC-01",
    description: "purchase order service exists",
    pass: fileExists("src/server/services/purchase-order.service.ts"),
  },
  {
    id: "D04-S04-SVC-02",
    description: "createPurchaseOrder function exported",
    pass: fileContains(
      "src/server/services/purchase-order.service.ts",
      "createPurchaseOrder",
    ),
  },
  {
    id: "D04-S04-API-01",
    description: "purchase order router exists",
    pass: fileExists("src/server/api/routers/purchase-order.ts"),
  },
  {
    id: "D04-S04-API-02",
    description: "purchaseOrderRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "purchaseOrder: purchaseOrderRouter",
    ),
  },
  {
    id: "D04-S04-UI-01",
    description: "purchase-orders layout exists",
    pass: fileExists("src/app/purchase-orders/layout.tsx"),
  },
  {
    id: "D04-S04-UI-02",
    description: "purchase-orders page exists",
    pass: fileExists("src/app/purchase-orders/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log("\n=== D04-S04 Purchase Order Test Results ===");
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_D04-S04_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
