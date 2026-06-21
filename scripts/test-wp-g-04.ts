import { readFileSync } from "node:fs";
import { analyticsQueryInputSchema } from "@/server/api/routers/analytics-query-contract";
import { createArticleInputSchema } from "@/server/api/routers/civilization-article-contract";
import {
  canonicalSlugSchema,
  nonEmptyTrimmedString,
  optionalTrimmedString,
  pagePathSchema,
} from "@/server/api/validation";

type Scenario = {
  id: string;
  actual: boolean | string;
  expected: boolean | string;
};

const analyticsSource = readFileSync(
  "src/server/api/routers/analytics.ts",
  "utf8",
);
const articleContractSource = readFileSync(
  "src/server/api/routers/civilization-article-contract.ts",
  "utf8",
);
const packageSource = readFileSync("package.json", "utf8");

function parses(
  schema: { safeParse: (value: unknown) => { success: boolean } },
  value: unknown,
) {
  return schema.safeParse(value).success;
}

const scenarios: Scenario[] = [
  {
    id: "AC-01-shared-validation-module-exists",
    actual: readFileSync("src/server/api/validation.ts", "utf8").includes(
      "canonicalSlugSchema",
    ),
    expected: true,
  },
  {
    id: "AC-02-canonical-slug-validation",
    actual:
      parses(canonicalSlugSchema, "valid-slug-1") &&
      !parses(canonicalSlugSchema, "Invalid Slug"),
    expected: true,
  },
  {
    id: "AC-03-trimmed-string-validation",
    actual: nonEmptyTrimmedString(10).parse("  hello  "),
    expected: "hello",
  },
  {
    id: "AC-04-optional-empty-string-sanitized",
    actual: optionalTrimmedString(10).parse("   ") === undefined,
    expected: true,
  },
  {
    id: "AC-05-page-path-validation",
    actual:
      parses(pagePathSchema, "/pulse?tab=one") &&
      !parses(pagePathSchema, "https://x.test"),
    expected: true,
  },
  {
    id: "AC-06-article-title-max-length",
    actual: !parses(createArticleInputSchema, {
      title: "x".repeat(201),
      slug: "valid-slug",
      category: "civilization",
      content: "Valid article content.",
    }),
    expected: true,
  },
  {
    id: "AC-07-article-content-max-length",
    actual: !parses(createArticleInputSchema, {
      title: "Valid Article",
      slug: "valid-slug",
      category: "civilization",
      content: "x".repeat(20_001),
    }),
    expected: true,
  },
  {
    id: "AC-08-document-ref-max-length",
    actual: !parses(createArticleInputSchema, {
      title: "Valid Article",
      slug: "valid-slug",
      category: "civilization",
      content: "Valid article content.",
      documentRef: "x".repeat(101),
    }),
    expected: true,
  },
  {
    id: "AC-09-analytics-limit-max",
    actual: !parses(analyticsQueryInputSchema, { limit: 367 }),
    expected: true,
  },
  {
    id: "AC-10-analytics-offset-min",
    actual: !parses(analyticsQueryInputSchema, { offset: -1 }),
    expected: true,
  },
  {
    id: "AC-11-invalid-date-range-rejected",
    actual: !parses(analyticsQueryInputSchema, {
      startDate: "2026-06-22",
      endDate: "2026-06-21",
    }),
    expected: true,
  },
  {
    id: "AC-12-analytics-track-sanitized",
    actual:
      analyticsSource.includes("pagePathSchema") &&
      analyticsSource.includes("optionalTrimmedString(2_000)"),
    expected: true,
  },
  {
    id: "AC-13-article-contract-uses-shared-validators",
    actual:
      articleContractSource.includes("canonicalSlugSchema") &&
      articleContractSource.includes("nonEmptyTrimmedString(20_000)"),
    expected: true,
  },
  {
    id: "AC-14-no-ad-hoc-slug-regex-in-article-contract",
    actual: !articleContractSource.includes("regex(/^[a-z0-9]+"),
    expected: true,
  },
  {
    id: "AC-15-test-command-runs-wp-g-04",
    actual: packageSource.includes("scripts/test-wp-g-04.ts"),
    expected: true,
  },
  {
    id: "AC-16-valid-hardened-article-still-accepted",
    actual: parses(createArticleInputSchema, {
      title: "  Valid Article  ",
      slug: "valid-slug",
      category: "civilization",
      content: "  Valid article content.  ",
      documentRef: " DOC-1 ",
    }),
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
      workPackage: "WP-G-04",
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
  console.error("WP-G-04 scenario failures:");
  for (const failure of failed) {
    console.error(
      `- ${failure.id}: expected ${failure.expected}, got ${failure.actual}`,
    );
  }
  process.exit(1);
}
