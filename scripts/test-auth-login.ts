import {
  loginInputSchema,
  toLoginBody,
  toPublicUser,
} from "@/server/auth/login";

type Scenario = {
  id: string;
  input: unknown;
  expected: "PASS" | "FAIL";
};

const scenarios: Scenario[] = [
  {
    id: "S01-valid-login-input-accepted",
    input: {
      email: "Husam.Valid+EP02@example.com",
      password: "StrongPassw0rd!",
    },
    expected: "PASS",
  },
  {
    id: "S02-invalid-email-rejected",
    input: {
      email: "not-an-email",
      password: "StrongPassw0rd!",
    },
    expected: "FAIL",
  },
  {
    id: "S03-short-password-rejected",
    input: {
      email: "short-password@example.com",
      password: "short",
    },
    expected: "FAIL",
  },
  {
    id: "S04-extra-role-injection-rejected",
    input: {
      email: "role-injection@example.com",
      password: "StrongPassw0rd!",
      role: "founder",
    },
    expected: "FAIL",
  },
  {
    id: "S05-email-normalized-on-accepted-input",
    input: {
      email: "NORMALIZE.ME@EXAMPLE.COM",
      password: "StrongPassw0rd!",
    },
    expected: "PASS",
  },
];

const publicUser = toPublicUser({
  id: "user_123",
  email: "normalize.me@example.com",
  name: "Normalize Me",
  role: "founder",
});

const results = scenarios.map((scenario) => {
  const parsed = loginInputSchema.safeParse(scenario.input);
  const actual: "PASS" | "FAIL" = parsed.success ? "PASS" : "FAIL";
  const normalized =
    parsed.success && scenario.id === "S05-email-normalized-on-accepted-input"
      ? toLoginBody(parsed.data).email
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
const passwordLeak = "password" in publicUser || "passwordHash" in publicUser;

console.log(
  JSON.stringify(
    {
      scenarioCount: results.length,
      results,
      publicUser,
      passwordLeak,
    },
    null,
    2,
  ),
);

if (failed.length > 0 || passwordLeak) {
  console.error("auth.login scenario failures:");
  for (const failure of failed) {
    console.error(
      `- ${failure.id}: expected ${failure.expected}, got ${failure.actual}`,
    );
  }
  if (passwordLeak) {
    console.error("- public user leaked a password field");
  }
  process.exit(1);
}
