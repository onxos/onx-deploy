import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export type Scenario = {
  id: string;
  description: string;
  pass: boolean;
};

export function fileExists(path: string) {
  return existsSync(join(process.cwd(), path));
}

export function read(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

export function includes(path: string, text: string) {
  return fileExists(path) && read(path).includes(text);
}

export function runWpTest(wpId: string, scenarios: Scenario[]) {
  const timestamp = new Date().toISOString();
  const lines = scenarios.map(
    (scenario) =>
      `${timestamp} ${scenario.pass ? "PASS" : "FAIL"} ${scenario.id} ${scenario.description}`,
  );
  for (const line of lines) console.log(line);

  const failed = scenarios.filter((scenario) => !scenario.pass);
  if (failed.length > 0) {
    throw new Error(`${wpId} failed ${failed.length} scenario(s)`);
  }

  const evidenceDir = join(process.cwd(), "evidence/EP-04/2026-06-21/test");
  mkdirSync(evidenceDir, { recursive: true });
  writeFileSync(
    join(evidenceDir, `EV-TEST_${wpId}_20260621_results.txt`),
    `${lines.join("\n")}\n`,
  );
}
