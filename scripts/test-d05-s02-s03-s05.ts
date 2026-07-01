/**
 * OCMBR Wave 2b — D05-S02 + D05-S03 + D05-S05 Test Script
 * Inventory Location, Item Batch, Reorder IU verification
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
  // D05-S02
  {
    id: "D05-S02-SCH-01",
    description: "inventory location schema exists",
    pass: fileExists("src/server/db/schema/inventory-location-foundation.ts"),
  },
  {
    id: "D05-S02-SVC-01",
    description: "inventory location service exists",
    pass: fileExists("src/server/services/inventory-location.service.ts"),
  },
  {
    id: "D05-S02-API-01",
    description: "inventory location router exists",
    pass: fileExists("src/server/api/routers/inventory-location.ts"),
  },
  {
    id: "D05-S02-UI-01",
    description: "inventory-locations page exists",
    pass: fileExists("src/app/inventory-locations/page.tsx"),
  },
  // D05-S03
  {
    id: "D05-S03-SCH-01",
    description: "item batch schema exists",
    pass: fileExists("src/server/db/schema/item-batch-foundation.ts"),
  },
  {
    id: "D05-S03-SVC-01",
    description: "item batch service exists",
    pass: fileExists("src/server/services/item-batch.service.ts"),
  },
  {
    id: "D05-S03-API-01",
    description: "item batch router exists",
    pass: fileExists("src/server/api/routers/item-batch.ts"),
  },
  {
    id: "D05-S03-UI-01",
    description: "item-batches page exists",
    pass: fileExists("src/app/item-batches/page.tsx"),
  },
  // D05-S05
  {
    id: "D05-S05-SCH-01",
    description: "reorder schema exists",
    pass: fileExists("src/server/db/schema/reorder-foundation.ts"),
  },
  {
    id: "D05-S05-SVC-01",
    description: "reorder service exists",
    pass: fileExists("src/server/services/reorder.service.ts"),
  },
  {
    id: "D05-S05-API-01",
    description: "reorder router exists",
    pass: fileExists("src/server/api/routers/reorder.ts"),
  },
  {
    id: "D05-S05-UI-01",
    description: "reorder page exists",
    pass: fileExists("src/app/reorder/page.tsx"),
  },
  // Root registrations
  {
    id: "D05-S02-API-02",
    description: "inventoryLocationRouter in root",
    pass: fileContains(
      "src/server/api/root.ts",
      "inventoryLocation: inventoryLocationRouter",
    ),
  },
  {
    id: "D05-S03-API-02",
    description: "itemBatchRouter in root",
    pass: fileContains("src/server/api/root.ts", "itemBatch: itemBatchRouter"),
  },
  {
    id: "D05-S05-API-02",
    description: "reorderRouter in root",
    pass: fileContains("src/server/api/root.ts", "reorder: reorderRouter"),
  },
];

const allPass = scenarios.every((s) => s.pass);
const failCount = scenarios.filter((s) => !s.pass).length;

console.log("\n=== D05-S02/S03/S05 Inventory Systems Test Results ===");
for (const s of scenarios) {
  console.log(`${s.pass ? "PASS" : "FAIL"} [${s.id}] ${s.description}`);
}
console.log(`\n${scenarios.length - failCount}/${scenarios.length} passed`);

if (!existsSync(EVIDENCE_DIR)) {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
}
writeFileSync(
  join(EVIDENCE_DIR, "EV-TEST_D05-S02-S03-S05_20260701_verification.json"),
  JSON.stringify({ timestamp: new Date().toISOString(), scenarios }, null, 2),
);

if (!allPass) {
  console.error(`\n${failCount} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests PASSED");
