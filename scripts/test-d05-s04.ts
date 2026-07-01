/**
 * OCMBR Wave 2 — D05-S04 Test Script
 * Stock Movement IU verification (SCH, SVC, API, UI)
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
    id: "D05-S04-SCH-01",
    description: "stock movement schema file exists",
    pass: fileExists("src/server/db/schema/stock-movement-foundation.ts"),
  },
  {
    id: "D05-S04-SCH-02",
    description: "stockMovement and stockBalance tables exported",
    pass:
      fileContains(
        "src/server/db/schema/stock-movement-foundation.ts",
        "stockMovement",
      ) &&
      fileContains(
        "src/server/db/schema/stock-movement-foundation.ts",
        "stockBalance",
      ),
  },
  {
    id: "D05-S04-SVC-01",
    description: "stock movement service exists",
    pass: fileExists("src/server/services/stock-movement.service.ts"),
  },
  {
    id: "D05-S04-SVC-02",
    description: "recordStockMovement function exported",
    pass: fileContains(
      "src/server/services/stock-movement.service.ts",
      "recordStockMovement",
    ),
  },
  {
    id: "D05-S04-API-01",
    description: "stock movement router exists",
    pass: fileExists("src/server/api/routers/stock-movement.ts"),
  },
  {
    id: "D05-S04-API-02",
    description: "stockMovementRouter registered in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "stockMovement: stockMovementRouter",
    ),
  },
  {
    id: "D05-S04-UI-01",
    description: "stock-movements layout exists",
    pass: fileExists("src/app/stock-movements/layout.tsx"),
  },
  {
    id: "D05-S04-UI-02",
    description: "stock-movements page exists",
    pass: fileExists("src/app/stock-movements/page.tsx"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log("\n=== D05-S04 Stock Movement Test Results ===");
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_D05-S04_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
