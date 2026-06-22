import { strict as assert } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const root = process.cwd();

export function readProjectFile(path: string) {
  const absolute = join(root, path);
  assert.ok(existsSync(absolute), `${path} exists`);
  return readFileSync(absolute, "utf8");
}

export function assertIncludes(path: string, expected: string) {
  assert.ok(
    readProjectFile(path).includes(expected),
    `${path} includes ${expected}`,
  );
}

export async function runWpTests(
  tests: ReadonlyArray<{
    id: string;
    name: string;
    fn: () => void | Promise<void>;
  }>,
) {
  let passed = 0;
  let failed = 0;
  for (const test of tests) {
    const timestamp = new Date().toISOString();
    try {
      await test.fn();
      console.log(`${timestamp} PASS ${test.id} ${test.name}`);
      passed++;
    } catch (error) {
      console.log(`${timestamp} FAIL ${test.id} ${test.name}: ${error}`);
      failed++;
    }
  }
  console.log(`Results: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}
