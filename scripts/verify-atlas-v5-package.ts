import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const docxPath = "docs/ONX_ATLAS_V5_COMPLETE_EXECUTION_PACKAGE_v1.0.docx";
const builderPath = "scripts/build_onx_atlas_v5.py";
const evidenceDir = "evidence/ATLAS-V5/2026-06-23/test";
const jsonOut =
  "evidence/ATLAS-V5/2026-06-23/test/EV-TEST_ATLAS-V5_20260623_package-verification.json";
const logOut =
  "evidence/ATLAS-V5/2026-06-23/test/EV-TEST_ATLAS-V5_20260623_package-verification.log";

type Check = {
  id: string;
  name: string;
  pass: boolean;
  detail: string;
};

const expectedTrains = "LMNOPQRSTUVWXYZ".split("");

function normalizeDocxXml(xml: string): string {
  return xml
    .replace(/<w:tab\/>/g, "\t")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function readDocxText(path: string): string {
  const result = spawnSync("unzip", ["-p", path, "word/document.xml"]);
  if (result.status !== 0) {
    const stderr = result.stderr.toString();
    throw new Error(`Unable to extract DOCX XML: ${stderr}`);
  }
  return normalizeDocxXml(result.stdout.toString());
}

function uniqueMatches(text: string, pattern: RegExp): string[] {
  return Array.from(text.matchAll(pattern), (match) => match[0]).filter(
    (value, index, values) => values.indexOf(value) === index,
  );
}

function countByTrain(text: string, prefix: "WP" | "AC") {
  return Object.fromEntries(
    expectedTrains.map((train) => [
      train,
      uniqueMatches(
        text,
        prefix === "WP"
          ? new RegExp(`WP-${train}-\\d{2}`, "g")
          : new RegExp(`AC-${train}-\\d{2}-\\d{2}`, "g"),
      ).length,
    ]),
  );
}

function check(id: string, name: string, pass: boolean, detail: string): Check {
  return { id, name, pass, detail };
}

mkdirSync(evidenceDir, { recursive: true });

const checks: Check[] = [];
let text = "";

checks.push(
  check(
    "ATLAS-V5-VERIFY-01",
    "DOCX deliverable exists",
    existsSync(docxPath),
    docxPath,
  ),
);
checks.push(
  check(
    "ATLAS-V5-VERIFY-02",
    "Deterministic builder exists",
    existsSync(builderPath),
    builderPath,
  ),
);

if (existsSync(docxPath)) {
  const size = statSync(docxPath).size;
  checks.push(
    check(
      "ATLAS-V5-VERIFY-03",
      "DOCX file is non-empty",
      size > 40_000,
      `${basename(docxPath)} size=${size} bytes`,
    ),
  );
  text = readDocxText(docxPath);
} else {
  checks.push(
    check("ATLAS-V5-VERIFY-03", "DOCX file is non-empty", false, "missing"),
  );
}

if (text.length > 0) {
  const trainHeadings = expectedTrains.filter((train) =>
    text.includes(`Train ${train}:`),
  );
  const wpIds = uniqueMatches(text, /WP-[L-Z]-\d{2}/g);
  const acIds = uniqueMatches(text, /AC-[L-Z]-\d{2}-\d{2}/g);
  const wpByTrain = countByTrain(text, "WP");
  const acByTrain = countByTrain(text, "AC");

  checks.push(
    check(
      "ATLAS-V5-VERIFY-04",
      "15 train headings exist from L through Z",
      trainHeadings.length === 15,
      `found=${trainHeadings.join(",")}`,
    ),
  );
  checks.push(
    check(
      "ATLAS-V5-VERIFY-05",
      "75 unique work package IDs exist",
      wpIds.length === 75,
      `found=${wpIds.length}`,
    ),
  );
  checks.push(
    check(
      "ATLAS-V5-VERIFY-06",
      "750 unique acceptance criterion IDs exist",
      acIds.length === 750,
      `found=${acIds.length}`,
    ),
  );
  checks.push(
    check(
      "ATLAS-V5-VERIFY-07",
      "Each train has exactly five WPs",
      Object.values(wpByTrain).every((count) => count === 5),
      JSON.stringify(wpByTrain),
    ),
  );
  checks.push(
    check(
      "ATLAS-V5-VERIFY-08",
      "Each train has exactly 50 criteria",
      Object.values(acByTrain).every((count) => count === 50),
      JSON.stringify(acByTrain),
    ),
  );
  checks.push(
    check(
      "ATLAS-V5-VERIFY-09",
      "Master acceptance and evidence sections exist",
      [
        "Part 5: Master Acceptance Matrix",
        "Part 6: Master Evidence Standard",
        "Part 9: Kimi Verification Instructions",
        "Part 10: Founder Finalization Clause",
      ].every((section) => text.includes(section)),
      "checked Parts 5, 6, 9, and 10",
    ),
  );
  checks.push(
    check(
      "ATLAS-V5-VERIFY-10",
      "Founder target language states 750/750 PASS",
      text.includes("750/750 PASS"),
      "requires exact final acceptance target",
    ),
  );
}

const passCount = checks.filter((item) => item.pass).length;
const failCount = checks.length - passCount;
const exitCode = failCount === 0 ? 0 : 1;
const timestamp = new Date().toISOString();

const report = {
  suite: "ATLAS-V5 package validation and verification",
  timestamp,
  deliverable: docxPath,
  builder: builderPath,
  expected: {
    trains: 15,
    workPackages: 75,
    acceptanceCriteria: 750,
    trainRange: "L-Z",
  },
  results: checks,
  summary: {
    pass: passCount,
    fail: failCount,
    exitCode,
  },
};

const logLines = [
  "$ bun run test:atlas-v5",
  ...checks.map(
    (item) =>
      `${timestamp} ${item.pass ? "PASS" : "FAIL"} ${item.id} ${item.name} - ${
        item.detail
      }`,
  ),
  `Results: ${passCount} passed, ${failCount} failed`,
  `EXIT_CODE:${exitCode}`,
  "",
];

writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(logOut, logLines.join("\n"));

console.log(logLines.join("\n"));

if (exitCode !== 0) {
  process.exit(exitCode);
}
