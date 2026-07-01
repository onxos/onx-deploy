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

console.log("\n[D15-S06] Inter-branch Transfer");
check(
  "multibranch-foundation schema exists",
  exists("src/server/db/schema/multibranch-foundation.ts"),
);
check(
  "schema has interBranchTransfer",
  has("src/server/db/schema/multibranch-foundation.ts", "interBranchTransfer"),
);
check(
  "multibranch service exists",
  exists("src/server/services/multibranch.service.ts"),
);
check(
  "multibranch router exists",
  exists("src/server/api/routers/multibranch.ts"),
);
check(
  "inter-branch-transfers layout exists",
  exists("src/app/inter-branch-transfers/layout.tsx"),
);
check(
  "inter-branch-transfers page exists",
  exists("src/app/inter-branch-transfers/page.tsx"),
);
check(
  "schema barrel exports multibranch",
  has("src/server/db/schema.ts", "multibranch-foundation"),
);
check(
  "root.ts imports multibranchRouter",
  has("src/server/api/root.ts", "multibranchRouter"),
);
check(
  "migration SQL references onx_inter_branch_transfer",
  has("drizzle/0020_wave12_systems.sql", "onx_inter_branch_transfer"),
);

console.log("\n[D15-S07] Branch Config Override");
check(
  "schema has branchConfig",
  has("src/server/db/schema/multibranch-foundation.ts", "branchConfig"),
);
check(
  "service has listBranchConfigs",
  has("src/server/services/multibranch.service.ts", "listBranchConfigs"),
);
check(
  "router has listBranchConfigs",
  has("src/server/api/routers/multibranch.ts", "listBranchConfigs"),
);
check(
  "branch-config layout exists",
  exists("src/app/branch-config/layout.tsx"),
);
check("branch-config page exists", exists("src/app/branch-config/page.tsx"));
check(
  "migration SQL references onx_branch_config",
  has("drizzle/0020_wave12_systems.sql", "onx_branch_config"),
);
check(
  "service has upsertBranchConfig",
  has("src/server/services/multibranch.service.ts", "upsertBranchConfig"),
);
check(
  "router has upsertBranchConfig",
  has("src/server/api/routers/multibranch.ts", "upsertBranchConfig"),
);
check(
  "journal idx 20 set",
  has("drizzle/meta/_journal.json", "0020_wave12_systems"),
);

console.log("\n[D15-S08] Multi-currency Rates");
check(
  "schema has currencyRate",
  has("src/server/db/schema/multibranch-foundation.ts", "currencyRate"),
);
check(
  "service has listActiveCurrencyRates",
  has("src/server/services/multibranch.service.ts", "listActiveCurrencyRates"),
);
check(
  "router has listCurrencyRates",
  has("src/server/api/routers/multibranch.ts", "listCurrencyRates"),
);
check(
  "currency-rates layout exists",
  exists("src/app/currency-rates/layout.tsx"),
);
check("currency-rates page exists", exists("src/app/currency-rates/page.tsx"));
check(
  "migration SQL references onx_currency_rate",
  has("drizzle/0020_wave12_systems.sql", "onx_currency_rate"),
);
check(
  "service has upsertCurrencyRate",
  has("src/server/services/multibranch.service.ts", "upsertCurrencyRate"),
);
check(
  "router has upsertCurrencyRate",
  has("src/server/api/routers/multibranch.ts", "upsertCurrencyRate"),
);
check(
  "page references Currency Rates",
  has("src/app/currency-rates/page.tsx", "Currency Rates"),
);

console.log("\n[D13-S06] Integration Contract Stubs");
check(
  "integration-contract-foundation schema exists",
  exists("src/server/db/schema/integration-contract-foundation.ts"),
);
check(
  "integration-contract service exists",
  exists("src/server/services/integration-contract.service.ts"),
);
check(
  "integration-contract router exists",
  exists("src/server/api/routers/integration-contract.ts"),
);
check(
  "integration-contracts layout exists",
  exists("src/app/integration-contracts/layout.tsx"),
);
check(
  "integration-contracts page exists",
  exists("src/app/integration-contracts/page.tsx"),
);
check(
  "schema barrel exports integration-contract",
  has("src/server/db/schema.ts", "integration-contract-foundation"),
);
check(
  "root.ts imports integrationContractRouter",
  has("src/server/api/root.ts", "integrationContractRouter"),
);
check(
  "migration SQL references onx_integration_contract",
  has("drizzle/0020_wave12_systems.sql", "onx_integration_contract"),
);
check(
  "service has activateContract",
  has(
    "src/server/services/integration-contract.service.ts",
    "activateContract",
  ),
);

console.log("\n[D13-S08] Background Job Queue");
check(
  "intelligence-foundation has jobQueue",
  has("src/server/db/schema/intelligence-foundation.ts", "jobQueue"),
);
check(
  "event-outbox service has enqueueJob",
  has("src/server/services/event-outbox.service.ts", "enqueueJob"),
);
check("job-queue router exists", exists("src/server/api/routers/job-queue.ts"));
check("job-queue layout exists", exists("src/app/job-queue/layout.tsx"));
check("job-queue page exists", exists("src/app/job-queue/page.tsx"));
check(
  "root.ts imports jobQueueRouter",
  has("src/server/api/root.ts", "jobQueueRouter"),
);
check(
  "event-outbox service has listJobs",
  has("src/server/services/event-outbox.service.ts", "listJobs"),
);
check(
  "page references Background Job Queue",
  has("src/app/job-queue/page.tsx", "Background Job Queue"),
);
check(
  "router has complete mutation",
  has("src/server/api/routers/job-queue.ts", "complete"),
);

console.log(
  `\n${"─".repeat(50)}\nWave 12 verification: ${passed}/${passed + failed} checks passed`,
);
if (failed === 0) {
  console.log("All Wave 12 checks passed ✅");
} else {
  console.log(`${failed} check(s) failed ❌`);
  process.exit(1);
}
