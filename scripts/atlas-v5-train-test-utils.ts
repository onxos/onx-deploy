import { existsSync } from "node:fs";
import { atlasV5ExecutionRecords } from "../src/lib/atlas-v5/execution-records";

type Check = {
  name: string;
  pass: boolean;
};

export function verifyAtlasWorkPackage(wpId: string) {
  const trainId = wpId.split("-")[1];
  const train = atlasV5ExecutionRecords.find((record) => record.id === trainId);
  const wp = train?.workPackages.find((record) => record.id === wpId);
  const evidenceRoot = "evidence/EP-05/2026-06-24";
  const compact = wpId.replaceAll("-", "-");

  const checks: Check[] = [
    { name: `${wpId} train exists`, pass: Boolean(train) },
    { name: `${wpId} implementation record exists`, pass: Boolean(wp) },
    { name: `${wpId} route is bound`, pass: Boolean(wp?.route) },
    { name: `${wpId} owner is assigned`, pass: Boolean(wp?.owner) },
    {
      name: `${wpId} acceptance count is complete`,
      pass: wp?.acceptancePassed === 10 && wp.acceptanceTotal === 10,
    },
    {
      name: `${wpId} status is PASS`,
      pass: wp?.status === "PASS",
    },
    {
      name: `${wpId} code evidence exists`,
      pass: existsSync(
        `${evidenceRoot}/code/EV-CODE_${compact}_20260624_implementation.txt`,
      ),
    },
    {
      name: `${wpId} acceptance evidence exists`,
      pass: existsSync(
        `${evidenceRoot}/acceptance/EV-ACPT_${compact}_20260624_checklist.md`,
      ),
    },
    {
      name: `${wpId} deployment evidence exists`,
      pass: existsSync(
        `${evidenceRoot}/deployment/EV-DEPL_${compact}_20260624_build-lint.txt`,
      ),
    },
    {
      name: `${wpId} reviewer closure language exists`,
      pass: Boolean(train?.residualRisk && train.nextStep),
    },
  ];

  for (const check of checks) {
    const status = check.pass ? "PASS" : "FAIL";
    console.log(`${new Date().toISOString()} ${status} ${check.name}`);
  }

  const failed = checks.filter((check) => !check.pass);
  if (failed.length > 0) {
    console.error(`${wpId} failed ${failed.length}/${checks.length} checks`);
    process.exit(1);
  }

  console.log(`${wpId} PASS ${checks.length}/${checks.length}`);
}
