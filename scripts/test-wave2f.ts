/**
 * Wave 2f Verification Script
 * Tests: D09-S07 Surgical Theatre, D09-S08 Hospitalisation/Inpatient,
 *        D09-S09 Referral Management, D08-S03 Discount & Coupon Engine,
 *        D08-S04 Receipt & Invoice Generation
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const PASS = "PASS";
const FAIL = "FAIL";

interface Result {
  system: string;
  iu: string;
  description: string;
  status: string;
  detail: string;
}

const results: Result[] = [];

function check(
  system: string,
  iu: string,
  description: string,
  condition: boolean,
  detail: string,
) {
  results.push({
    system,
    iu,
    description,
    status: condition ? PASS : FAIL,
    detail,
  });
}

function fileExists(rel: string) {
  return existsSync(join(ROOT, rel));
}

function fileContains(rel: string, text: string) {
  if (!fileExists(rel)) return false;
  return readFileSync(join(ROOT, rel), "utf8").includes(text);
}

// ─── D09-S07 Surgical Theatre ───────────────────────────────────────────────
const s07schema = "src/server/db/schema/surgical-theatre-foundation.ts";
const s07service = "src/server/services/surgical-theatre.service.ts";
const s07router = "src/server/api/routers/surgical-theatre.ts";
const s07root = "src/server/api/root.ts";
const s07ui = "src/app/surgical-theatre/page.tsx";

check(
  "D09-S07",
  "D09-S07-IU-SCH",
  "Schema file exists",
  fileExists(s07schema),
  s07schema,
);
check(
  "D09-S07",
  "D09-S07-IU-SCH",
  "surgicalCase table defined",
  fileContains(s07schema, "surgicalCase"),
  "table name in schema",
);
check(
  "D09-S07",
  "D09-S07-IU-SVC",
  "Service file exists",
  fileExists(s07service),
  s07service,
);
check(
  "D09-S07",
  "D09-S07-IU-SVC",
  "createCase exported",
  fileContains(s07service, "createCase"),
  "function export",
);
check(
  "D09-S07",
  "D09-S07-IU-API",
  "Router file exists",
  fileExists(s07router),
  s07router,
);
check(
  "D09-S07",
  "D09-S07-IU-API",
  "create procedure in router",
  fileContains(s07router, "create"),
  "procedure exists",
);
check(
  "D09-S07",
  "D09-S07-IU-API",
  "surgicalTheatre registered in root",
  fileContains(s07root, "surgicalTheatre: surgicalTheatreRouter"),
  "root registration",
);
check("D09-S07", "D09-S07-IU-UI", "UI page exists", fileExists(s07ui), s07ui);
check(
  "D09-S07",
  "D09-S07-IU-UI",
  "UI page has heading",
  fileContains(s07ui, "Surgical Theatre"),
  "heading text",
);

// ─── D09-S08 Inpatient / Hospitalisation ────────────────────────────────────
const s08schema = "src/server/db/schema/inpatient-foundation.ts";
const s08service = "src/server/services/inpatient.service.ts";
const s08router = "src/server/api/routers/inpatient.ts";
const s08ui = "src/app/inpatient/page.tsx";

check(
  "D09-S08",
  "D09-S08-IU-SCH",
  "Schema file exists",
  fileExists(s08schema),
  s08schema,
);
check(
  "D09-S08",
  "D09-S08-IU-SCH",
  "inpatientAdmission table defined",
  fileContains(s08schema, "inpatientAdmission"),
  "table name in schema",
);
check(
  "D09-S08",
  "D09-S08-IU-SVC",
  "Service file exists",
  fileExists(s08service),
  s08service,
);
check(
  "D09-S08",
  "D09-S08-IU-SVC",
  "createAdmission exported",
  fileContains(s08service, "createAdmission"),
  "function export",
);
check(
  "D09-S08",
  "D09-S08-IU-API",
  "Router file exists",
  fileExists(s08router),
  s08router,
);
check(
  "D09-S08",
  "D09-S08-IU-API",
  "inpatient registered in root",
  fileContains(s07root, "inpatient: inpatientRouter"),
  "root registration",
);
check("D09-S08", "D09-S08-IU-UI", "UI page exists", fileExists(s08ui), s08ui);
check(
  "D09-S08",
  "D09-S08-IU-UI",
  "UI page has heading",
  fileContains(s08ui, "Inpatient"),
  "heading text",
);

// ─── D09-S09 Referral Management ────────────────────────────────────────────
const s09schema = "src/server/db/schema/referral-foundation.ts";
const s09service = "src/server/services/referral.service.ts";
const s09router = "src/server/api/routers/referral.ts";
const s09ui = "src/app/referral/page.tsx";

check(
  "D09-S09",
  "D09-S09-IU-SCH",
  "Schema file exists",
  fileExists(s09schema),
  s09schema,
);
check(
  "D09-S09",
  "D09-S09-IU-SCH",
  "referral table defined",
  fileContains(s09schema, "referral"),
  "table name in schema",
);
check(
  "D09-S09",
  "D09-S09-IU-SVC",
  "Service file exists",
  fileExists(s09service),
  s09service,
);
check(
  "D09-S09",
  "D09-S09-IU-SVC",
  "createReferral exported",
  fileContains(s09service, "createReferral"),
  "function export",
);
check(
  "D09-S09",
  "D09-S09-IU-API",
  "Router file exists",
  fileExists(s09router),
  s09router,
);
check(
  "D09-S09",
  "D09-S09-IU-API",
  "referral registered in root",
  fileContains(s07root, "referral: referralRouter"),
  "root registration",
);
check("D09-S09", "D09-S09-IU-UI", "UI page exists", fileExists(s09ui), s09ui);
check(
  "D09-S09",
  "D09-S09-IU-UI",
  "UI page has heading",
  fileContains(s09ui, "Referral"),
  "heading text",
);

// ─── D08-S03 Discount & Coupon Engine ───────────────────────────────────────
const s03schema = "src/server/db/schema/discount-foundation.ts";
const s03service = "src/server/services/discount.service.ts";
const s03router = "src/server/api/routers/discount.ts";
const s03ui = "src/app/discount/page.tsx";

check(
  "D08-S03",
  "D08-S03-IU-SCH",
  "Schema file exists",
  fileExists(s03schema),
  s03schema,
);
check(
  "D08-S03",
  "D08-S03-IU-SCH",
  "discountRule table defined",
  fileContains(s03schema, "discountRule"),
  "table name in schema",
);
check(
  "D08-S03",
  "D08-S03-IU-SVC",
  "Service file exists",
  fileExists(s03service),
  s03service,
);
check(
  "D08-S03",
  "D08-S03-IU-SVC",
  "createDiscountRule exported",
  fileContains(s03service, "createDiscountRule"),
  "function export",
);
check(
  "D08-S03",
  "D08-S03-IU-API",
  "Router file exists",
  fileExists(s03router),
  s03router,
);
check(
  "D08-S03",
  "D08-S03-IU-API",
  "discount registered in root",
  fileContains(s07root, "discount: discountRouter"),
  "root registration",
);
check("D08-S03", "D08-S03-IU-UI", "UI page exists", fileExists(s03ui), s03ui);
check(
  "D08-S03",
  "D08-S03-IU-UI",
  "UI page has heading",
  fileContains(s03ui, "Discount"),
  "heading text",
);

// ─── D08-S04 Receipt & Invoice Generation ───────────────────────────────────
const s04schema = "src/server/db/schema/pos-receipt-foundation.ts";
const s04service = "src/server/services/pos-receipt.service.ts";
const s04router = "src/server/api/routers/pos-receipt.ts";
const s04ui = "src/app/pos-receipts/page.tsx";

check(
  "D08-S04",
  "D08-S04-IU-SCH",
  "Schema file exists",
  fileExists(s04schema),
  s04schema,
);
check(
  "D08-S04",
  "D08-S04-IU-SCH",
  "posReceipt table defined",
  fileContains(s04schema, "posReceipt"),
  "table name in schema",
);
check(
  "D08-S04",
  "D08-S04-IU-SVC",
  "Service file exists",
  fileExists(s04service),
  s04service,
);
check(
  "D08-S04",
  "D08-S04-IU-SVC",
  "createReceipt exported",
  fileContains(s04service, "createReceipt"),
  "function export",
);
check(
  "D08-S04",
  "D08-S04-IU-API",
  "Router file exists",
  fileExists(s04router),
  s04router,
);
check(
  "D08-S04",
  "D08-S04-IU-API",
  "posReceipt registered in root",
  fileContains(s07root, "posReceipt: posReceiptRouter"),
  "root registration",
);
check("D08-S04", "D08-S04-IU-UI", "UI page exists", fileExists(s04ui), s04ui);
check(
  "D08-S04",
  "D08-S04-IU-UI",
  "UI page has heading",
  fileContains(s04ui, "POS Receipt"),
  "heading text",
);

// ─── Report ──────────────────────────────────────────────────────────────────
const passed = results.filter((r) => r.status === PASS).length;
const failed = results.filter((r) => r.status === FAIL).length;

console.log("\n=== Wave 2f Verification ===\n");
for (const r of results) {
  const icon = r.status === PASS ? "✓" : "✗";
  console.log(`${icon} [${r.system}] ${r.iu}: ${r.description}`);
  if (r.status === FAIL) console.log(`    → FAIL: ${r.detail}`);
}
console.log(`\n${passed}/${results.length} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
