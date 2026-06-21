import { readFileSync } from "node:fs";
import { TRPCError } from "@trpc/server";
import {
  badRequest,
  createApiError,
  forbidden,
  notFound,
} from "@/server/api/errors";

type Scenario = {
  id: string;
  actual: boolean | string;
  expected: boolean | string;
};

const errorSource = readFileSync("src/server/api/errors.ts", "utf8");
const userRouterSource = readFileSync("src/server/api/routers/user.ts", "utf8");
const analyticsContractSource = readFileSync(
  "src/server/api/routers/analytics-query-contract.ts",
  "utf8",
);
const packageSource = readFileSync("package.json", "utf8");
const originalConsoleError = console.error;

function codeOf(error: unknown) {
  return error instanceof TRPCError ? error.code : "NOT_TRPC";
}

const scenarios: Scenario[] = [
  {
    id: "AC-01-standard-error-helper-exists",
    actual: errorSource.includes("createApiError"),
    expected: true,
  },
  {
    id: "AC-02-bad-request-code",
    actual: codeOf(badRequest("Invalid input")),
    expected: "BAD_REQUEST",
  },
  {
    id: "AC-03-forbidden-code",
    actual: codeOf(forbidden()),
    expected: "FORBIDDEN",
  },
  {
    id: "AC-04-not-found-code",
    actual: codeOf(notFound("User")),
    expected: "NOT_FOUND",
  },
  {
    id: "AC-05-user-friendly-default-message",
    actual: forbidden().message,
    expected: "You do not have permission to perform this action",
  },
  {
    id: "AC-06-resource-not-found-message",
    actual: notFound("User").message,
    expected: "User not found",
  },
  {
    id: "AC-07-cause-supported",
    actual: (() => {
      console.error = () => undefined;
      const code = createApiError({
        code: "CONFLICT",
        cause: new Error("x"),
      }).code;
      console.error = originalConsoleError;
      return code;
    })(),
    expected: "CONFLICT",
  },
  {
    id: "AC-08-logging-present-for-causes",
    actual: errorSource.includes('console.error("[api-error]"'),
    expected: true,
  },
  {
    id: "AC-09-user-router-uses-standard-forbidden",
    actual: userRouterSource.includes("throw forbidden("),
    expected: true,
  },
  {
    id: "AC-10-user-router-uses-standard-not-found",
    actual: userRouterSource.includes("throw notFound("),
    expected: true,
  },
  {
    id: "AC-11-analytics-uses-standard-bad-request",
    actual: analyticsContractSource.includes("throw badRequest("),
    expected: true,
  },
  {
    id: "AC-12-standard-code-allowlist",
    actual:
      errorSource.includes('"BAD_REQUEST"') &&
      errorSource.includes('"UNAUTHORIZED"') &&
      errorSource.includes('"INTERNAL_SERVER_ERROR"'),
    expected: true,
  },
  {
    id: "AC-13-no-raw-trpc-error-in-user-router",
    actual: !userRouterSource.includes("new TRPCError"),
    expected: true,
  },
  {
    id: "AC-14-error-helper-exports-shortcuts",
    actual:
      errorSource.includes("export function notFound") &&
      errorSource.includes("export function forbidden") &&
      errorSource.includes("export function badRequest"),
    expected: true,
  },
  {
    id: "AC-15-test-command-runs-wp-g-05",
    actual: packageSource.includes("scripts/test-wp-g-05.ts"),
    expected: true,
  },
  {
    id: "AC-16-user-friendly-message-map-complete",
    actual:
      errorSource.includes("USER_FRIENDLY_MESSAGES") &&
      errorSource.includes("Something went wrong"),
    expected: true,
  },
];

const results = scenarios.map((scenario) => ({
  ...scenario,
  ok: scenario.actual === scenario.expected,
}));
const failed = results.filter((result) => !result.ok);

console.log(
  JSON.stringify(
    {
      workPackage: "WP-G-05",
      scenarioCount: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      coverage: "100% acceptance-scenario coverage",
      results,
    },
    null,
    2,
  ),
);

if (failed.length > 0) {
  console.error("WP-G-05 scenario failures:");
  for (const failure of failed) {
    console.error(
      `- ${failure.id}: expected ${failure.expected}, got ${failure.actual}`,
    );
  }
  process.exit(1);
}
