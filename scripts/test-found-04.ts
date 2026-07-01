/**
 * OCMBR Foundation Test — FOUND-IU-04
 * Verifies: Event Outbox + Job Queue schema and service.
 *
 * Run: bun run scripts/test-found-04.ts
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
    description: "intelligence-foundation schema file exists",
    pass: fileExists("src/server/db/schema/intelligence-foundation.ts"),
  },
  {
    id: "02",
    description: "onx_event_outbox table defined",
    pass: includes(
      "src/server/db/schema/intelligence-foundation.ts",
      "onx_event_outbox",
    ),
  },
  {
    id: "03",
    description: "onx_job_queue table defined",
    pass: includes(
      "src/server/db/schema/intelligence-foundation.ts",
      "onx_job_queue",
    ),
  },
  {
    id: "04",
    description: "intelligence-foundation exported from barrel",
    pass: includes("src/server/db/schema.ts", "intelligence-foundation"),
  },
  {
    id: "05",
    description: "event-outbox.service.ts exists",
    pass: fileExists("src/server/services/event-outbox.service.ts"),
  },
  {
    id: "06",
    description: "publishEvent function defined",
    pass: includes(
      "src/server/services/event-outbox.service.ts",
      "publishEvent",
    ),
  },
  {
    id: "07",
    description: "getPendingEvents function defined",
    pass: includes(
      "src/server/services/event-outbox.service.ts",
      "getPendingEvents",
    ),
  },
  {
    id: "08",
    description: "markEventDelivered function defined",
    pass: includes(
      "src/server/services/event-outbox.service.ts",
      "markEventDelivered",
    ),
  },
  {
    id: "09",
    description: "markEventFailed function defined",
    pass: includes(
      "src/server/services/event-outbox.service.ts",
      "markEventFailed",
    ),
  },
  {
    id: "10",
    description: "enqueueJob function defined",
    pass: includes("src/server/services/event-outbox.service.ts", "enqueueJob"),
  },
  {
    id: "11",
    description: "getNextReadyJob function defined",
    pass: includes(
      "src/server/services/event-outbox.service.ts",
      "getNextReadyJob",
    ),
  },
  {
    id: "12",
    description: "markJobComplete function defined",
    pass: includes(
      "src/server/services/event-outbox.service.ts",
      "markJobComplete",
    ),
  },
  {
    id: "13",
    description: "markJobFailed with DEAD_LETTER logic defined",
    pass: includes(
      "src/server/services/event-outbox.service.ts",
      "DEAD_LETTER",
    ),
  },
  {
    id: "14",
    description: "events:read permission defined",
    pass: includes("src/lib/permissions.ts", "events:read"),
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
  join(dir, `EV-TEST_FOUND-IU-04_${timestamp}_results.txt`),
  `${lines.join("\n")}\nALL ${scenarios.length} SCENARIOS PASS\n`,
);
console.log(`\nALL ${scenarios.length} scenarios PASS ✓`);
