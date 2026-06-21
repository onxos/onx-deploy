import { registerInputSchema, toRegisterBody } from "@/server/auth/register";

type Scenario = {
  id: string;
  input: unknown;
  expected: "PASS" | "FAIL";
};

const scenarios: Scenario[] = [
  {
    id: "S01-valid-founder-length-password",
    input: {
      email: "Husam.Valid+EP02@example.com",
      password: "StrongPassw0rd!",
      name: "Husam Operator",
    },
    expected: "PASS",
  },
  {
    id: "S02-invalid-email-rejected",
    input: {
      email: "not-an-email",
      password: "StrongPassw0rd!",
      name: "Husam Operator",
    },
    expected: "FAIL",
  },
  {
    id: "S03-short-password-rejected",
    input: {
      email: "short-password@example.com",
      password: "short",
      name: "Husam Operator",
    },
    expected: "FAIL",
  },
  {
    id: "S04-empty-name-rejected",
    input: {
      email: "empty-name@example.com",
      password: "StrongPassw0rd!",
      name: " ",
    },
    expected: "FAIL",
  },
  {
    id: "S05-unknown-role-injection-rejected",
    input: {
      email: "role-injection@example.com",
      password: "StrongPassw0rd!",
      name: "Role Injection",
      role: "founder",
    },
    expected: "FAIL",
  },
  {
    id: "S06-email-normalized-on-accepted-input",
    input: {
      email: "NORMALIZE.ME@EXAMPLE.COM",
      password: "StrongPassw0rd!",
      name: "Normalize Me",
    },
    expected: "PASS",
  },
];

const results = scenarios.map((scenario) => {
  const parsed = registerInputSchema.safeParse(scenario.input);
  const actual: "PASS" | "FAIL" = parsed.success ? "PASS" : "FAIL";
  const normalized =
    parsed.success && scenario.id === "S06-email-normalized-on-accepted-input"
      ? toRegisterBody(parsed.data).email
      : undefined;

  return {
    id: scenario.id,
    expected: scenario.expected,
    actual,
    ok: actual === scenario.expected,
    normalized,
  };
});

const failed = results.filter((result) => !result.ok);

console.log(
  JSON.stringify({ scenarioCount: results.length, results }, null, 2),
);

if (failed.length > 0) {
  console.error("auth.register scenario failures:");
  for (const failure of failed) {
    console.error(
      `- ${failure.id}: expected ${failure.expected}, got ${failure.actual}`,
    );
  }
  process.exit(1);
}
