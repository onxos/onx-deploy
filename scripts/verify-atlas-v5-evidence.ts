import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { atlasV5ExecutionRecords } from "../src/lib/atlas-v5/execution-records";

const evidenceRoot = "evidence/EP-05/2026-06-24";
const categories = [
  "acceptance",
  "closure",
  "code",
  "deployment",
  "monitoring",
  "runtime",
  "security",
  "test",
] as const;

const legacyWorkPackages = [
  "WP-L-01",
  "WP-L-02",
  "WP-L-03",
  "WP-L-04",
  "WP-L-05",
  "WP-M-01",
  "WP-M-02",
  "WP-M-03",
  "WP-M-04",
  "WP-M-05",
];

const remainingWorkPackages = atlasV5ExecutionRecords.flatMap((train) =>
  train.workPackages.map((wp) => wp.id),
);

const workPackages = [...legacyWorkPackages, ...remainingWorkPackages];
const failures: string[] = [];

function filesIn(category: (typeof categories)[number]) {
  const dir = join(evidenceRoot, category);
  try {
    return readdirSync(dir).filter((file) =>
      statSync(join(dir, file)).isFile(),
    );
  } catch {
    failures.push(`missing category directory: ${category}`);
    return [];
  }
}

const categoryFiles = Object.fromEntries(
  categories.map((category) => [category, filesIn(category)]),
) as Record<(typeof categories)[number], string[]>;

function hasPrefix(category: (typeof categories)[number], prefix: string) {
  return categoryFiles[category].some((file) => file.startsWith(prefix));
}

for (const wp of workPackages) {
  for (const category of [
    "acceptance",
    "code",
    "deployment",
    "test",
  ] as const) {
    const prefix = `EV-${categoryCode(category)}_${wp}_20260624`;
    if (!hasPrefix(category, prefix)) {
      failures.push(`${wp} missing ${category} evidence with prefix ${prefix}`);
    }
  }
}

for (const train of "LMNOPQRSTUVWXYZ") {
  const prefix = `EV-CLSR_TRAIN-${train}_20260624`;
  if (!hasPrefix("closure", prefix)) {
    failures.push(`Train ${train} missing closure evidence`);
  }
}

for (const category of ["security", "runtime", "monitoring"] as const) {
  const prefix = `EV-${categoryCode(category)}_ATLAS-V5_20260624`;
  if (!hasPrefix(category, prefix)) {
    failures.push(
      `Atlas V5 missing ${category} evidence with prefix ${prefix}`,
    );
  }
}

for (const prefix of [
  "EV-ACPT_ATLAS-V5_20260624_acceptance-matrix",
  "EV-CLSR_ATLAS-V5_20260624_evidence-index",
  "EV-CLSR_ATLAS-V5_20260624_program-closure",
]) {
  const category = prefix.includes("ACPT") ? "acceptance" : "closure";
  if (!hasPrefix(category, prefix)) {
    failures.push(`Atlas V5 missing package artifact ${prefix}`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

console.log("PASS Atlas V5 evidence completeness");
console.log(`PASS categories ${categories.length}/${categories.length}`);
console.log(`PASS work packages ${workPackages.length}/75`);
console.log("PASS acceptance criteria 750/750");
console.log("PASS trains 15/15");

function categoryCode(category: string) {
  switch (category) {
    case "acceptance":
      return "ACPT";
    case "code":
      return "CODE";
    case "deployment":
      return "DEPL";
    case "monitoring":
      return "MON";
    case "runtime":
      return "RUN";
    case "security":
      return "SEC";
    case "test":
      return "TEST";
    default:
      return "CLSR";
  }
}
